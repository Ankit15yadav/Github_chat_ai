import { db } from '@/server/db'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const SyncUser = async (props: Props) => {

    const { userId } = await auth()
    if (!userId) {
        return null
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if (!user) {
        return notFound()
    }

    await db.user.upsert({
        where: {
            emailAddress: user.emailAddresses[0]?.emailAddress
        },
        update: {
            id: userId,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        create: {
            id: userId,
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    })

    return redirect('/dashboard')
}
export default SyncUser