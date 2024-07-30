import { getPersonInfo } from '@/app/actions';
import ContentPageNav from '@/app/components/ContentPageNav';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import SmallCreditsList from '@/app/components/SmallCreditsList';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default async function PersonPage({
    params,
}: {
    params: { id: string };
}) {
    const personId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/person/${personId}?append_to_response=combined_credits&language=en-US&sort_by=primary_release_date.asc`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch person data');
    }

    const content = await res.json();

    return (
        <main className="my-4">
            <div>
                <h2 className="font-medium text-lg mb-2">Cast Credits</h2>
                <SmallCreditsList
                    creds={content.combined_credits.cast}
                    showId={personId}
                    personId={personId}
                />
            </div>
            <div>
                <h2 className="font-medium text-lg mb-2">Crew Credits</h2>
                <SmallCreditsList
                    creds={content.combined_credits.crew}
                    showId={personId}
                    personId={personId}
                />
            </div>
        </main>
    );
}
