import Text from '@/app/components/Text';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { headers } from 'next/headers';
import BackButton from '@/app/components/BackButton';

interface LayoutProps {
    children: React.ReactNode;
    params: { id: string };
}

export default async function Layout({ children, params }: LayoutProps) {
    let personId = params.id;

    const sessionId = cookies().get('sessionId')?.value;
    const accountId = cookies().get('accId')?.value;

    const headersList = headers();
    const header_url = headersList.get('x-url') || '';
    const pathname = headersList.get('x-pathname');
    const origin_url = headersList.get('x-origin');

    console.log(header_url, pathname, origin_url);

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
        console.error('failed to fetch movie data');
    }

    let deets = await res.json();
    console.log(deets);

    function getDate(birthday: string) {
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

    const genders = ['not specified', 'female', 'male', 'non-binary'];

    return (
        <main className="m-2 md:m-4 lg:m-8">
            <BackButton />
            <div className="grid gap-4 md:flex">
                {deets.profile_path ?
                    <Image
                        className="max-h-600"
                        src={`https://image.tmdb.org/t/p/w400${deets.profile_path}`}
                        alt="person poster"
                        width={400}
                        height={600}
                        priority
                    />
                :   <div className="w-full sm:w-[400px] h-[600px] bg-slate-700 grid place-items-center text-center">
                        {deets.name}&apos;s profile picture unavailable
                    </div>
                }
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="font-bold text-2xl">{deets.name}</h1>
                        <p className="font-light">{genders[deets.gender]}</p>
                    </div>
                    <div>
                        {deets.birthday && (
                            <>
                                <p className="font-bold">Birthday</p>
                                <p className="font-light">
                                    {getDate(deets.birthday)}
                                </p>
                                <p>
                                    ({getAge(new Date(deets.birthday))} years
                                    old)
                                </p>
                            </>
                        )}
                        {deets.deathday && (
                            <>
                                <p className="font-bold">Death</p>
                                <p className="font-light">
                                    {getDate(deets.deathday)}
                                </p>
                            </>
                        )}
                    </div>
                    {deets.place_of_birth && (
                        <div>
                            <h2 className="font-bold">Birthplace</h2>
                            <p>From {deets.place_of_birth}</p>
                        </div>
                    )}
                    <div>
                        <h2 className="font-bold">Known For</h2>
                        <p>{deets.known_for_department}</p>
                    </div>
                    {deets.biography && (
                        <div>
                            <h2 className="text-lg font-bold my-2">
                                Biography
                            </h2>
                            <Text text={deets.biography} />
                        </div>
                    )}
                </div>
            </div>
            {children}
        </main>
    );
}
