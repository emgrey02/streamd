import BackButton from '@/app/components/BackButton';
import SmallCastList from '@/app/components/SmallCastList';
import Image from 'next/image';

export default async function Person({ params }: { params: { id: string } }) {
    const personId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/person/${personId}?append_to_response=combined_credits&language=en-US`,
        options
    );

    const details = await res.json();

    if (res!.ok) {
        console.error('failed to fetch person details');
    }

    const genders = ['not specified', 'female', 'male', 'non-binary'];

    return (
        <div className="m-4">
            {details && (
                <div>
                    <div className="grid gap-4 md:flex">
                        {details.profile_path ?
                            <Image
                                className="max-h-600"
                                src={`https://image.tmdb.org/t/p/w400${details.profile_path}`}
                                alt="person poster"
                                width={400}
                                height={600}
                                priority
                            />
                        :   <div className="w-full sm:w-[400px] h-[600px] bg-slate-700 grid place-items-center text-center">
                                {details.name}&apos;s profile picture
                                unavailable
                            </div>
                        }
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="font-bold text-lg">
                                    {details.name}
                                </h1>
                                <p>{genders[details.gender]}</p>
                            </div>
                            <div>
                                <p>Birth: {details.birthday}</p>
                                {details.deathday && (
                                    <p>Death: {details.deathday}</p>
                                )}
                            </div>
                            <p>From {details.place_of_birth}</p>
                            <p className="max-w-2xl">{details.biography}</p>
                        </div>
                    </div>
                    <BackButton />
                    <div className="my-8">
                        <h2 className="text-xl font-bold my-4">Credits</h2>
                        <SmallCastList
                            creds={details.combined_credits}
                            cont="person"
                            personId={params.id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
