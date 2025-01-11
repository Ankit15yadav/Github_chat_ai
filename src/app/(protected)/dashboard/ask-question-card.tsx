'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProjects from '@/hooks/use-project'
import Image from 'next/image'
import React from 'react'
import { askQuestion } from './action'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from "@uiw/react-md-editor"
import { set } from 'date-fns'
import CodeReferences from './code-reference'
import { api } from '@/trpc/react'
import { toast } from 'sonner'

type Props = {}

const AskQuestionCard = (props: Props) => {
    const { project, projectId } = useProjects()
    const [question, setQuestion] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [fileReferences, setFileReferences] = React.useState<Array<{ fileName: string; sourceCode: string; summary: string }>>([])
    const [answer, setAnswer] = React.useState('')
    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFileReferences([])
        if (!project?.id) return;
        e.preventDefault()

        // window.alert(question)
        setLoading(true)

        const { output, fileReferences } = await askQuestion(question, project?.id!)
        setOpen(true)
        setFileReferences(fileReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setLoading(false)

    }

    return (
        <>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[80vw] h-[95vh] flex  flex-col">
                    {/* Header section */}
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className='flex items-center gap-x-4'>
                            <Image src="/github.png" alt="Logo" width={40} height={40} />
                            <span className="text-xl font-semibold text-gray-800">AI Code Explanation</span>
                            <Button
                                disabled={saveAnswer.isPending}
                                onClick={() => {
                                    saveAnswer.mutate({
                                        projectId: projectId,
                                        question,
                                        answer,
                                        fileReferences
                                    },
                                        {
                                            onSuccess: () => {
                                                toast.success('Answer saved successfully')
                                            },

                                            onError: () => {
                                                toast.error('Error saving answer')
                                            }
                                        })
                                }}
                            >
                                {
                                    saveAnswer.isPending ? 'Saving...' : 'Save Answer'
                                }
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Main content section - uses flex-grow to take remaining space */}
                    <div className='flex-grow overflow-hidden py-2 w-full'>
                        {/* Content wrapper with proper height constraints */}
                        <div className='h-full flex flex-col gap-4'>
                            {/* Markdown section with controlled height */}
                            <div className='flex-1 min-h-0'>
                                <MDEditor.Markdown
                                    style={{
                                        padding: '10px',
                                        height: '100%'
                                    }}
                                    source={answer}
                                    className='w-full h-full overflow-auto rounded-md border'
                                />
                            </div>


                            <CodeReferences fileReference={fileReferences} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


            <Card className='relative col-span-3'>
                <CardHeader>
                    <CardTitle>Ask a question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea
                            required
                            placeholder='Which file should I look at to fix this error'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className="h-4"></div>
                        <Button type='submit' disabled={loading} >Ask Github</Button>
                    </form>
                </CardContent>
            </Card>
        </>

    )
}
export default AskQuestionCard
