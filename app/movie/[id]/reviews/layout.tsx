import { Suspense } from 'react';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>;
}
