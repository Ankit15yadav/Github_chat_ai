'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
// import AnimatedBackground from './AnimatedBackground'
import { GitBranch, MessageSquare, Zap } from 'lucide-react'
import { useUser } from '@clerk/nextjs'


export default function Hero() {

    const { user } = useUser()

    return (
        <div className=" overflow-hidden bg-background">
            {/* <AnimatedBackground /> */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        <span className="block">Chat with Your GitHub Repos</span>
                        <span className="block text-primary mt-2">Powered by AI</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Get instant answers about your GitHub repositories. Our AI assistant fetches all the info you need and responds to your questions in real-time.
                    </p>
                    <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                        <div className="rounded-md shadow">
                            <Button asChild size="lg" className="w-full">
                                {
                                    user
                                        ?
                                        (
                                            <Link href={"/dashboard"}>
                                                Get Started
                                            </Link>
                                        )
                                        :
                                        (
                                            <Link href={"/sign-in"}>
                                                Get Started
                                            </Link>
                                        )
                                }
                            </Button>
                        </div>
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Button asChild variant="outline" size="lg" className="w-full">
                                <Link href="">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="pt-6">
                            <div className="flow-root rounded-lg bg-card px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                                            <GitBranch className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium tracking-tight text-foreground">Repository Insights</h3>
                                    <p className="mt-5 text-base text-muted-foreground">
                                        Get detailed information about any GitHub repository instantly.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6">
                            <div className="flow-root rounded-lg bg-card px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                                            <MessageSquare className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium tracking-tight text-foreground">AI-Powered Answers</h3>
                                    <p className="mt-5 text-base text-muted-foreground">
                                        Ask questions about the repo and receive accurate, context-aware responses.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6">
                            <div className="flow-root rounded-lg bg-card px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                                            <Zap className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium tracking-tight text-foreground">Real-Time Updates</h3>
                                    <p className="mt-5 text-base text-muted-foreground">
                                        Stay up-to-date with the latest changes and discussions in your repositories.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

