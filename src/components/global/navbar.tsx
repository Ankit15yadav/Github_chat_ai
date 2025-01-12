'use client'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import AnimatedGreeting from './animated-greeting'
import { Github, Menu, X } from 'lucide-react'

const Navbar = () => {
    const { user } = useUser();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b shadow-xl rounded-full">
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

                    {/* Animated Greeting - Desktop Only */}
                    <div className="hidden lg:block">
                        <AnimatedGreeting />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            className="p-2 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Links and Authentication Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {!user ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <Button asChild>
                                    <Link href="/dashboard" className="">
                                        Dashboard
                                    </Link>
                                </Button>
                                <div className="hover:opacity-80 flex transition-opacity">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: 'w-8 h-8',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="hover:opacity-80 flex transition-opacity">
                                    <Link
                                        href="https://github.com/Ankit15yadav"
                                        target="_blank"
                                    >
                                        <Github size={20} />
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white shadow-lg border-t border-gray-200">
                    <div className="flex flex-col space-y-2 px-4 py-4">
                        {!user ? (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="block text-gray-800 hover:bg-gray-100 p-2 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="block bg-primary text-white hover:bg-primary/90 p-2 rounded-lg text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block text-gray-800 hover:bg-gray-100 p-2 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="https://github.com/Ankit15yadav"
                                    className="block text-gray-800 hover:bg-gray-100 p-2 rounded-lg"
                                    target="_blank"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    GitHub
                                </Link>
                                <div className="hover:opacity-80 flex justify-center">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: 'w-8 h-8',
                                            },
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
