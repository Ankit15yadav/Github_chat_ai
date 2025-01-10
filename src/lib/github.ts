import { db } from "@/server/db"
import { Octokit } from "octokit"
import axios from 'axios'
import { AIsummariseCommit } from "./gemini"

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const githubUrl = 'https://github.com/Ankit15yadav/Github_chat_ai'

type Response = {
    commitHash: string,
    commitMessage: string,
    commitDate: string,
    commitAuthorName: string,
    commitAuthorAvatar: string,

}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const parts = githubUrl.split('/')
    const owner = parts[parts.length - 2]
    const repo = parts[parts.length - 1]
    if (!owner || !repo) {
        throw new Error('Invalid GitHub URL')
    }

    const { data } = await octokit.rest.repos.listCommits({
        owner: owner,
        repo: repo,
    })

    const sortedCommit = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime())

    return sortedCommit.slice(0, 10).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? '',
        commitDate: commit.commit.author?.date ?? '',
        commitAuthorName: commit.commit.author?.name ?? '',
        commitAuthorAvatar: commit.author?.avatar_url ?? '',
    }))
}
export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId)

    const commitHashes = await getCommitHashes(githubUrl!)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    // console.log("unprocess", unprocessedCommits)
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommit(githubUrl!, commit.commitHash)

    }))

    const summaries = summaryResponses.map((response) => {
        if (response.status === 'fulfilled') {
            return response.value
        }
        return ''
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            // First, let's ensure we have a matching unprocessed commit
            const unprocessedCommit = unprocessedCommits[index];

            // Throw an error if there's no matching commit
            if (!unprocessedCommit) {
                throw new Error(`No matching unprocessed commit found for summary at index ${index}`);
            }

            return {
                projectId: projectId,
                commitHash: unprocessedCommit.commitHash,
                commitMessage: unprocessedCommit.commitMessage,
                commitAuthorName: unprocessedCommit.commitAuthorName,
                commitAuthorAvatar: unprocessedCommit.commitAuthorAvatar,
                commitDate: unprocessedCommit.commitDate,
                summary: summary,
            }
        })
    })

    return commits
}

async function summariseCommit(githubUrl: string, commitHash: string) {
    // get the diff and pass the diff to ai
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })

    return await AIsummariseCommit(data) || ""


}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }
    })

    return { project, githubUrl: project?.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId: projectId,
        },
    })

    const unprocessedCommitsHashes = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommitsHashes

}

await pollCommits('cm5qvwo4a0000j4977tmh3ip8').then(console.log)