import ContentPageNav from '@/app/components/ContentPage/ContentPageNav';
import { Suspense } from 'react';
import { getDate } from '@/app/utils';
import UserContentInfoBox from '@/app/components/ContentPage/UserContentInfoBox';
import Genres from '@/app/components/ContentPage/Genres';
import Text from '@/app/components/ContentPage/Text';
import Image from 'next/image';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
    const { id } = await params;

    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'force-cache',
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    const deets = await res.json();
    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <Suspense fallback={<p>Loading...</p>}>
                <div>
                    <h1 className="text-2xl sm:text-4xl tracking-wider">
                        {deets.title}
                    </h1>
                    <div className="w-full max-w-full h-0.5 bg-brand-blue mt-1"></div>
                    <p className="font-light">movie</p>
                </div>
                <div className="flex flex-col gap-6 sm:flex-row @container w-full">
                    {deets.poster_path ? (
                        <Image
                            className="self-center sm:self-start"
                            src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                            alt={`movie poster for ${deets.title}`}
                            width={200}
                            height={300}
                            priority
                        />
                    ) : (
                        <div className="w-96 bg-slate-300/20 grid place-items-center">
                            {deets.title} poster unavailable
                        </div>
                    )}
                    <div className="flex flex-col gap-6 @4xl:flex-row w-full">
                        <div className="flex flex-col gap-4 @container w-full">
                            {deets.tagline && (
                                <p className="font-light italic text-xl">
                                    {deets.tagline}
                                </p>
                            )}
                            {deets.release_date && (
                                <p>Released {getDate(deets.release_date)}</p>
                            )}
                            <Genres data={deets.genres} content="movie" />
                            {deets.overview && (
                                <div className="col-span-2">
                                    <h2 className="font-bold text-lg">
                                        Overview
                                    </h2>
                                    <Text text={deets.overview} />
                                </div>
                            )}
                        </div>
                    </div>
                    <Suspense fallback={<p>Loading...</p>}>
                        <UserContentInfoBox id={id} />
                    </Suspense>
                </div>
                <ContentPageNav />
            </Suspense>
            {children}
        </main>
    );
}
