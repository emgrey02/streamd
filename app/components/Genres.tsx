import Link from 'next/link';

export default function Genres(props: { data: any; content: string }) {
    const deets = props.data;

    return (
        <>
            {deets.length > 0 && (
                <div className="flex gap-2">
                    <h2>Genres:</h2>
                    <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {deets.map(
                            (
                                genre: { id: number; name: string },
                                index: number
                            ) => (
                                <li
                                    className="w-fit text-sm ring-1 h-min px-2 py-0 pt-[2px] ring-slate-400 hover:bg-slate-950"
                                    key={index}
                                >
                                    <Link
                                        href={`/search/genre-${props.content}?query=${genre.id}--${encodeURIComponent(genre.name)}&page=1`}
                                    >
                                        {genre.name}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
            {deets.keywords && deets.keywords.length > 0 && (
                <div className="w-full ring-2 ring-slate-700">
                    <h3 className="mb-2 font-medium text-lg px-4 pt-3">
                        Keywords
                    </h3>
                    <ul className="flex flex-wrap w-full items-center gap-2 px-4 pb-4">
                        {deets.keywords.map(
                            (
                                k: { id: number; name: string },
                                index: number
                            ) => (
                                <li
                                    className="w-fit text-sm ring-1 h-min px-2 py-0 pt-[2px] ring-slate-400 hover:bg-slate-950"
                                    key={index}
                                >
                                    <Link
                                        href={`/search/keyword-${props.content}?query=${k.id}--${k.name}&page=1`}
                                    >
                                        {k.name}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </>
    );
}
