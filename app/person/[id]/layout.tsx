import Text from '@/app/components/Text';
import Image from 'next/image';
import BackButton from '@/app/components/BackButton';
import ContentPageNav from '@/app/components/ContentPageNav';

interface LayoutProps {
    children: React.ReactNode;
    params: { id: string };
}

export default async function Layout({ children, params }: LayoutProps) {
    let personId = params.id;

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

    let deets = await res.json();

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
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={false} />
            <div>
                <h1 className="text-2xl sm:text-4xl tracking-wider">
                    {deets.name}
                </h1>
                <div className="w-full max-w-full h-[2px] bg-brand-blue mt-1"></div>
                <p className="font-light">{genders[deets.gender]}</p>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row @container w-full">
                {deets.profile_path ?
                    <Image
                        className="self-center sm:self-start"
                        src={`https://image.tmdb.org/t/p/w400${deets.profile_path}`}
                        alt="person poster"
                        width={200}
                        height={300}
                        priority
                    />
                :   <div className="w-96 bg-slate-300/20 grid place-items-center">
                        {deets.name}&apos;s profile picture unavailable
                    </div>
                }
                <div className="flex flex-col gap-6 @4xl:flex-row w-full">
                    <div className="flex flex-col gap-4 @container w-full">
                        {deets.birthday && (
                            <p className="font-light">
                                Born on {getDate(deets.birthday)} (
                                {getAge(new Date(deets.birthday))} years old)
                            </p>
                        )}
                        {deets.deathday && (
                            <p className="font-light">
                                Passed Away on {getDate(deets.deathday)}
                            </p>
                        )}

                        {deets.place_of_birth && (
                            <p>
                                From{' '}
                                <span className="italic">
                                    {deets.place_of_birth}
                                </span>
                            </p>
                        )}
                        {deets.known_for_department && (
                            <p>Known for {deets.known_for_department}</p>
                        )}

                        {deets.biography && (
                            <div>
                                <h2 className="text-lg font-bold">Biography</h2>
                                <Text text={deets.biography} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ContentPageNav />
            {children}
        </main>
    );
}
