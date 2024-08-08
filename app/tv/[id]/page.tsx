import Image from 'next/image';
import SmallCreditsList from '@/app/components/SmallCreditsList';
import LargeCreditsList from '@/app/components/LargeCreditsList';
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
        `https://api.themoviedb.org/3/tv/${showId}?append_to_response=aggregate_credits,watch/providers&language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    let content = await res.json();
    console.log(content);

    console.log(content.last_episode_to_air);
    console.log(content.next_episode_to_air);
    console.log(
        content.last_episode_to_air && content.next_episode_to_air ?
            'col-span-1'
        :   'col-span-2'
    );

    return (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 w-full">
            {content.created_by && content.created_by.length > 0 && (
                <div className={'col-span-2'}>
                    <h2 className="font-medium text-lg mb-2">Created By</h2>
                    <SmallCreditsList
                        creds={content.created_by}
                        showId={showId}
                        cont="person"
                    />
                </div>
            )}
            <div className="grid grid-cols-2 gap-10 w-full mb-2 h-full">
                <div>
                    <h2 className="font-medium text-lg mb-2">Origin Country</h2>
                    <div className="font-light">
                        {new Intl.DisplayNames(['en'], {
                            type: 'region',
                        }).of(content.origin_country[0])}
                    </div>
                </div>
                <div>
                    <h2 className="font-medium text-lg mb-2">
                        Original Language
                    </h2>
                    <div className="font-light">
                        {new Intl.DisplayNames(['en'], {
                            type: 'language',
                        }).of(content.original_language)}
                    </div>
                </div>
                <div>
                    <h2 className="font-medium text-lg mb-2">Status</h2>
                    <div className="font-light">{content.status}</div>
                </div>
                <div>
                    <h2 className="font-medium text-lg mb-2">Type</h2>
                    <div className="font-light">{content.type}</div>
                </div>
                {content.production_countries && (
                    <div>
                        <h2 className="mb-2 font-medium text-lg">
                            Production Countries
                        </h2>
                        <ul className="tracking-wide font-light">
                            {content.production_countries.map(
                                (c: any, index: number) => (
                                    <li key={index}>{c.name}</li>
                                )
                            )}
                        </ul>
                    </div>
                )}
                {content.spoken_languages && (
                    <div>
                        <h2 className="mb-2 font-medium text-lg">
                            Spoken Languages
                        </h2>
                        <ul className="tracking-wide font-light">
                            {content.spoken_languages.map(
                                (l: any, index: number) => (
                                    <li key={index}>{l.english_name}</li>
                                )
                            )}
                        </ul>
                    </div>
                )}
                <div className="col-span-2 h-full ring-2 ring-slate-700">
                    <h2 className="font-medium text-lg mb-2 px-4 pt-3">
                        Networks
                    </h2>
                    <ul className="flex flex-wrap gap-4 px-2 pb-2 w-full">
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
                                    <p className="text-xs">
                                        {new Intl.DisplayNames(['en'], {
                                            type: 'region',
                                        }).of(content.origin_country[0])}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="h-full ring-2 ring-slate-700">
                <h2 className="font-medium text-lg mb-2 px-4 pt-3">
                    Production Companies
                </h2>
                <ul className="flex flex-wrap gap-4 w-full px-2 pb-2">
                    {content.production_companies.map(
                        (pc: any, index: number) => (
                            <li
                                key={index}
                                className="w-[120px] grid grid-rows-[min-content_min-content] gap-2 p-2"
                            >
                                <div className="grid place-items-center bg-slate-600 min-w-[100px] min-h-[100px]">
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
                                    <p className="text-sm font-light">
                                        {pc.name}
                                    </p>
                                    <p className="text-sm">
                                        {new Intl.DisplayNames(['en'], {
                                            type: 'region',
                                        }).of(content.origin_country[0])}
                                    </p>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            </div>

            {content['watch/providers'].results.US && (
                <>
                    {content['watch/providers'].results.US.rent && (
                        <div className="ring-2 ring-slate-700 h-full">
                            <h2 className="mb-2 px-4 pt-3">Rent it</h2>
                            <ul className="flex flex-wrap gap-4 w-full px-2 pb-2">
                                {content[`watch/providers`].results.US.rent.map(
                                    (wp: any, index: number) => (
                                        <li
                                            key={index}
                                            className="w-[120px] grid grid-rows-[100px_min-content] gap-2 p-2"
                                        >
                                            <div className="grid place-items-center bg-slate-600 min-w-[100px] min-h-[100px]">
                                                {wp.logo_path ?
                                                    <Image
                                                        className="p-2"
                                                        src={`https://image.tmdb.org/t/p/w200/${wp.logo_path}`}
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
                                                <p className="text-sm">
                                                    {wp.provider_name}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                    {content['watch/providers'].results.US.buy && (
                        <div className="ring-2 ring-slate-700 h-full">
                            <h2 className="mb-2 px-4 pt-3">Buy it</h2>
                            <ul className="flex flex-wrap gap-4 px-2 pb-2 w-full">
                                {content[`watch/providers`].results.US.buy.map(
                                    (wp: any, index: number) => (
                                        <li
                                            key={index}
                                            className="w-[120px] grid grid-rows-[100px_min-content] gap-2 p-2"
                                        >
                                            <div className="grid place-items-center bg-slate-600 min-w-[100px] min-h-[100px]">
                                                {wp.logo_path ?
                                                    <Image
                                                        className="p-2"
                                                        src={`https://image.tmdb.org/t/p/w200/${wp.logo_path}`}
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
                                                <p className="text-sm">
                                                    {wp.provider_name}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                    {content['watch/providers'].results.US.flatrate && (
                        <div className="ring-2 ring-slate-700 h-full">
                            <h2 className="mb-2 px-4 pt-3">Stream it</h2>
                            <ul className="flex flex-wrap gap-4 px-2 pb-2 w-full">
                                {content[
                                    `watch/providers`
                                ].results.US.flatrate.map(
                                    (wp: any, index: number) => (
                                        <li
                                            key={index}
                                            className="w-[120px] grid grid-rows-[100px_min-content] gap-2 p-2"
                                        >
                                            <div className="grid place-items-center bg-slate-600 min-w-[100px] min-h-[100px]">
                                                {wp.logo_path ?
                                                    <Image
                                                        className="p-2"
                                                        src={`https://image.tmdb.org/t/p/w200/${wp.logo_path}`}
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
                                                <p className="text-sm">
                                                    {wp.provider_name}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </>
            )}

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
                        showId={showId}
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
                        showId={showId}
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
                    fwr={false}
                    seasons={true}
                    showId={showId}
                />
            </div>

            <div>
                <h2 className="font-medium text-lg mb-2">Cast</h2>
                <SmallCreditsList
                    creds={content.aggregate_credits.cast}
                    cont="tv"
                    showId={showId}
                />
            </div>

            <div>
                <h2 className="font-medium text-lg mb-2">Crew</h2>
                <SmallCreditsList
                    creds={content.aggregate_credits.crew}
                    cont="tv"
                    showId={showId}
                />
            </div>

            <BackButton main={true} />
        </div>
    );
}
