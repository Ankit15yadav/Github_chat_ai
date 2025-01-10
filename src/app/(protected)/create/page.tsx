'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {}

type FormInput = {
    repoUrl: string,
    projectName: string,
    githubToken?: string
}

const CreatePage = (props: Props) => {

    const { register, handleSubmit, reset } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation()
    const refetch = useRefetch()

    const onSubmit = (data: FormInput) => {
        // window.alert(JSON.stringify(data, null, 2))
        createProject.mutate(
            {
                githubUrl: data.repoUrl,   // Ensure repoUrl is being passed as githubUrl
                name: data.projectName,    // projectName corresponds to name
                githubToken: data.githubToken!,  // githubToken should be passed if optional
            },
            {
                onSuccess: () => {
                    toast.success('Project created successfully');
                    refetch()
                    reset();
                },
                onError: (error) => {
                    console.error('Error creating project:', error);  // Log the error for better insights
                    toast.error('Failed to create project');
                },
            }
        );

    }

    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src='undraw_developer-activity_dn7p.svg' className='h-56 w-auto' />
            <div>
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your Github Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL of your repository to link it
                    </p>
                    <div className="h-4"></div>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                required
                                {...register('projectName', { required: true })}
                                placeholder='Project Name'
                            />
                            <div className="h-4"></div>
                            <Input
                                required
                                {...register('repoUrl', { required: true })}
                                placeholder='Github Repository URL'
                            />
                            <div className="h-4"></div>
                            <Input
                                required={false}
                                {...register('githubToken', { required: false })}
                                placeholder='Github Token (optional for private repos)'
                            />
                            <div className="h-4"></div>
                            <Button type='submit' className='w-full' disabled={createProject.isPending}>
                                Create Project
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePage