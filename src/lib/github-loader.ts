import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { Document } from "@langchain/core/documents"
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5
    })

    const docs = await loader.load();

    return docs;

}

// console.log(await loadGithubRepo('https://github.com/Ankit15yadav/Github_chat_ai'))

// this is how i am getting data

// Document {
//     pageContent: "import \"server-only\";\n\nimport { createHydrationHelpers } from \"@trpc/react-query/rsc\";\nimport { headers } from \"next/headers\";\nimport { cache } from \"react\";\n\nimport { createCaller, type AppRouter } from \"@/server/api/root\";\nimport { createTRPCContext } from \"@/server/api/trpc\";\nimport { createQueryClient } from \"./query-client\";\n\n/**\n * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when\n * handling a tRPC call from a React Server Component.\n */\nconst createContext = cache(async () => {\n  const heads = new Headers(await headers());\n  heads.set(\"x-trpc-source\", \"rsc\");\n\n  return createTRPCContext({\n    headers: heads,\n  });\n});\n\nconst getQueryClient = cache(createQueryClient);\nconst caller = createCaller(createContext);\n\nexport const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(\n  caller,\n  getQueryClient\n);\n",
//     metadata: {
//       source: "src/trpc/server.ts",
//       repository: "https://github.com/Ankit15yadav/Github_chat_ai",
//       branch: "main",
//     },
//     id: undefined,
//   }

const isSummarizableFile = (fileName: string) => {
    const textBasedExtensions = [
        '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.txt', '.config', '.yml', '.yaml'
    ];
    return textBasedExtensions.some(ext => fileName.endsWith(ext));
};


const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        try {
            const fileName = doc.metadata.source;
            if (!isSummarizableFile(fileName)) {
                console.warn(`Skipping non-summarizable file: ${fileName}`);
                return null;
            }

            let summary = await summariseCode(doc);
            if (!summary || summary.trim().length === 0) {
                summary = `File: ${fileName} contains ${doc.pageContent.length} characters.`;
            }
            const embedding = await generateEmbedding(summary);
            return {
                summary,
                embedding,
                sourceCode: doc.pageContent,
                fileName
            };
        } catch (error) {
            console.error(`Error summarizing file ${doc.metadata.source}:`, error);
            return null;
        }
    }));
};


export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);

    const validEmbeddings = allEmbeddings.filter(embedding => embedding !== null); // Filter out nulls

    await Promise.allSettled(validEmbeddings.map(async (embedding) => {
        if (!embedding) return;

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId: projectId,
            }
        });

        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding} :: vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `;
    }));
};
