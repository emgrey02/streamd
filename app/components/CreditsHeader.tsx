import Image from 'next/image';
import Genres from './Genres';

export default function CreditsHeader(props: { data: any; type: string }) {
    const c = props.data;
    const type = props.type;

    const genders = ['not specified', 'female', 'male', 'non-binary'];

    function getAge(birthdate: Date, deathDate?: string) {
        let today = new Date();
        if (deathDate) {
            today = new Date(deathDate);
        }

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

    return (
        <>
            <div className="flex gap-4 mb-8">
                {c.profile_path || c.poster_path ?
                    <Image
                        src={`https://image.tmdb.org/t/p/w200${c.profile_path || c.poster_path}`}
                        alt={`${c.name} image`}
                        width={200}
                        height={300}
                    />
                :   <div className="w-[200px] h-[300px] grid place-items-center text-center bg-slate-300/20">
                        {c.name} image unavailable
                    </div>
                }
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-xl font-bold">
                            {c.name || c.title}
                        </h1>
                        {type === 'person' ?
                            <p className="text-sm font-light">
                                {genders[c.gender]}
                            </p>
                        :   <p className="font-light text-sm">
                                {type === 'movie' ? type : 'tv show'}
                            </p>
                        }
                    </div>
                    {type === 'person' ?
                        <>
                            <p>
                                {getAge(new Date(c.birthday), c.deathday)} years
                                old
                            </p>
                            <p>Known For: {c.known_for_department}</p>
                        </>
                    :   <>
                            <div>
                                <h2 className="font-bold">
                                    {type === 'tv' ? 'First Aired' : 'Released'}
                                </h2>
                                <p>
                                    {type === 'tv' ?
                                        getDate(c.first_air_date)
                                    :   getDate(c.release_date)}
                                </p>
                            </div>
                            {c.genres.length > 0 && <Genres data={c.genres} />}
                        </>
                    }
                </div>
            </div>
            <div className="w-full h-[2px] bg-slate-900 my-8"></div>
        </>
    );
}
