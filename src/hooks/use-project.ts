import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from "usehooks-ts"

type Props = {}

const useProjects = () => {
    const { data: projects } = api.project.getProjects.useQuery()
    const [projectId, setprojectId] = useLocalStorage('github_projectid', '')
    const project = projects?.find(project => project.id === projectId)
    return {
        projects,
        project,
        setprojectId,
        projectId
    }
}

export default useProjects