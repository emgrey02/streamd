import Image from 'next/image';
import SmallCreditsList from '@/app/components/SmallCreditsList';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import EpisodeList from '@/app/components/EpisodeList';
import StreamRentBuy from '@/app/components/StreamRentBuy';

export default async function Show({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?append_to_response=aggregate_credits,watch/providers&language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    const content = await res.json();

    return (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 max-w-vw @container">
            {content.created_by && content.created_by.length > 0 && (
                <div className={'col-span-2'}>
                    <h2 className="font-medium text-lg mb-2">Created By</h2>
                    <SmallCreditsList
                        creds={content.created_by}
                        contentId={id}
                        contentType="person"
                    />
                </div>
            )}
            <div className="grid grid-cols-2 gap-2 w-full mb-2 h-fit">
                {content.origin_country[0] && (
                    <>
                        <h3 className="font-medium text-lg mb-2">
                            Origin Country
                        </h3>
                        <div className="font-light">
                            {new Intl.DisplayNames(['en'], {
                                type: 'region',
                            }).of(content.origin_country[0])}
                        </div>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.original_language && (
                    <>
                        <h3 className="font-medium text-lg mb-2">
                            Original Language
                        </h3>
                        <div className="font-light tracking-wide">
                            {new Intl.DisplayNames(['en'], {
                                type: 'language',
                            }).of(content.original_language)}
                        </div>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.status && (
                    <>
                        <h3 className="font-medium text-lg mb-2">Status</h3>
                        <div className="font-light">{content.status}</div>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.type && (
                    <>
                        <h2 className="font-medium text-lg mb-2">Type</h2>
                        <div className="font-light">{content.type}</div>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.production_countries && (
                    <>
                        <h3 className="mb-2 font-medium text-lg">
                            Production Countries
                        </h3>
                        <ul className="tracking-wide font-light">
                            {content.production_countries.map(
                                (c: { name: string }, index: number) => (
                                    <li key={index}>{c.name}</li>
                                )
                            )}
                        </ul>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.spoken_languages && (
                    <>
                        <h3 className="mb-2 font-medium text-lg">
                            Spoken Languages
                        </h3>
                        <ul className="tracking-wide font-light">
                            {content.spoken_languages.map(
                                (
                                    l: { english_name: string },
                                    index: number
                                ) => (
                                    <li key={index}>{l.english_name}</li>
                                )
                            )}
                        </ul>
                    </>
                )}
            </div>
            <div className="@container">
                <div className="grid @lg:grid-cols-2 gap-4 h-full">
                    {content.production_companies.length > 0 && (
                        <div className="ring-2 ring-slate-700 h-full w-full">
                            <h3 className="mb-2 font-medium text-lg px-4 pt-3">
                                Production Companies
                            </h3>
                            <ul className="flex flex-col gap-4 px-2 pb-2 w-full">
                                {content.production_companies.slice(0, 4).map(
                                    (
                                        pc: {
                                            logo_path: string;
                                            name: string;
                                        },
                                        index: number
                                    ) => (
                                        <li
                                            key={index}
                                            className="grid grid-cols-[80px_auto] items-center gap-2 p-2"
                                        >
                                            <div className="grid place-items-center bg-slate-600 min-w-15 min-h-15">
                                                {pc.logo_path ?
                                                    <Image
                                                        className="mx-2"
                                                        src={`https://image.tmdb.org/t/p/w200/${pc.logo_path}`}
                                                        alt={`logo`}
                                                        width="60"
                                                        height="60"
                                                    />
                                                :   <div className="w-15 h-15 bg-slate-900 grid place-items-center p-2 text-center text-slate-400 text-xs">
                                                        no logo available
                                                    </div>
                                                }
                                            </div>
                                            <div>
                                                <p className="text-sm">
                                                    {pc.name}
                                                </p>
                                                <p className="text-sm">
                                                    {new Intl.DisplayNames(
                                                        ['en'],
                                                        {
                                                            type: 'region',
                                                        }
                                                    ).of(
                                                        content
                                                            .origin_country[0]
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                    {content.networks && content.networks.length > 0 && (
                        <div className="h-full ring-2 ring-slate-700">
                            <h2 className="font-medium text-lg mb-2 px-4 pt-3">
                                Networks
                            </h2>
                            <ul className="flex flex-wrap gap-4 px-2 pb-2 w-full">
                                {content.networks.map(
                                    (
                                        n: { logo_path: string; name: string },
                                        index: number
                                    ) => (
                                        <li
                                            key={index}
                                            className="grid grid-cols-[80px_auto] items-center gap-2 p-2"
                                        >
                                            <div className="grid place-items-center bg-slate-600 min-w-15 min-h-15">
                                                {n.logo_path ?
                                                    <Image
                                                        className="mx-2"
                                                        src={`https://image.tmdb.org/t/p/w200/${n.logo_path}`}
                                                        alt={`logo`}
                                                        width="60"
                                                        height="60"
                                                    />
                                                :   <div className="w-15 h-15 bg-slate-900 grid place-items-center p-2 text-center text-slate-400 text-xs">
                                                        no logo available
                                                    </div>
                                                }
                                            </div>
                                            <div>
                                                <p className="text-sm">
                                                    {n.name}
                                                </p>
                                                <p className="text-xs">
                                                    {new Intl.DisplayNames(
                                                        ['en'],
                                                        {
                                                            type: 'region',
                                                        }
                                                    ).of(
                                                        content
                                                            .origin_country[0]
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <StreamRentBuy content={content['watch/providers'].results.US} />

            {content.last_episode_to_air && (
                <div
                    className={`${
                        (
                            content.last_episode_to_air &&
                            content.next_episode_to_air
                        ) ?
                            'col-span-1'
                        :   'col-span-2'
                    } col-start-1`}
                >
                    <h2 className="font-medium text-lg mb-2">
                        Last Episode to Air
                    </h2>
                    <EpisodeList
                        data={content.last_episode_to_air}
                        showId={id}
                        seasonNum={content.last_episode_to_air.season_number}
                    />
                </div>
            )}

            {content.next_episode_to_air && (
                <div
                    className={`${
                        (
                            content.last_episode_to_air &&
                            content.next_episode_to_air
                        ) ?
                            'col-span-1'
                        :   'col-span-2'
                    }`}
                >
                    <h2 className="font-medium text-lg mb-2">
                        Next Episode to Air
                    </h2>
                    <EpisodeList
                        data={content.next_episode_to_air}
                        showId={id}
                        seasonNum={content.next_episode_to_air.season_number}
                    />
                </div>
            )}

            <div className="@container col-span-2">
                <h2 className="font-medium text-lg mb-2">Seasons</h2>
                <LargeCreditsList
                    data={content.seasons}
                    type="tv"
                    credits={false}
                    search={false}
                    seasons={true}
                    showId={id}
                    clip={true}
                />
            </div>

            <div>
                <h2 className="font-medium text-lg mb-2">Cast</h2>
                <SmallCreditsList
                    creds={content.aggregate_credits.cast}
                    contentType="person"
                    contentId={id}
                />
            </div>

            <div>
                <h2 className="font-medium text-lg mb-2">Crew</h2>
                <SmallCreditsList
                    creds={content.aggregate_credits.crew}
                    contentType="person"
                    contentId={id}
                />
            </div>
        </div>
    );
}
