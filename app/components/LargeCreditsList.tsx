import Card from './Card';

export default function LargeCreditsList(props: {
    credits: any;
    type: string;
}) {
    const credits = props.credits;
    const type = props.type;

    return (
        <ul className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start">
            {credits &&
                credits.map((m: any, index: number) => (
                    <li
                        data-num={index}
                        className="flex flex-col w-full justify-between sm:h-[370px]"
                        key={index}
                    >
                        <Card data={m} type={type} search={false} />
                    </li>
                ))}
            {credits.length == 0 && <p>No content available.</p>}
        </ul>
    );
}
