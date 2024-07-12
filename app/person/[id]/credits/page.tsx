import BackButton from '@/app/components/BackButton';
import Card from '@/app/components/Card';
import CreditsHeader from '@/app/components/CreditsHeader';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import Link from 'next/link';

export default async function Credits({ params }: { params: { id: string } }) {
    const creditId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/person/${creditId}?append_to_response=combined_credits&language=en-US`,
        options
    );

    const creditsPerson = await res.json();
    const credits = creditsPerson.combined_credits;

    if (!res.ok) {
        console.error('failed to get person credits');
    }

    return (
        <div className="m-4">
            <BackButton />
            <CreditsHeader data={creditsPerson} type="person" />
            <BackButton />
            <div id="cast" className="mb-8">
                <h2 className="font-bold text-xl">Cast Credits</h2>
                <Link
                    href="#crew"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Skip to Crew Credits
                </Link>
            </div>
            <LargeCreditsList
                data={credits.cast}
                type="multi"
                search={false}
                credits={true}
                fwr={false}
            />
            <BackButton />
            <div id="crew" className="mb-8">
                <h2 className="text-xl font-bold">Crew Credits</h2>
                <Link
                    href="#cast"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Back to Cast Credits
                </Link>
            </div>
            <LargeCreditsList
                data={credits.crew}
                type="multi"
                search={false}
                credits={true}
                fwr={false}
            />
            <BackButton />
        </div>
    );
}
