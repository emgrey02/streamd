import Image from 'next/image';
import SmallCreditsList from '@/app/components/SmallCreditsList';
import Link from 'next/link';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import { cookies } from 'next/headers';
import EpisodeList from '@/app/components/EpisodeList';
import BackButton from '@/app/components/BackButton';

export default async function Show({ params }: { params: { id: string } }) {
    let showId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?append_to_response=aggregate_credits&language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    let content = await res.json();

    return (
        <main className="flex flex-col gap-4 w-fit">
            <h2 className="my-2 font-bold text-lg">Production Companies</h2>
            <ul className="flex flex-wrap gap-4 ring-2 ring-slate-700 p-2 mb-8 w-fit">
                {content.production_companies.map((pc: any, index: number) => (
                    <li
                        key={index}
                        className="w-[120px] grid grid-rows-[100px_min-content] gap-2 p-2"
                    >
                        <div className="grid place-items-center bg-slate-600 min-w-[100px]">
                            {pc.logo_path ?
                                <Image
                                    className="p-2"
                                    src={`https://image.tmdb.org/t/p/w200/${pc.logo_path}`}
                                    alt={`logo`}
                                    width="100"
                                    height="100"
                                />
                            :   <div className="w-[90px] h-[90px] bg-slate-900 grid place-items-center p-2 text-center text-slate-400">
                                    no logo available
                                </div>
                            }
                        </div>
                        <div>
                            <p className="text-sm">{pc.name}</p>
                            <p className="text-xs">{pc.origin_country}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <h2 className="my-2 font-bold text-lg">Networks</h2>
            <ul className="flex flex-wrap gap-4 ring-2 ring-slate-700 p-2 mb-8 w-fit">
                {content.networks.map((n: any, index: number) => (
                    <li
                        key={index}
                        className="w-[120px] grid grid-rows-[100px_min-content] gap-2 p-2"
                    >
                        <div className="grid place-items-center bg-slate-600 min-w-[100px]">
                            {n.logo_path ?
                                <Image
                                    className="p-2"
                                    src={`https://image.tmdb.org/t/p/w200/${n.logo_path}`}
                                    alt={`logo`}
                                    width="100"
                                    height="100"
                                />
                            :   <div className="w-[90px] h-[90px] bg-slate-900 grid place-items-center p-2 text-center text-slate-400">
                                    no logo available
                                </div>
                            }
                        </div>
                        <div>
                            <p className="text-sm">{n.name}</p>
                            <p className="text-xs">{n.origin_country}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {content.last_episode_to_air && (
                <div>
                    <h2>Last Episode to Air</h2>
                    <EpisodeList
                        data={content.last_episode_to_air}
                        showId={showId}
                        seasonNum={content.last_episode_to_air.season_number}
                    />
                </div>
            )}

            {content.next_episode_to_air && (
                <div>
                    <h2>Next Episode to Air</h2>
                    <EpisodeList
                        data={content.next_episode_to_air}
                        showId={showId}
                        seasonNum={content.next_episode_to_air.season_number}
                    />
                </div>
            )}

            <SmallCreditsList
                creds={content.aggregate_credits}
                cont="tv"
                showId={showId}
            />

            <h2 className="text-xl">Seasons</h2>
            <LargeCreditsList
                data={content.seasons}
                type="tv"
                credits={false}
                search={false}
                fwr={false}
                seasons={true}
                showId={showId}
            />

            <BackButton main={true} />
        </main>
    );
}
