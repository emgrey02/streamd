import SmallCreditsList from '@/app/components/SmallCreditsList';
import Image from 'next/image';
import ImageSlider from '@/app/components/ImageSlider';
import Genres from '@/app/components/Genres';
import StreamRentBuy from '@/app/components/StreamRentBuy';
import { getRuntime, convertQuantity } from '@/app/utils';

export default async function Movie({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'force-cache',
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?append_to_response=images,credits,keywords,recommendations,similar,videos,watch/providers,reviews`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    const content = await res.json();
    console.log(content.credits.crew);

    return (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 max-w-vw @container">
            <div className="grid grid-cols-2 gap-2 w-full h-fit mb-2">
                {content.runtime !== 0 && (
                    <>
                        <h3 className="font-medium text-lg mb-2">Runtime</h3>
                        <p className="tracking-wide font-light">
                            {getRuntime(content.runtime)}
                        </p>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.budget !== 0 && (
                    <>
                        <h3 className="font-medium text-lg mb-2">Budget</h3>
                        <p className="tracking-wide font-light">
                            {convertQuantity(content.budget)}
                        </p>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.revenue !== 0 && (
                    <>
                        <h3 className="font-medium text-lg mb-2">Revenue</h3>
                        <p className="tracking-wide font-light">
                            {convertQuantity(content.revenue)}
                        </p>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.origin_country.length !== 0 && (
                    <>
                        <h3 className="font-medium text-lg mb-2">
                            Origin Country
                        </h3>
                        <p className="tracking-wide font-light">
                            {new Intl.DisplayNames(['en'], {
                                type: 'region',
                            }).of(content.origin_country[0])}
                        </p>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.origin_country.length !== 0 && (
                    <>
                        <h3 className="font-medium text-lg mb-2">
                            Original Language
                        </h3>
                        <p className="tracking-wide font-light">
                            {new Intl.DisplayNames(['en'], {
                                type: 'language',
                            }).of(content.original_language)}
                        </p>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.original_title && (
                    <>
                        <h3 className="mb-2 font-medium text-lg">
                            Original Title
                        </h3>
                        <p className="tracking-wide font-light">
                            {content.original_title}
                        </p>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.status && (
                    <>
                        <h3 className="mb-2 font-medium text-lg">Status</h3>
                        <p className="tracking-wide font-light">
                            {content.status}
                        </p>
                        <hr className="border-slate-600 col-span-2"></hr>
                    </>
                )}
                {content.production_countries &&
                    content.production_countries.length > 0 && (
                        <>
                            <h3 className="mb-2 font-medium text-lg">
                                Production Countries
                            </h3>
                            <ul className="tracking-wide font-light">
                                {content.production_countries.map(
                                    (c: { name: string }, index: number) => (
                                        <li key={index}>{c.name}</li>
                                    )
                                )}
                            </ul>
                            <hr className="border-slate-600 col-span-2"></hr>
                        </>
                    )}
                {content.spoken_languages && (
                    <>
                        <h3 className="mb-2 font-medium text-lg">
                            Spoken Languages
                        </h3>
                        <ul className="tracking-wide font-light">
                            {content.spoken_languages.map(
                                (
                                    l: {
                                        name: string;
                                        iso_639_1: string;
                                        english_name: string;
                                    },
                                    index: number
                                ) => (
                                    <li key={index}>
                                        {l.name}{' '}
                                        {l.iso_639_1 !== 'en' &&
                                            `(${l.english_name})`}
                                    </li>
                                )
                            )}
                        </ul>
                    </>
                )}
            </div>

            <div className="@container">
                <div className="grid @lg:grid-cols-2 gap-4 h-full">
                    {content.production_companies.length > 0 && (
                        <div className="ring-2 ring-slate-700 h-full w-full">
                            <h3 className="mb-2 font-medium text-lg px-4 pt-3">
                                Production Companies
                            </h3>
                            <ul className="flex flex-col gap-4 px-2 pb-2 w-full">
                                {content.production_companies
                                    .filter(
                                        (
                                            item: {
                                                name: string;
                                                logo_path?: string;
                                            },
                                            idx: number
                                        ) => idx < 4
                                    )
                                    .map(
                                        (
                                            pc: {
                                                name: string;
                                                logo_path?: string;
                                            },
                                            index: number
                                        ) => (
                                            <li
                                                key={index}
                                                className="grid grid-cols-[80px_auto] items-center gap-2 p-2"
                                            >
                                                <div className="grid place-items-center bg-slate-600 min-w-15 min-h-15">
                                                    {pc.logo_path ?
                                                        <Image
                                                            className="mx-2"
                                                            src={`https://image.tmdb.org/t/p/w200/${pc.logo_path}`}
                                                            alt={`logo for ${pc.name}`}
                                                            width="60"
                                                            height="60"
                                                        />
                                                    :   <div className="w-15 h-15 bg-slate-900 grid place-items-center p-2 text-center text-slate-400 text-xs">
                                                            no logo available
                                                        </div>
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-sm">
                                                        {pc.name}
                                                    </p>
                                                    <p className="text-xs">
                                                        {new Intl.DisplayNames(
                                                            ['en'],
                                                            {
                                                                type: 'region',
                                                            }
                                                        ).of(
                                                            content
                                                                .origin_country[0]
                                                        )}
                                                    </p>
                                                </div>
                                            </li>
                                        )
                                    )}
                            </ul>
                        </div>
                    )}

                    {content.keywords &&
                        content.keywords.keywords.length > 0 && (
                            <Genres data={content.keywords} content="movie" />
                        )}
                </div>
            </div>

            <StreamRentBuy content={content['watch/providers'].results.US} />

            <div className="col-start-1">
                <h3 className="mb-2 font-medium text-lg">Cast</h3>
                <SmallCreditsList
                    contentId={id}
                    creds={content.credits.cast}
                    contentType="person"
                />
            </div>
            <div>
                <h3 className="mb-2 font-medium text-lg">Crew</h3>
                <SmallCreditsList
                    contentId={id}
                    creds={content.credits.crew}
                    contentType="person"
                />
            </div>

            <ImageSlider images={content.images.backdrops} type="Backdrops" />

            <ImageSlider images={content.images.posters} type="Posters" />

            <ImageSlider images={content.images.logos} type="Logos" />
        </div>
    );
}
