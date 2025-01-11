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

console.log(await loadGithubRepo('https://github.com/Ankit15yadav/Github_chat_ai'))

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

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken!);
    const allEmbeddings = await generateEmbeddings(docs)

    await Promise.allSettled(allEmbeddings.map(async (embeding, index) => {
        if (!embeding) {
            return
        }

        // const sourcecodeEmbedding = await 
    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}