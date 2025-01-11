import { GoogleGenerativeAI } from "@google/generative-ai"
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const ModelParams = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const AIsummariseCommit = async (diff: string) => {
    const response = await ModelParams.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.

Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line that starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]

EXAMPLE SUMMARY COMMENTS:
\`\`\`
+ Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
+ Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
+ Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
+ Added an OpenAI API for completions [packages/utils/apis/openai.ts]
+ Lowered numeric tolerance for test files
\`\`\`
Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.

Please summarise the following diff file: \n\n${diff}`
    ]);

    return response.response.text()
}

export async function summariseCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
    const code = doc.pageContent.slice(0, 10000); // Limit to 10000 characters
    const response = await ModelParams.generateContent([
        `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects,
        You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file,
        Here is the code:,
        ---,
        ${code},
        ---,
        Give a summary no more than 400 words of the code above,`
    ]);
    return response.response.text();
}

export async function generateEmbedding(summary: string) {
    const model = genAI.getGenerativeModel({
        model: 'text-embedding-004'
    })
    const result = await model.embedContent(summary)
    const embeddings = result.embedding;
    return embeddings.values;
}

// const doc = new Document({
//     pageContent: `import "server-only";

// import { createHydrationHelpers } from "@trpc/react-query/rsc";
// import { headers } from "next/headers";
// import { cache } from "react";

// import { createCaller, type AppRouter } from "@/server/api/root";
// import { createTRPCContext } from "@/server/api/trpc";
// import { createQueryClient } from "./query-client";

// /**
//  * This wraps the \`createTRPCContext\` helper and provides the required context for the tRPC API when
//  * handling a tRPC call from a React Server Component.
//  */
// const createContext = cache(async () => {
//   const heads = new Headers(await headers());
//   heads.set("x-trpc-source", "rsc");

//   return createTRPCContext({
//     headers: heads,
//   });
// });

// const getQueryClient = cache(createQueryClient);
// const caller = createCaller(createContext);

// export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
//   caller,
//   getQueryClient
// );`,
//     metadata: {
//         source: "src/trpc/server.ts",
//         repository: "https://github.com/Ankit15yadav/Github_chat_ai",
//         branch: "main",
//     },
//     id: undefined,
// });

// console.log(await summariseCode(doc));

