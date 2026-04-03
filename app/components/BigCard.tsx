'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function BigCard(props: {
    data: CastCrewItem | ContentItem;
    type: string;
}) {
    const p = props.data;
    let type = props.type;

    // get whether its a movie or tv credit
    if (type === 'multi') {
        type = (p as ContentItem).media_type!;
    }

    const imagePath =
        'profile_path' in p ? p.profile_path
        : 'poster_path' in p ? p.poster_path
        : undefined;

    const cardTitle =
        'name' in p ? p.name
        : 'title' in p ? p.title
        : undefined;

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
            className="p-1.25 grid grid-cols-[100px_auto] h-40 gap-2 bg-slate-700 hover:bg-slate-700/40 hover:ring-2 hover:ring-brand-blue/20 transition overflow-hidden focus:outline-none focus:ring focus:ring-brand-blue"
            href={`/${type}/${p.id}`}
        >
            {imagePath ?
                <Image
                    className="overflow-y-clip"
                    src={`https://image.tmdb.org/t/p/w200/${imagePath}`}
                    alt={`${p.profile_path ? 'Profile of' : 'Poster for'} ${cardTitle}`}
                    width="100"
                    height="150"
                />
            :   <div className="w-25 h-37.5 bg-slate-900/80 text-slate-400 grid place-items-center text-center">
                    no image available
                </div>
            }
            <div className="flex flex-col gap-2 overflow-scroll">
                <h4 className="text-wrap mt-4 font-medium text-[17px] w-fit text-brand-blue">
                    {cardTitle}
                </h4>

                {(playing || job) && (
                    <div className="flex items-center gap-1">
                        <p className="font-light">{playing ? 'as' : ''}</p>
                        <p className="text-wrap w-fit italic">
                            {playing || job}
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
}
