"use client"

import * as React from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast, Toaster } from 'sonner'

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
import { VerificationForm } from "@/components/verification-form"

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
})

export default function SignUpPage() {
    const { signUp, isLoaded, setActive } = useSignUp()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [verificationStep, setVerificationStep] = React.useState(false)
    const router = useRouter()
    const captchaRef = React.useRef<HTMLDivElement>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    })

    React.useEffect(() => {
        if (isLoaded && signUp) {
            const initializeCaptcha = async () => {
                try {
                    await signUp.create({
                        emailAddress: form.getValues("email"),
                    })
                } catch (err) {
                    console.log('CAPTCHA initialized')
                }
            }

            initializeCaptcha()
        }
    }, [isLoaded, signUp, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!isLoaded || isSubmitting) return

        try {
            setIsSubmitting(true)

            const signUpAttempt = await signUp.create({
                emailAddress: values.email,
                password: values.password,
            })

            await signUpAttempt.update({
                firstName: values.firstName,
                lastName: values.lastName,
            })

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

            setVerificationStep(true)
        } catch (error: any) {
            console.error('Sign-up error:', error)
            toast.error("Sign Up Failed Try With google", {
                description: error.errors?.[0]?.message || 'Failed to create account',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoogleSignUp = async () => {
        if (!isLoaded) return;

        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            });
        } catch (err) {
            console.error('Google sign-up error:', err);
            toast.error("Failed to sign up with Google", {
                description: "An unexpected error occurred. Please try again.",
            });
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Icons.spinner className="h-6 w-6 animate-spin" />
            </div>
        )
    }

    if (verificationStep) {
        return <VerificationForm signUp={signUp} email={form.getValues("email")} />
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email below to create your account
                    </p>
                </div>

                <div className="grid gap-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div id="clerk-captcha" ref={captchaRef} className="mt-4"></div>
                            <Button className="w-full" type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" type="button" onClick={handleGoogleSignUp}>
                        <Icons.google className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
            <Toaster />
        </div>
    )
}

