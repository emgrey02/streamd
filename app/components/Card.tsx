import Image from 'next/image';
import Link from 'next/link';

export default function Card(props: {
    data: any;
    type?: string;
    search: boolean;
}) {
    const p = props.data;
    console.log(p);
    let type = props.type;
    console.log(type);
    console.log(props.search);

    if (!props.search) {
        if (type === 'movie' || type === 'tv') {
            type = 'person';
        }
    } else if (type === 'multi') {
        console.log(p.media_type);
        type = p.media_type;
    }

    console.log(type);

    return (
        <>
            <div className="max-w-[200px]">
                <p className="font-bold text-base tracking-wide">
                    {p.name || p.title}
                </p>
                <p className="text-sm">
                    as{' '}
                    {p.character ||
                        (p.roles && p.roles[0].character) ||
                        'unknown'}
                </p>
            </div>
            <div className="grid min-w-36 self-end">
                <Link href={`/${type}/${p.id}`}>
                    {p.profile_path || p.poster_path ?
                        <Image
                            src={`https://image.tmdb.org/t/p/w200/${p.poster_path || p.profile_path}`}
                            alt={`${props.type === 'tv' ? p.name : p.title} image`}
                            width={'200'}
                            height={'300'}
                        />
                    :   <div className="w-[200px] h-[300px] bg-slate-900/80 text-slate-400 grid place-items-center">
                            no image available
                        </div>
                    }
                </Link>
            </div>
        </>
    );
}
