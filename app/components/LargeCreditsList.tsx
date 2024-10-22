import SmallCard from './SmallCard';

export default function LargeCreditsList(props: {
    data: any;
    type: string;
    search: boolean;
    credits: boolean;
    fwr: boolean;
    seasons: boolean;
    showId?: string;
}) {
    let data = props.data;
    const type = props.type;
    const search = props.search;
    const credits = props.credits;
    const fwr = props.fwr;
    const seasons = props.seasons;
    const showId = props.showId;

    console.log(data);

    return (
        <ul className="grid grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3 gap-4 gap-y-6 justify-start mb-8">
            {data &&
                data.map((m: any, index: number) => (
                    <li data-num={index} key={index}>
                        <SmallCard
                            data={m}
                            type={type}
                            search={search}
                            credits={credits}
                            fwr={fwr}
                            seasons={seasons}
                            seasonNum={seasons && m.season_number}
                            showId={showId || ''}
                        />
                    </li>
                ))}
            {data && data.length == 0 && <p>No content available.</p>}
        </ul>
    );
}
