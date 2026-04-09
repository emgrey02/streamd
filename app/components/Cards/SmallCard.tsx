'use client';
import Link from 'next/link';
import Image from 'next/image';

type SmallCardItem = MovieItem | ShowItem | CastCrewItem | ContentItem;

interface SmallCardProps {
    data: SmallCardItem;
    type?: string;
    credits: boolean;
    seasons: boolean;
    seasonNum?: number;
    showId?: string;
}

export default function SmallCard({
    data,
    type,
    credits,
    seasons,
    seasonNum,
    showId,
}: SmallCardProps) {
    const p = data;

    // movie & tv credits are people
    if ((type === 'movie' || type === 'tv') && credits) {
        type = 'person';
    } else if (seasons) {
        type = 'tv';
    } else {
        type = (p as ContentItem).media_type || type;
    }

    const playing =
        'character' in p ? p.character
        : 'roles' in p && p.roles ? p.roles[0].character
        : undefined;

    const job =
        'job' in p ? p.job
        : 'jobs' in p ? p.jobs[0].job
        : undefined;

    return (
        <Link
            className="p-1.25 grid grid-cols-[50px_auto] h-21.25 gap-2 bg-slate-700 hover:bg-slate-700/40 hover:ring-2 hover:ring-brand-blue/20 transition overflow-hidden focus:outline-none focus:ring focus:ring-brand-blue"
            href={`/${type}/${showId ? showId : p.id}/${seasons ? `season/${seasonNum}/` : '/'}`}
        >
            {(
                (p as CastCrewItem).profile_path ||
                (p as MovieItem | ShowItem).poster_path
            ) ?
                <Image
                    className="overflow-y-clip"
                    src={`https://image.tmdb.org/t/p/w200/${(p as MovieItem | ShowItem).poster_path || (p as CastCrewItem).profile_path}`}
                    alt={`${(p as CastCrewItem).profile_path ? 'Profile of' : 'Poster for'} ${(p as CastCrewItem | ShowItem).name || (p as MovieItem).title}`}
                    width="50"
                    height="75"
                />
            :   <div className="w-12.5 h-18.75 bg-slate-900/80 text-slate-400 grid place-items-center text-center text-xs">
                    no image
                </div>
            }
            <div className="flex flex-col overflow-scroll">
                <h4 className="text-wrap font-medium text-[16px] w-fit text-brand-blue">
                    {(p as CastCrewItem | ShowItem).name ||
                        (p as MovieItem).title}
                </h4>
                {credits && (
                    <>
                        {(playing || job) && (
                            <div className="flex gap-1">
                                <p className="text-sm font-light">
                                    {playing ? 'as' : ''}
                                </p>
                                <p className="text-sm italic">
                                    {playing || job}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {(p as ShowItem).air_date && (
                    <p className="text-sm font-light">
                        {(p as ShowItem).air_date.slice(0, 4)}
                    </p>
                )}

                {(p as ShowItem).first_air_date && (
                    <p className="text-sm font-light">
                        {(p as ShowItem).first_air_date.slice(0, 4)}
                    </p>
                )}

                {(p as MovieItem).release_date && (
                    <p className="text-sm font-light">
                        {(p as MovieItem).release_date.slice(0, 4)}
                    </p>
                )}
            </div>
        </Link>
    );
}
