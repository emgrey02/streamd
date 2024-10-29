'use server';

import { cookies } from 'next/headers';
import DashContent from '../components/DashContent';

export default async function Page() {
    const sessionId: string | undefined = cookies().get('sessionId')?.value;
    const accountId: string | undefined = cookies().get('accId')?.value;
    const username: string | undefined = cookies().get('username')?.value;
    const accountObjectId: string | undefined =
        cookies().get('accountObjectId')?.value;
    const accessToken: string | undefined = cookies().get('accessToken')?.value;

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
