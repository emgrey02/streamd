import Text from '@/app/components/Text';
import { cookies } from 'next/headers';
import Image from 'next/image';
import BackButton from '@/app/components/BackButton';
import Genres from '@/app/components/Genres';
import FavorWatchButton from '@/app/components/FavorWatchButton';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import EpisodeList from '@/app/components/EpisodeList';

export default async function Season({
    params,
}: {
    params: { id: string; num: number };
}) {
    let showId = params.id;
    let seasonNum = params.num.toString();
    console.log(params);

    const sessionId = cookies().get('sessionId')?.value;
    const accountId = cookies().get('accId')?.value;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNum}?append_to_response=credits&language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch season data');
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

    console.log(deets);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 md:h-[400px] h-auto">
                {deets.poster_path ?
                    <div>
                        <Image
                            className="h-auto"
                            src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                            alt="tv poster"
                            width={250}
                            height={375}
                        />
                    </div>
                :   <div className="w-[250px] h-[375px] bg-slate-300/20 grid place-items-center text-center">
                        {deets.name} poster unavailable
                    </div>
                }
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-200">
                            {deets.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <p>{deets.episodes.length} episodes</p>
                    </div>
                    <div>
                        <h2 className="font-bold">Air Date</h2>
                        <p>{getDate(deets.air_date)}</p>
                    </div>
                    {deets.overview && (
                        <div className="flex flex-col">
                            <h2 className="font-bold text-lg">Overview</h2>
                            <Text text={deets.overview} />
                        </div>
                    )}
                </div>
            </div>
            <div>
                {deets.episodes && (
                    <EpisodeList
                        data={deets.episodes}
                        showId={showId}
                        seasonNum={seasonNum}
                    />
                )}
            </div>
            <div>
                {deets.credits && (
                    <div className="@container">
                        <h3 className="mb-2 text-xl">Cast</h3>
                        <LargeCreditsList
                            data={deets.credits.cast}
                            type={'person'}
                            search={false}
                            credits={true}
                            fwr={false}
                            seasons={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
