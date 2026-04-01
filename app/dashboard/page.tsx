'use server';

import { cookies } from 'next/headers';
import DashContent from '../components/DashContent';

export default async function Page() {
    const cookieStore = await cookies();
    const sessionId: string | undefined = cookieStore.get('sessionId')?.value;
    const accountId: string | undefined = cookieStore.get('accId')?.value;
    const accountObjectId: string | undefined =
        cookieStore.get('accountObjectId')?.value;
    const accessToken: string | undefined =
        cookieStore.get('accessToken')?.value;

    return (
        <div>
            <DashContent
                accountId={accountId}
                sessionId={sessionId}
                accessToken={accessToken}
                accountObjectId={accountObjectId}
            />
        </div>
    );
}
