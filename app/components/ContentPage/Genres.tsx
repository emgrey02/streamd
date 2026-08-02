import Link from 'next/link';

type Genre = { id: number; name: string };

export default function Genres(props: {
    data: Genre[] | { keywords: Genre[] };
    content: string;
}) {
    const deets = props.data;
    const genres = Array.isArray(deets) ? deets : null;
    const keywords = !Array.isArray(deets) ? deets.keywords : null;

    return (
        <>
            {genres && genres.length > 0 && (
                <div className="flex gap-2">
                    <h2>Genres:</h2>
                    <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {genres.map((genre, index) => (
                            <li
                                className="w-fit text-sm ring-1 h-min px-2 py-0 pt-0.5 ring-slate-400 hover:bg-slate-950"
                                key={index}
                            >
                                <Link
                                    href={`/search/genre-${props.content}?query=${genre.id}--${encodeURIComponent(genre.name)}&page=1`}
                                >
                                    {genre.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {keywords && keywords.length > 0 && (
                <div className="w-full ring-2 ring-slate-700">
                    <h3 className="mb-2 font-medium text-lg px-4 pt-3">
                        Keywords
                    </h3>
                    <ul className="flex flex-wrap w-full items-center gap-2 px-4 pb-4">
                        {keywords.map((k, index) => (
                            <li
                                className="w-fit text-sm ring-1 h-min px-2 py-0 pt-0.5 ring-slate-400 hover:bg-slate-950"
                                key={index}
                            >
                                <Link
                                    href={`/search/keyword-${props.content}?query=${k.id}--${k.name}&page=1`}
                                >
                                    {k.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}
