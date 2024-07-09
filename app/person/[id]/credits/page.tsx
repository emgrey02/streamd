import BackButton from '@/app/components/BackButton';
import Card from '@/app/components/Card';
import CreditsHeader from '@/app/components/CreditsHeader';
import Link from 'next/link';

export default async function Credits({ params }: { params: { id: string } }) {
    const creditId = params.id;
    console.log(creditId);

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
            <ul className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start">
                {credits.cast &&
                    credits.cast.map((m: any, index: number) => (
                        <li
                            data-num={index}
                            className="flex flex-col w-full justify-between sm:h-[370px]"
                            key={index}
                        >
                            <Card data={m} type="person" search={false} />
                        </li>
                    ))}
                {credits.cast.length == 0 && (
                    <p>
                        {creditsPerson.name} doesn&apos;t have any Cast Credits.
                    </p>
                )}
            </ul>
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
            <ul className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start">
                {credits.crew &&
                    credits.crew.map((m: any, index: number) => (
                        <li
                            data-num={index}
                            className="flex flex-col w-full justify-between sm:h-[370px]"
                            key={index}
                        >
                            <Card data={m} type="person" search={false} />
                        </li>
                    ))}
                {credits.crew.length == 0 && (
                    <p>
                        {creditsPerson.name} doesn&apos;t have any Crew Credits.
                    </p>
                )}
            </ul>
            <BackButton />
        </div>
    );
}
