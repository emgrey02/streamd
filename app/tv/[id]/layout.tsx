import Text from '@/app/components/Text';
import { cookies } from 'next/headers';
import Image from 'next/image';
import BackButton from '@/app/components/BackButton';
import Genres from '@/app/components/Genres';
import FavorWatchButton from '@/app/components/FavorWatchButton';
import SubmitRating from '@/app/components/SubmitRating';
import ContentPageNav from '@/app/components/ContentPageNav';
import AddToListButton from '@/app/components/AddToListButton';

interface LayoutProps {
    children: React.ReactNode;
    params: { id: string };
}

export default async function Layout({ children, params }: LayoutProps) {
    let showId = params.id;

    const sessionId = cookies().get('sessionId')?.value;
    const accountId = cookies().get('accId')?.value;
    const accountObjectId = cookies().get('accountObjectId')?.value;
    const accessToken = cookies().get('accessToken')?.value;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    let deets = await res.json();

    function getDate(birthday: string) {
        let birthArray = birthday.split('-');
        let months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        let month = months[+birthArray[1] - 1];
        return `${month} ${birthArray[2]}, ${birthArray[0]}`;
    }

    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={false} />
            <div>
                <h1 className="text-5xl tracking-wider text-slate-200">
                    {deets.name}
                </h1>
                <div className="w-full max-w-full h-[2px] bg-brand-blue mt-1"></div>
                <p className="font-light">tv show</p>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row @container w-full">
                {deets.poster_path ?
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
                :   <div className="w-96 bg-slate-300/20 grid place-items-center">
                        {deets.name} poster unavailable
                    </div>
                }
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
                    {accountId && sessionId && (
                        <div className="flex flex-col gap-4 self-end w-full flex-grow bg-slate-900/60 p-4">
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 gap-2 @sm:flex @sm:flex-row @sm:gap-4 w-full">
                                    <FavorWatchButton
                                        whichOne="favorite"
                                        content="tv"
                                        contentId={deets.id}
                                        accountId={accountId}
                                        sessionId={sessionId}
                                    />
                                    <FavorWatchButton
                                        whichOne="watchlist"
                                        content="tv"
                                        contentId={deets.id}
                                        accountId={accountId}
                                        sessionId={sessionId}
                                    />
                                </div>
                                <SubmitRating
                                    content="tv"
                                    id={deets.id}
                                    sessionId={sessionId}
                                    voteAvg={deets.vote_average}
                                    totalVotes={deets.vote_count}
                                />
                                <AddToListButton
                                    accountObjectId={accountObjectId || ''}
                                    accessToken={accessToken || ''}
                                    mediaType={'tv'}
                                    mediaId={deets.id}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ContentPageNav />
            {children}
        </main>
    );
}
