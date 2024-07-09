export default function Genres(props: { data: any }) {
    const deets = props.data;

    return (
        <div>
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2>Genres:</h2>
                {deets.map((genre: { name: string }, index: number) => (
                    <li
                        className="w-fit text-sm ring-1 rounded-lg h-min px-2 py-0 ring-slate-400"
                        key={index}
                    >
                        {genre.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
