'use server';

import BackButton from '../components/BackButton';
import { Suspense } from 'react';
import DashContent from '../components/Dashboard/DashContent';
import DashNav from '../components/Dashboard/DashNav';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={true} />
            <div>
                <h1 className="text-5xl tracking-wider font-light mb-2">
                    dashboard
                </h1>
                <div className="w-[80%] max-w-full h-px bg-brand-blue"></div>
            </div>

            <Suspense fallback={<p>Loading...</p>}>
                <DashContent>
                    <Suspense fallback={<p>Loading...</p>}>
                        <DashNav />
                    </Suspense>
                    {children}
                </DashContent>
            </Suspense>
        </main>
    );
}
