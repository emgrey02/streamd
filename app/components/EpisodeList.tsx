import Image from 'next/image';
import Link from 'next/link';
import Text from './Text';

export default function EpisodeList(props: {
    data: any;
    showId: string;
    seasonNum: string;
}) {
    const data = props.data;
    console.log(data);
    console.log(props.showId);
    console.log(props.seasonNum);
    console.log(data.length);

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
        console.log('minutes: ', min);
        let hrs = Math.floor(min / 60);
        let mins = min % 60;
        console.log(hrs);
        return `${+hrs !== 0 ? `${hrs}h ` : ''}${mins}m`;
    }

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
                                            className="h-auto w-[150px] md:w-[250px]"
                                            src={`https://image.tmdb.org/t/p/w400${e.still_path}`}
                                            alt="tv poster"
                                            width={250}
                                            height={141}
                                        />
                                    :   <div className="h-[85px] md:h-[141px] w-[150px] md:w-[250px] bg-slate-300/20 grid place-items-center">
                                            image unavailable
                                        </div>
                                    }
                                </div>
                                <div>
                                    <p className="text-lg">{e.name}</p>
                                    <p className="font-light text-sm mb-4">
                                        Episode {e.episode_number} -{' '}
                                        {e.runtime && (
                                            <span className="font-medium">
                                                {getRuntime(e.runtime)}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm">
                                        {getDate(e.air_date)}
                                    </p>
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
                        <div className="w-[150px] md:w-[250px]">
                            {data.still_path ?
                                <Image
                                    className=""
                                    src={`https://image.tmdb.org/t/p/w400${data.still_path}`}
                                    alt="tv poster"
                                    width={250}
                                    height={141}
                                />
                            :   <div className="h-[85px] md:h-[141px] w-[150px] md:w-[250px] bg-slate-300/20 grid place-items-center">
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
