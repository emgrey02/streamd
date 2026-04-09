import Lists from '@/app/components/Dashboard/Lists';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export default async function Page() {
    const cookieStore = await cookies();
    const accountObjectId: string | undefined =
        cookieStore.get('accountObjectId')?.value;
    const accessToken: string | undefined =
        cookieStore.get('accessToken')?.value;

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
