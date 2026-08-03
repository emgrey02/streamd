import Lists from '@/app/components/Dashboard/Lists';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getAccessToken } from '@/app/actions/auth';

export default async function Page() {
    const cookieStore = await cookies();
    const accountObjectId: string | undefined =
        cookieStore.get('accountObjectId')?.value;
    const accessToken = await getAccessToken();

    return (
        <>
            <Suspense fallback={<p>Loading...</p>}>
                <Lists
                    accessToken={accessToken}
                    accountObjectId={accountObjectId}
                />
            </Suspense>
        </>
    );
}
