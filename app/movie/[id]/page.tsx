import SmallCreditsList from '@/app/components/SmallCreditsList';
import ContentPageNav from '@/app/components/ContentPageNav';
import Image from 'next/image';
import ImageSlider from '@/app/components/ImageSlider';

export default async function Movie({ params }: { params: { id: string } }) {
    let movieId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=images,credits,keywords,recommendations,similar,videos,watch_providers,reviews`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    const content = await res.json();

    function convertQuantity(amt: number) {
        let str = amt.toString().split('');
        str.splice(-3, 0, ',');
        str.splice(-7, 0, ',');
        if (str.length >= 12) str.splice(-12, 0, ',');
        let finalStr = str.join('');
        return `$${finalStr}`;
    }

    function getRuntime(min: number) {
        let hrs = (min / 60).toFixed(0);
        let mins = min % 60;
        console.log(hrs);
        return `${hrs}h ${mins}m`;
    }

    return (
        <main className="flex flex-col gap-4">
            {content.budget !== 0 ||
                content.revenue !== 0 ||
                (content.runtime !== 0 && (
                    <div className="flex flex-wrap gap-x-8 gap-y-4 p-4 ring-2 ring-slate-700 w-fit mb-8">
                        {content.budget !== 0 && (
                            <div className="">
                                <p className="font-bold tracking-wider">
                                    Budget
                                </p>
                                <p className="tracking-wide ">
                                    {convertQuantity(content.budget)}
                                </p>
                            </div>
                        )}
                        {content.origin_country.length !== 0 && (
                            <div className="">
                                <p className="font-bold tracking-wider">
                                    Origin Country
                                </p>
                                <p className="tracking-wide ">
                                    {new Intl.DisplayNames(['en'], {
                                        type: 'region',
                                    }).of(content.origin_country[0])}
                                </p>
                            </div>
                        )}
                        {content.revenue !== 0 && (
                            <div className=" ">
                                <p className="font-bold tracking-wider">
                                    Revenue
                                </p>
                                <p className="tracking-wide ">
                                    {convertQuantity(content.revenue)}
                                </p>
                            </div>
                        )}
                        {content.runtime !== 0 && (
                            <div className="">
                                <p className="font-bold tracking-wider">
                                    Runtime
                                </p>
                                <p className="tracking-wide ">
                                    {getRuntime(content.runtime)}
                                </p>
                            </div>
                        )}
                    </div>
                ))}

            <SmallCreditsList
                showId={movieId}
                creds={content.credits}
                cont="movie"
            />
            {content.production_companies.length > 0 && (
                <>
                    <h2 className="my-2 font-bold text-lg">
                        Production Companies
                    </h2>
                    <ul className="flex flex-wrap gap-4 ring-2 ring-slate-700 p-2 mb-8 w-fit">
                        {content.production_companies.map(
                            (pc: any, index: number) => (
                                <li
                                    key={index}
                                    className="w-[120px] grid grid-rows-[100px_min-content] gap-2 p-2"
                                >
                                    <div className="grid place-items-center bg-slate-600 min-w-[100px]">
                                        {pc.logo_path ?
                                            <Image
                                                className="p-2"
                                                src={`https://image.tmdb.org/t/p/w200/${pc.logo_path}`}
                                                alt={`logo`}
                                                width="100"
                                                height="100"
                                            />
                                        :   <div className="w-[90px] h-[90px] bg-slate-900 grid place-items-center p-2 text-center text-slate-400">
                                                no logo available
                                            </div>
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm">{pc.name}</p>
                                        <p className="text-xs">
                                            {pc.origin_country}
                                        </p>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                </>
            )}

            <ImageSlider images={content.images.backdrops} type="Backdrops" />

            <ImageSlider images={content.images.posters} type="Posters" />

            <ImageSlider images={content.images.logos} type="Logos" />
        </main>
    );
}
