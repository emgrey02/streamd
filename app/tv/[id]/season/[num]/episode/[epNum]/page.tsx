import Text from '@/app/components/Text';
import { cookies } from 'next/headers';
import Image from 'next/image';
import BackButton from '@/app/components/BackButton';
import SubmitRating from '@/app/components/SubmitRating';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import Link from 'next/link';

export default async function Episode({
    params,
}: {
    params: { id: string; num: string; epNum: string };
}) {
    let showId = params.id;
    let seasonNum = params.num;
    let episodeNum = params.epNum;

    const sessionId = cookies().get('sessionId')?.value;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let seasonRes = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNum}?language=en-US`,
        options
    );

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNum}/episode/${episodeNum}?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch episode data');
    }

    if (!res.ok) {
        console.error('failed to fetch season data');
    }

    let season = await seasonRes.json();
    let deets = await res.json();
    const totalEpisodes = season.episodes.length;

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

    function getRuntime(min: number) {
        let hrs = (min / 60).toFixed(0);
        let mins = min % 60;
        console.log(hrs);
        return `${hrs}h ${mins}m`;
    }

    return (
        <div className="flex flex-col gap-4">
            <BackButton
                main={false}
                link={`/tv/${showId}/season/${seasonNum}`}
            />
            <div className="w-full grid grid-cols-2 gap-2">
                <Link
                    className={`bg-slate-900 ${+episodeNum - 1 == 0 && 'pointer-events-none text-slate-700'} hover:bg-slate-700 p-4`}
                    aria-disabled={+episodeNum - 1 == 0}
                    href={`/tv/${showId}/season/${seasonNum}/episode/${+episodeNum - 1}`}
                    replace
                >
                    Previous Episode
                </Link>
                <Link
                    className={`${+episodeNum + 1 > +totalEpisodes && 'pointer-events-none text-slate-700'} bg-slate-900 hover:bg-slate-700 p-4 text-end w-full`}
                    aria-disabled={+episodeNum + 1 > +totalEpisodes}
                    href={`/tv/${showId}/season/${seasonNum}/episode/${+episodeNum + 1}`}
                    replace
                >
                    Next Episode
                </Link>
            </div>
            <div className="grid gap-4 md:flex md:h-auto h-auto bg-slate-700 p-4">
                {deets.still_path ?
                    <div>
                        <Image
                            className="h-auto"
                            src={`https://image.tmdb.org/t/p/w400${deets.still_path}`}
                            alt="tv poster"
                            width={400}
                            height={225}
                        />
                    </div>
                :   <div className="w-[400px] h-[225px] bg-slate-300/20 grid place-items-center text-center">
                        {deets.name} poster unavailable
                    </div>
                }
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-200">
                            {deets.name}
                        </h1>
                        <p className="font-light text-sm">
                            Season {deets.season_number} - Episode{' '}
                            {deets.episode_number} -{' '}
                            <span className="font-medium">
                                {getRuntime(deets.runtime)}
                            </span>
                        </p>
                    </div>
                    <div>
                        <h2 className="font-bold">Air Date</h2>
                        <p>{getDate(deets.air_date)}</p>
                    </div>
                    {sessionId && (
                        <SubmitRating
                            content="tv"
                            id={+showId}
                            sessionId={sessionId}
                            voteAvg={deets.vote_average}
                            totalVotes={deets.vote_count}
                            seasonNum={seasonNum}
                            episodeNum={episodeNum}
                        />
                    )}
                </div>
            </div>

            {deets.overview && (
                <div className="flex flex-col">
                    <h2 className="font-bold text-lg">Overview</h2>
                    <Text text={deets.overview} />
                </div>
            )}
            {deets.crew.length > 0 && (
                <div className="@container">
                    <p className="text-xl">Crew</p>
                    <LargeCreditsList
                        data={deets.crew}
                        type={'person'}
                        search={false}
                        credits={true}
                        seasons={false}
                        clip={true}
                    />
                </div>
            )}
            {deets.guest_stars.length > 0 && (
                <div className="@container">
                    <p className="text-xl">Guest Stars</p>
                    <LargeCreditsList
                        data={deets.guest_stars}
                        type={'person'}
                        search={false}
                        credits={true}
                        seasons={false}
                        clip={true}
                    />
                </div>
            )}
        </div>
    );
}
