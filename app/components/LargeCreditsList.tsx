import NewCard from './NewCard';

export default function LargeCreditsList(props: {
    data: any;
    type: string;
    search: boolean;
    credits: boolean;
}) {
    let data = props.data;
    const type = props.type;
    const search = props.search;
    const credits = props.credits;

    if (type !== 'person') {
        data = data.toReversed();
    }
    console.log(data);
    console.log(type);

    return (
        <ul className="flex flex-wrap gap-4 gap-y-6 justify-start my-8">
            {data &&
                data.map((m: any, index: number) => (
                    <li data-num={index} key={index}>
                        <NewCard
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
