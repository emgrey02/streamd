import Text from '@/app/components/ContentPage/Text';
import Image from 'next/image';
import Genres from '@/app/components/ContentPage/Genres';
import ContentPageNav from '@/app/components/ContentPage/ContentPageNav';
import { getDate } from '@/app/utils';
import UserContentInfoBox from '@/app/components/ContentPage/UserContentInfoBox';
import { fetchTmdb } from '@/app/lib/tmdb';

export const revalidate = 86400;

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
    const { id } = await params;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const deets = await fetchTmdb(
        `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
        options,
        'fetch show data'
    );

    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <div>
                <h1 className="text-5xl tracking-wider text-slate-200">
                    {deets.name}
                </h1>
                <div className="w-full max-w-full h-0.5 bg-brand-blue mt-1"></div>
                <p className="font-light">tv show</p>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row @container w-full">
                {deets.poster_path ? (
                    <div>
                        <Image
                            className="self-center sm:self-start"
                            src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                            alt={`poster for ${deets.name}`}
                            width={200}
                            height={300}
                            priority
                        />
                    </div>
                ) : (
                    <div className="w-96 bg-slate-300/20 grid place-items-center">
                        {deets.name} poster unavailable
                    </div>
                )}
                <div className="flex flex-col gap-6 @4xl:flex-row w-full">
                    <div className="flex flex-col gap-4 @container w-full">
                        {deets.number_of_episodes &&
                            deets.number_of_seasons && (
                                <div className="flex gap-2 text-sm">
                                    <p>
                                        {deets.number_of_episodes} total
                                        episodes
                                    </p>
                                    <p>-</p>
                                    <p>{deets.number_of_seasons} seasons</p>
                                </div>
                            )}
                        {deets.tagline && (
                            <p className="font-light italic text-xl">
                                {deets.tagline}
                            </p>
                        )}
                        {deets.first_air_date && (
                            <p>First Aired {getDate(deets.first_air_date)}</p>
                        )}
                        <Genres data={deets.genres} content="tv" />
                        {deets.overview && (
                            <div className="col-span-2">
                                <h2 className="font-bold text-lg">Overview</h2>
                                <Text text={deets.overview} />
                            </div>
                        )}
                    </div>
                    <UserContentInfoBox
                        id={id}
                        content="tv"
                        voteAvg={deets.vote_average}
                        totalVotes={deets.vote_count}
                    />
                </div>
            </div>
            <ContentPageNav />
            {children}
        </main>
    );
}
