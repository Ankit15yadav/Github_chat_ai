'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import React from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism"

type Props = {
    fileReference: {
        fileName: string
        sourceCode: string
        summary: string
    }[]
}

const CodeReferences = ({ fileReference }: Props) => {
    const [tab, setTab] = React.useState(fileReference[0]?.fileName)
    return (
        <div className='max-w-[90vw] '>
            <Tabs value={tab} onValueChange={setTab} >
                <div className='overflow-y-hidden flex gap-2 bg-gray-200 p-1 rounded-md'>
                    {fileReference.map((file, index) => (
                        <button
                            key={index}
                            onClick={() => setTab(file.fileName)}
                            className={cn(
                                'px-3 overflow-y-hidden py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground',
                                {
                                    'bg-primary text-primary-foreground': tab === file.fileName,

                                }
                            )}
                        >
                            {file.fileName}
                        </button>
                    ))}
                </div>
                {
                    fileReference.map((file, index) => (
                        <TabsContent key={index} value={file.fileName} className='max-h-[40vh] overflow-scroll max-w-7xl'>
                            <SyntaxHighlighter language='typescript' style={lucario}>
                                {file.sourceCode}
                            </SyntaxHighlighter>
                        </TabsContent>
                    ))
                }
            </Tabs>
        </div>
    )
}

export default CodeReferences