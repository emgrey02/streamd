import Card from './Card';

export default function LargeCreditsList(props: {
    data: any;
    type: string;
    search: boolean;
    credits: boolean;
}) {
    const data = props.data;
    const type = props.type;
    const search = props.search;
    const credits = props.credits;

    return (
        <ul className="flex flex-wrap gap-4 gap-y-10 justify-start my-8">
            {data &&
                data.map((m: any, index: number) => (
                    <li
                        data-num={index}
                        className="flex flex-col w-full justify-between min-h-[190px] sm:h-[370px]"
                        key={index}
                    >
                        <Card
                            data={m}
                            type={type}
                            search={search}
                            credits={credits}
                        />
                    </li>
                ))}
            {data && data.length == 0 && <p>No content available.</p>}
        </ul>
    );
}
