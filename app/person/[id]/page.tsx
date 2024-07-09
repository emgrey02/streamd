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
    console.log(details);

    if (res!.ok) {
        console.error('failed to fetch person details');
    }

    const genders = ['not specified', 'female', 'male', 'non-binary'];

    function getDate(birthday: string) {
        console.log(birthday);
        let birthArray = birthday.split('-');
        let months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        let month = months[+birthArray[1] - 1];
        return `${month} ${birthArray[2]}, ${birthArray[0]}`;
    }

    function getAge(birthdate: Date) {
        const today = new Date();

        const age =
            today.getFullYear() -
            birthdate.getFullYear() -
            (+(today.getMonth() < birthdate.getMonth()) ||
                +(
                    today.getMonth() === birthdate.getMonth() &&
                    today.getDate() < birthdate.getDate()
                ));
        return age;
    }

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
                                <h1 className="font-bold text-2xl">
                                    {details.name}
                                </h1>
                                <p className="font-light">
                                    {genders[details.gender]}
                                </p>
                            </div>
                            <div>
                                {details.birthday && (
                                    <>
                                        <p className="font-bold">Birthday</p>
                                        <p className="font-light">
                                            {getDate(details.birthday)}
                                        </p>
                                        <p>
                                            (
                                            {getAge(new Date(details.birthday))}{' '}
                                            years old)
                                        </p>
                                    </>
                                )}
                                {details.deathday && (
                                    <>
                                        <p className="font-bold">Death</p>
                                        <p className="font-light">
                                            {getDate(details.deathday)}
                                        </p>
                                    </>
                                )}
                            </div>
                            {details.place_of_birth && (
                                <div>
                                    <h2 className="font-bold">Birthplace</h2>
                                    <p>From {details.place_of_birth}</p>
                                </div>
                            )}
                            <div>
                                <h2 className="font-bold">Known For</h2>
                                <p>{details.known_for_department}</p>
                            </div>
                            {details.biography && (
                                <div>
                                    <h2 className="text-lg font-bold my-2">
                                        Biography
                                    </h2>
                                    <p className="max-w-2xl">
                                        {details.biography}
                                    </p>
                                </div>
                            )}
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
