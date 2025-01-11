'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useProjects from '@/hooks/use-project'
import { api } from '@/trpc/react';
import React from 'react'
import AskQuestionCard from '../dashboard/ask-question-card';
import MDEditor from '@uiw/react-md-editor';
import CodeReferences from '../dashboard/code-reference';

type Props = {}

const QAPage = (props: Props) => {

    const { projectId } = useProjects();
    const { data: questions } = api.project.getQuestions.useQuery({ projectId });
    const [questionIndex, setQuestionIndex] = React.useState(0);
    const question = questions?.[questionIndex];

    return (
        <Sheet>
            <AskQuestionCard />
            <div className="h-4"></div>
            <h1 className='text-xl font-semibold'>Saved Questions</h1>
            <div className="h-2"></div>
            <div className='flex flex-col gap-2'>
                {
                    questions?.map((question, index) => {
                        return (
                            <React.Fragment key={question.id}>
                                <SheetTrigger onClick={() => setQuestionIndex(index)}>
                                    <div className='flex items-center gap-4 bg-white rounded-lg p-4 shadow border'>
                                        <div className='text-left flex flex-col'>
                                            <div className='flex items-center gap-2'>
                                                <p className='text-gray-700 line-clamp-1 text-1 font-medium'>
                                                    {question.question}
                                                </p>
                                                <span className='text-xs text-gray-400 whitespace-nowrap'>
                                                    {question?.createdAt.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className='text-gray-500 line-clamp-1 text-sm'>
                                                {question.answer}
                                            </p>
                                        </div>
                                    </div>
                                </SheetTrigger>
                            </React.Fragment>
                        )
                    })
                }
            </div>
            {
                question && (
                    <SheetContent className='sm:max-w-[80vw] flex flex-col'>
                        <SheetHeader>
                            <SheetTitle>
                                {question.question}
                            </SheetTitle>
                        </SheetHeader>
                        <div className='flex-grow overflow-auto py-4 w-full'>
                            <div className='flex flex-col gap-4 h-full'>
                                {/* Markdown Editor Section */}
                                <div className='flex-1 overflow-auto rounded-md border'>
                                    <MDEditor.Markdown
                                        source={question.answer}
                                        style={{ padding: '10px', }}
                                    />
                                </div>
                                {/* Code References Section */}
                                <CodeReferences fileReference={(question.fileReferences ?? []) as any} />
                            </div>
                        </div>
                    </SheetContent>
                )
            }
        </Sheet>
    )
}

export default QAPage;
