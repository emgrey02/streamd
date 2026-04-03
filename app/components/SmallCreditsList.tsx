'use client';
import BigCard from './BigCard';
import Link from 'next/link';

// for displaying a few credits on the movie and tv show pages, with a link to the full credits page
export default function SmallCreditsList(props: {
    creds: CastCrewItem[];
    contentId?: string;
    contentType: string;
    personId?: string;
}) {
    const creds = props.creds;

    return (
        <div className={`flex flex-col`}>
            {creds && creds.length > 0 ?
                <div className="@container">
                    <ul
                        className={`grid ${creds.length == 1 && '@lg:grid-cols-1 @2xl:grid-cols-1'} ${creds.length == 2 && `@lg:grid-cols-2 @2xl:grid-cols-2`} ${creds.length > 2 && 'grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-4'} gap-4 gap-y-6 justify-start`}
                    >
                        {creds.map(
                            (p: CastCrewItem, index: number) =>
                                index < 4 && (
                                    <li key={index}>
                                        <BigCard
                                            data={p}
                                            type={props.contentType}
                                        />
                                    </li>
                                )
                        )}
                    </ul>
                </div>
            :   <div>no credits available...</div>}
            <Link
                className="self-end my-2 text-sm"
                href={`${props.contentId || props.personId}/credits`}
            >
                See All Credits
            </Link>
        </div>
    );
}
