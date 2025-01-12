'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

export default function CTA() {
    const { isSignedIn } = useAuth()

    return (
        <div className="bg-gradient-to-r from-teal-700 via-teal-900 to-teal-700">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to dive in?</span>
                    <span className="block">Start chatting with your repos today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-teal-100">
                    Experience the power of AI-assisted GitHub repository exploration.
                </p>
                <Button
                    asChild
                    size="lg"
                    className="mt-8 bg-white text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-colors duration-300"
                >
                    <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                        {isSignedIn ? "Go to Dashboard" : "Get started for free"}
                    </Link>
                </Button>
            </div>
        </div>
    )
}

