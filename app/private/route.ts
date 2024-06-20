import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { useUser } from '@clerk/nextjs'

export async function GET(request: Request) {
    const { userId } = auth()

    if (userId) {
        const user = await clerkClient.users.getUser(userId)
        return NextResponse.json(user.privateMetadata)
    }
}

export async function POST(req: NextRequest) {
    const { accessToken, userId } = await req.json()

    await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
            accessToken: accessToken,
        },
    })
    return NextResponse.json({ success: true })
}
