import SmallCreditsList from '@/app/components/SmallCreditsList';
import ContentPageNav from '@/app/components/ContentPageNav';
import Image from 'next/image';
import ImageSlider from '@/app/components/ImageSlider';
import Genres from '@/app/components/Genres';
import { Ultra } from 'next/font/google';
import StreamRentBuy from '@/app/components/StreamRentBuy';

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
        `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=images,credits,keywords,recommendations,similar,videos,watch/providers,reviews`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    const content = await res.json();
    console.log(content);
    console.log(content.revenue);
    console.log(content.keywords.keywords);
    console.log(content.keywords.length);
    console.log(content['watch/providers']);
    console.log(content.original_title);

    function convertQuantity(amt: number) {
        let str = amt.toString().split('');
        str.splice(-3, 0, ',');
        str.splice(-7, 0, ',');
        if (str.length >= 12) str.splice(-12, 0, ',');
        if (str.length === 8) str.splice(0, 1);
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
        <main className="flex flex-col md:grid md:grid-cols-2 md:gap-10 w-full gap-4">
            <div className="grid grid-cols-2 gap-10 w-fit h-min mb-2">
                {content.budget !== 0 && (
                    <div className="">
                        <p className="font-medium text-lg mb-2">Budget</p>
                        <p className="tracking-wide font-light">
                            {convertQuantity(content.budget)}
                        </p>
                    </div>
                )}
                {content.origin_country.length !== 0 && (
                    <div className="">
                        <p className="font-medium text-lg mb-2">
                            Origin Country
                        </p>
                        <p className="tracking-wide font-light">
                            {new Intl.DisplayNames(['en'], {
                                type: 'region',
                            }).of(content.origin_country[0])}
                        </p>
                    </div>
                )}
                {content.origin_country.length !== 0 && (
                    <div className="">
                        <p className="font-medium text-lg mb-2">
                            Original Language
                        </p>
                        <p className="tracking-wide font-light">
                            {new Intl.DisplayNames(['en'], {
                                type: 'language',
                            }).of(content.original_language)}
                        </p>
                    </div>
                )}
                {content.revenue !== 0 && (
                    <div className=" ">
                        <p className="font-medium text-lg mb-2">Revenue</p>
                        <p className="tracking-wide font-light">
                            {convertQuantity(content.revenue)}
                        </p>
                    </div>
                )}
                {content.original_title && (
                    <div>
                        <h2 className="mb-2 font-medium text-lg">
                            Original Title
                        </h2>
                        <p className="tracking-wide font-light">
                            {content.original_title}
                        </p>
                    </div>
                )}
                {content.runtime !== 0 && (
                    <div className="">
                        <p className="font-medium text-lg mb-2">Runtime</p>
                        <p className="tracking-wide font-light">
                            {getRuntime(content.runtime)}
                        </p>
                    </div>
                )}
                {content.status && (
                    <div>
                        <h2 className="mb-2 font-medium text-lg">Status</h2>
                        <p className="tracking-wide font-light">
                            {content.status}
                        </p>
                    </div>
                )}
                {content.production_countries &&
                    content.production_countries.length > 0 && (
                        <div>
                            <h2 className="mb-2 font-medium text-lg">
                                Production Countries
                            </h2>
                            <ul className="tracking-wide font-light">
                                {content.production_countries.map(
                                    (c: any, index: number) => (
                                        <li key={index}>{c.name}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                {content.spoken_languages && (
                    <div>
                        <h2 className="mb-2 font-medium text-lg">
                            Spoken Languages
                        </h2>
                        <ul className="tracking-wide font-light">
                            {content.spoken_languages.map(
                                (l: any, index: number) => (
                                    <li key={index}>{l.name}</li>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {content.production_companies.length > 0 && (
                <div className="my-2 ring-2 ring-slate-700 h-full">
                    <h2 className="mb-2 font-medium text-lg px-4 pt-3">
                        Production Companies
                    </h2>
                    <ul className="flex flex-wrap gap-4 px-2 w-full">
                        {content.production_companies.map(
                            (pc: any, index: number) => (
                                <li
                                    key={index}
                                    className="w-[120px] grid grid-rows-[min_content_min-content] gap-2 p-2"
                                >
                                    <div className="grid place-items-center bg-slate-600 min-w-[100px] min-h-[100px]">
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
                                            {new Intl.DisplayNames(['en'], {
                                                type: 'region',
                                            }).of(content.origin_country[0])}
                                        </p>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {content.keywords && content.keywords.keywords.length > 0 && (
                <div className="col-span-2">
                    <h2 className="mb-2 font-medium text-lg">Keywords</h2>
                    <Genres data={content.keywords} content="movie" />
                </div>
            )}

            <StreamRentBuy content={content['watch/providers'].results.US} />

            <div className="col-start-1">
                <h2 className="mb-2 font-medium text-lg">Cast</h2>
                <SmallCreditsList
                    showId={movieId}
                    creds={content.credits.cast}
                    cont="movie"
                />
            </div>
            <div>
                <h2 className="mb-2 font-medium text-lg">Crew</h2>
                <SmallCreditsList
                    showId={movieId}
                    creds={content.credits.crew}
                    cont="movie"
                />
            </div>

            <ImageSlider images={content.images.backdrops} type="Backdrops" />

            <ImageSlider images={content.images.posters} type="Posters" />

            <ImageSlider images={content.images.logos} type="Logos" />
        </main>
    );
}
