import Image from 'next/image';
import Link from 'next/link';
import { getDate, getRuntime } from '../../utils';

export default function EpisodeList(props: {
    data: any;
    showId: string;
    seasonNum: string;
}) {
    const data = props.data;

    return (
        <>
            {data && data.length > 1 ?
                <ul className="flex flex-col gap-4 w-full my-2">
                    <h2 className="text-xl">Episodes</h2>
                    {data.map((e: any, index: number) => (
                        <li key={index}>
                            <Link
                                className="flex gap-4 bg-slate-700 p-2 hover:bg-slate-700/40 hover:ring-2 hover:ring-brand-blue/20 transition overflow-hidden focus:outline-none focus:ring focus:ring-brand-blue"
                                href={`/tv/${props.showId}/season/${props.seasonNum}/episode/${e.episode_number}`}
                            >
                                <div className="flex items-center">
                                    {e.still_path ?
                                        <Image
                                            className="h-auto w-37.5 md:w-62.5"
                                            src={`https://image.tmdb.org/t/p/w400${e.still_path}`}
                                            alt="tv poster"
                                            width={250}
                                            height={141}
                                        />
                                    :   <div className="h-21.25 md:h-35.25 w-37.5 md:w-62.5 bg-slate-300/20 grid place-items-center">
                                            image unavailable
                                        </div>
                                    }
                                </div>
                                <div>
                                    <p className="text-lg">{e.name}</p>
                                    <p className="font-light text-sm mb-4">
                                        Episode {e.episode_number} -{' '}
                                        {e.runtime ?
                                            <span className="font-medium">
                                                {getRuntime(e.runtime)}
                                            </span>
                                        :   <span className="font-xs">
                                                ? minutes
                                            </span>
                                        }
                                    </p>
                                    {e.air_date && (
                                        <p className="text-sm">
                                            {getDate(e.air_date)}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            :   <div className={`@container my-2`}>
                    <Link
                        className="flex flex-col @md:grid @md:grid-cols-[min-content_auto] gap-4 bg-slate-700 p-2 hover:bg-slate-700/40 hover:ring-2 focus:outline-none focus:ring focus:ring-brand-blue hover:ring-brand-blue/20 "
                        href={`/tv/${props.showId}/season/${props.seasonNum}/episode/${data.episode_number}`}
                    >
                        <div className="w-37.5 md:w-62.5">
                            {data.still_path ?
                                <Image
                                    className=""
                                    src={`https://image.tmdb.org/t/p/w400${data.still_path}`}
                                    alt="tv poster"
                                    width={250}
                                    height={141}
                                />
                            :   <div className="h-21.25 md:h-35.25 w-37.5 md:w-62.5 bg-slate-300/20 grid place-items-center">
                                    image unavailable
                                </div>
                            }
                        </div>
                        <div>
                            <p className="text-lg">{data.name}</p>

                            <p className="font-light text-sm mb-4">
                                {`Season ${data.season_number} - Episode
                                ${data.episode_number} `}
                                {data.runtime && (
                                    <span className="font-medium">
                                        - {getRuntime(data.runtime)}
                                    </span>
                                )}
                            </p>
                            <p className="text-sm">{getDate(data.air_date)}</p>
                        </div>
                    </Link>
                </div>
            }
        </>
    );
}
