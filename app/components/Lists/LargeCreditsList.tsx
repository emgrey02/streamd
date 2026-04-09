'use client';
import { useState } from 'react';
import SmallCard from '@/app/components/Cards/SmallCard';

type CreditsListItem = MovieItem | ShowItem | CastCrewItem | ContentItem;

interface SortedItem {
    year: string;
    credits: CreditsListItem[];
}

interface LargeCreditsListProps {
    data: CreditsListItem[];
    type: string;
    search: boolean;
    credits: boolean;
    seasons: boolean;
    clip: boolean;
    showId?: string;
}

// cast, movies, tv shows
export default function LargeCreditsList({
    data,
    type,
    credits,
    seasons,
    clip,
    showId,
}: LargeCreditsListProps) {
    const [limit, setLimit] = useState(12);

    let yearsArray: string[] = [];

    const sortedArray = data.toSorted(
        (a: CreditsListItem, b: CreditsListItem) => {
            const aVal =
                (a as MovieItem).release_date?.slice(0, 4) ||
                (a as ShowItem).first_air_date?.slice(0, 4);
            const bVal =
                (b as MovieItem).release_date?.slice(0, 4) ||
                (b as ShowItem).first_air_date?.slice(0, 4);
            return +bVal - +aVal;
        }
    );

    sortedArray.forEach((credit: CreditsListItem) => {
        if (
            !yearsArray?.includes(
                (credit as MovieItem).release_date?.slice(0, 4)
            )
        ) {
            yearsArray?.push((credit as MovieItem).release_date?.slice(0, 4));
        }
        if (
            !yearsArray?.includes(
                (credit as ShowItem).first_air_date?.slice(0, 4)
            )
        ) {
            yearsArray?.push((credit as ShowItem).first_air_date?.slice(0, 4));
        }
    });

    yearsArray = yearsArray.filter((year: string) => {
        return year !== '' && year;
    });

    const finalArray: SortedItem[] = [];

    for (let i = 0; i < yearsArray.length; i++) {
        const res = data.filter((credit: CreditsListItem) => {
            if ((credit as MovieItem).release_date) {
                return (
                    yearsArray[i] ==
                    (credit as MovieItem).release_date?.slice(0, 4)
                );
            } else {
                return (
                    yearsArray[i] ==
                    (credit as ShowItem).first_air_date?.slice(0, 4)
                );
            }
        });
        finalArray.push({ year: yearsArray[i], credits: res });
    }

    return (
        <div className="flex flex-col gap-4">
            {credits && type === 'multi' ?
                <>
                    <ul className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-4 justify-start">
                        {finalArray &&
                            finalArray.map((m: SortedItem, index: number) => (
                                <li key={index} id={m.year}>
                                    {m.year}
                                    <ul className="flex flex-col gap-2">
                                        {m.credits.map(
                                            (
                                                c: CreditsListItem,
                                                index: number
                                            ) => (
                                                <li key={index}>
                                                    <SmallCard
                                                        data={c}
                                                        type={type}
                                                        credits={credits}
                                                        seasons={seasons}
                                                        seasonNum={
                                                            seasons ?
                                                                (c as ShowItem)
                                                                    .season_number
                                                            :   0
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
                                .filter(
                                    (c: CreditsListItem, idx: number) =>
                                        idx < limit
                                )
                                .map((m: CreditsListItem, index: number) => (
                                    <li data-num={index} key={index}>
                                        <SmallCard
                                            data={m}
                                            type={type}
                                            credits={credits}
                                            seasons={seasons}
                                            seasonNum={
                                                seasons ?
                                                    (m as ShowItem)
                                                        .season_number
                                                :   0
                                            }
                                            showId={showId || ''}
                                        />
                                    </li>
                                ))
                        :   data &&
                            data.map((m: CreditsListItem, index: number) => (
                                <li data-num={index} key={index}>
                                    <SmallCard
                                        data={m}
                                        type={type}
                                        credits={credits}
                                        seasons={seasons}
                                        seasonNum={
                                            seasons ?
                                                (m as ShowItem).season_number
                                            :   0
                                        }
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
