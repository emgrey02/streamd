'use client';
import { useState } from 'react';
import SmallCard from './SmallCard';

export default function LargeCreditsList(props: {
    data: any;
    type: string;
    search: boolean;
    credits: boolean;
    seasons: boolean;
    clip: boolean;
    showId?: string;
}) {
    let data = props.data;
    const type = props.type;
    const search = props.search;
    const credits = props.credits;
    const seasons = props.seasons;
    const showId = props.showId;
    const clip = props.clip;

    const [limit, setLimit] = useState(12);

    console.log(data);
    console.log(type);

    let yearsArray: any = [];

    let sortedArray = data.toSorted(
        (a: any, b: any) =>
            +b.release_date?.slice(0, 4) - +a.release_date?.slice(0, 4)
    );

    sortedArray.forEach((credit: any) => {
        if (!yearsArray?.includes(credit.release_date?.slice(0, 4))) {
            yearsArray?.push(credit.release_date?.slice(0, 4));
        }
        if (!yearsArray?.includes(credit.first_air_date?.slice(0, 4))) {
            yearsArray?.push(credit.first_air_date?.slice(0, 4));
        }
    });

    yearsArray = yearsArray.filter((year: string) => {
        return year !== '' && year;
    });

    let finalArray: any = [];

    for (let i = 0; i < yearsArray.length; i++) {
        console.log(yearsArray[i]);
        let res = data.filter((credit: any) => {
            if (credit.release_date) {
                return yearsArray[i] == credit.release_date?.slice(0, 4);
            } else {
                return yearsArray[i] == credit.first_air_date?.slice(0, 4);
            }
        });
        console.log(res);
        finalArray.push({ year: yearsArray[i], credits: res });
    }

    console.log(finalArray);

    return (
        <div className="flex flex-col gap-4">
            {credits && type === 'multi' ?
                <>
                    <ul className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-4 justify-start">
                        {finalArray &&
                            finalArray.map((m: any, index: number) => (
                                <li key={index} id={m.year}>
                                    {m.year}
                                    <ul className="flex flex-col gap-2">
                                        {m.credits.map(
                                            (c: any, index: number) => (
                                                <li key={index}>
                                                    <SmallCard
                                                        data={c}
                                                        type={type}
                                                        search={search}
                                                        credits={credits}
                                                        seasons={seasons}
                                                        seasonNum={
                                                            seasons &&
                                                            m.season_number
                                                        }
                                                        showId={showId || ''}
                                                    />
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </li>
                            ))}
                    </ul>
                </>
            :   <>
                    <ul className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-4 justify-start">
                        {clip ?
                            data &&
                            data
                                .filter((c: any, idx: number) => idx < limit)
                                .map((m: any, index: number) => (
                                    <li data-num={index} key={index}>
                                        <SmallCard
                                            data={m}
                                            type={type}
                                            search={search}
                                            credits={credits}
                                            seasons={seasons}
                                            seasonNum={
                                                seasons && m.season_number
                                            }
                                            showId={showId || ''}
                                        />
                                    </li>
                                ))
                        :   data &&
                            data.map((m: any, index: number) => (
                                <li data-num={index} key={index}>
                                    <SmallCard
                                        data={m}
                                        type={type}
                                        search={search}
                                        credits={credits}
                                        seasons={seasons}
                                        seasonNum={seasons && m.season_number}
                                        showId={showId || ''}
                                    />
                                </li>
                            ))
                        }
                        {data && data.length == 0 && (
                            <p>No content available.</p>
                        )}
                    </ul>
                    {data.length > 12 && clip && (
                        <button
                            className="text-end"
                            onClick={() =>
                                limit === 12 ? setLimit(100000) : setLimit(12)
                            }
                        >
                            {limit === 12 ? 'More' : 'Less'}
                        </button>
                    )}
                </>
            }
        </div>
    );
}
