'use client'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import AnimatedGreeting from './animated-greeting'
import { Github, GithubIcon } from 'lucide-react'

const Navbar = () => {
    const { user } = useUser();

    return (
        <nav className="sticky top-0 w-full  rounded-full shadow-xl backdrop-blur-md border-b ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand Name */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 hover:opacity-80 transition-opacity">
                            <Image
                                src="/github.png"
                                alt="github"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-tr from-teal-500 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                            NexusCode
                        </span>
                    </div>

                    {/* Animated Greeting */}
                    <AnimatedGreeting />

                    {/* Authentication Buttons */}
                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    className="hover:bg-secondary border text-foreground"
                                    asChild
                                >
                                    <Link href="/sign-in" className="px-2">
                                        Log In
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-colors"
                                >
                                    <Link href="/sign-up" className="px-2">
                                        Sign Up
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="hover:bg-secondary  border text-foreground"
                                >
                                    <Link href="/dashboard" className="">
                                        Dashboard
                                    </Link>
                                </Button>
                                <div className="hover:opacity-80 transition-opacity">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-8 h-8"
                                            }
                                        }}
                                    />
                                </div>
                                <div className="hover:opacity-80 transition-opacity">
                                    <Link href={"#"}>
                                        <Github size={20} />

                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar