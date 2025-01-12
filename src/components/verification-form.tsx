"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from 'sonner'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

// Validation schema for verification code
const formSchema = z.object({
    code: z.string().min(6, {
        message: "Verification code must be at least 6 characters.",
    }),
})

interface VerificationFormProps {
    signUp: any
    email: string
}

export function VerificationForm({ signUp, email }: VerificationFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const router = useRouter()

    // Initialize form with Zod schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    })

    // Handle verification code submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isSubmitting) return

        try {
            setIsSubmitting(true)

            // Attempt to verify the email address
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: values.code,
            })

            if (completeSignUp.status !== "complete") {
                throw new Error("Verification failed")
            }

            // Set the active session
            if (completeSignUp.createdSessionId) {
                await setActive({ session: completeSignUp.createdSessionId })
                router.push("/dashboard")
            }
        } catch (error) {
            console.error('Verification error:', error)
            toast.error("Verification Failed", {
                description: "Please check the code and try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Verify your email
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        We sent a verification code to {email}
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter verification code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Verify Email
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

// Helper function to set the active session
async function setActive({ session }: { session: any }) {
    try {
        // Here you would implement your session management logic
        console.log("Session activated:", session)
    } catch (error) {
        console.error("Failed to set active session:", error)
        throw new Error("Failed to set active session")
    }
}