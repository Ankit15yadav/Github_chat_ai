'use client'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React, { useState } from 'react'
import AppSidebar from './app-sidebar'

type Props = {
    children: React.ReactNode
}

const SidebarLayout = (props: Props) => {
    const [open, setOpen] = useState(false) // Manage the sidebar state manually

    const handleMouseEnter = () => {
        setOpen(true) // Open the sidebar on hover
    }

    const handleMouseLeave = () => {
        setOpen(false) // Close the sidebar on mouse leave
    }

    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            <div
                className="flex"
                onMouseEnter={handleMouseEnter} // Expand sidebar on hover
                onMouseLeave={handleMouseLeave} // Collapse sidebar on leave
            >
                <AppSidebar />
            </div>
            <main className="w-full m-2">
                <div className="flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4">
                    <div className='sm:hidden'>
                        <SidebarTrigger />
                    </div>
                    <div className="ml-auto"></div>
                    <UserButton />
                </div>
                <div className="h-4"></div>
                <div className="border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4">
                    {props.children}
                </div>
            </main>

        </SidebarProvider>
    )
}

export default SidebarLayout
