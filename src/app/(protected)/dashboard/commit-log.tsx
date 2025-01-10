'use client'

import useProjects from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const CommitLog = (props: Props) => {
    const { projectId, project } = useProjects();
    const { data: commits } = api.project.getCommits.useQuery({
        projectId: projectId!
    })

    return (
        <div className="max-w-full overflow-hidden">
            <ul className='space-y-6'>
                {commits?.map((commit, commitIdx) => (
                    <li key={commit.id} className='relative flex gap-x-4'>
                        <div className={cn(
                            commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6',
                            'absolute left-0 top-0 flex w-6 justify-center'
                        )}>
                            <div className='w-px translate-x-1 bg-gray-200' />
                        </div>

                        <img
                            src={commit.commitAuthorAvatar}
                            alt='commit author avatar'
                            className='relative mt-4 size-8 flex-none rounded-full bg-gray-50'
                        />

                        <div className='flex-auto min-w-0 rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200'>
                            <div className='flex justify-between gap-x-4'>
                                <Link
                                    target='_blank'
                                    href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                                    className='py-0.5 text-xs leading-5 text-gray-500 hover:text-gray-700 transition-colors'
                                >
                                    <span className='font-medium text-gray-900'>
                                        {commit.commitAuthorName}
                                    </span>
                                    {" "}
                                    <span className='inline-flex items-center'>
                                        commited
                                        <ExternalLink className='ml-1 size-4' />
                                    </span>
                                </Link>
                            </div>

                            <div className='font-semibold break-words'>
                                {commit.commitMessage}
                            </div>

                            <pre className='mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-500 overflow-x-auto'>
                                {commit.summary}
                            </pre>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CommitLog