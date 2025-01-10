'use client'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import useProjects from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const items = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard
    },
    {
        label: 'Q&A',
        href: '/qa',
        icon: Bot
    },
    {
        label: 'Meetings',
        href: '/meetings',
        icon: Presentation
    },
    {
        label: 'Billing',
        href: '/billing',
        icon: CreditCard
    }
]


const AppSidebar = (props: Props) => {
    const { open } = useSidebar()
    const pathname = usePathname()
    const { projects, projectId, setprojectId } = useProjects()

    return (
        <Sidebar collapsible='icon' variant='floating'>
            <SidebarHeader>
                Logo
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                items.map(item => {
                                    return (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href} className={cn({
                                                    '!bg-primary !text-white': pathname === item.href
                                                }, 'list-none')} >
                                                    <item.icon />
                                                    <span>{item.label} </span>

                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })
                            }
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                projects?.map(project => {
                                    return (
                                        <SidebarMenuItem key={project.name}>
                                            <SidebarMenuButton asChild
                                                onClick={() => setprojectId(project.id)}
                                            >
                                                <div className='cursor-pointer'>
                                                    <div className={cn(
                                                        'rounded-sm border size-6 flex items-center justify-center text-sm  bg-white text-primary',
                                                        {
                                                            'bg-primary text-white': project.id === projectId
                                                        }
                                                    )}>
                                                        {project.name[0]}
                                                    </div>
                                                    <span>{project.name} </span>

                                                </div>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })
                            }
                            <div className="h-2"></div>
                            <div className='flex items-center justify-center'>
                                <SidebarMenuItem>
                                    <Link href={"/create"}>
                                        <Button variant={'outline'} className='w-fit itce' size={'sm'}>
                                            <Plus />
                                            {open && (<p>
                                                Create Project
                                            </p>)}

                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            </div>


                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar