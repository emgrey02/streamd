import ContentPageNav from '@/app/components/ContentPage/ContentPageNav';
import MainContent from '@/app/components/ContentPage/MainContent';
import { Suspense } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <Suspense fallback={<p>Loading...</p>}>
                <MainContent />
                <ContentPageNav />
            </Suspense>
            {children}
        </main>
    );
}
