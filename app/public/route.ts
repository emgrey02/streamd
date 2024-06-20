import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { reqToken, accountId, userId } = await req.json()

    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
            reqToken: reqToken,
            accountId: accountId,
        },
    })
    return NextResponse.json({ success: true })
}
