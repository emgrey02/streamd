'use client';

import Image from 'next/image';
import BackButton from '@/app/components/BackButton';
import Reviews from '@/app/components/Reviews';
import SmallCreditsList from '@/app/components/SmallCreditsList';
import { useEffect, useState } from 'react';
import ImageSlider from '@/app/components/ImageSlider';
import Link from 'next/link';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import ContentPageNav from '@/app/components/ContentPageNav';
import { getShowInfo } from '@/app/actions';

export default function Show({ params }: { params: { id: string } }) {
    let showId = params.id;
    const [content, setContent] = useState<any>();
    const [contentTitle, setContentTitle] = useState('info');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function retrieveContent() {
            let result = await getShowInfo(showId);
            setContent(result);
        }

        retrieveContent();
        setTimeout(() => setIsLoading(false), 500);
    }, [contentTitle, showId]);

    function setIt(cont: any) {
        setIsLoading(true);
        console.log('setting it');
        if (cont === 'info') {
            setContentTitle('info');
        } else if (cont === 'credits') {
            setContentTitle('credits');
        } else if (cont === 'reviews') {
            setContentTitle('reviews');
        } else if (cont === 'seasons') {
            setContentTitle('seasons');
        }
    }

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
            <ContentPageNav
                setIt={setIt}
                currentTitle={contentTitle}
                person={false}
                tv={true}
            />

            {isLoading && <p>loading...</p>}
            {contentTitle === 'reviews' && !isLoading && (
                <Reviews reviews={content.reviews} />
            )}
            {contentTitle === 'credits' &&
                content.aggregate_credits.cast &&
                !isLoading && (
                    <>
                        <div id="cast" className="flex flex-col mb-8">
                            <h1 className="text-xl font-bold">Full Cast</h1>
                            <Link
                                href="#crew"
                                className="text-sm hover:underline underline-offset-2"
                            >
                                Skip to Full Crew
                            </Link>
                        </div>
                        <LargeCreditsList
                            data={content.aggregate_credits.cast}
                            type="person"
                            search={false}
                            credits={true}
                            fwr={false}
                            seasons={false}
                        />
                        <div id="crew" className="flex flex-col mb-8">
                            <h2 className="text-xl font-bold">Full Crew</h2>
                            <Link
                                href="#cast"
                                className="text-sm hover:underline underline-offset-2"
                            >
                                Back to Full Cast
                            </Link>
                        </div>
                        <LargeCreditsList
                            data={content.aggregate_credits.crew}
                            type="person"
                            search={false}
                            credits={true}
                            fwr={false}
                            seasons={false}
                        />
                    </>
                )}
            {contentTitle === 'info' && content && !isLoading && (
                <>
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
                                                <p className="text-sm">
                                                    {pc.name}
                                                </p>
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

                    {content &&
                        contentTitle === 'info' &&
                        content.aggregate_credits && (
                            <SmallCreditsList
                                setIt={setIt}
                                creds={content.aggregate_credits}
                                cont="tv"
                            />
                        )}
                    {content && contentTitle === 'info' && content.seasons && (
                        <>
                            <h2 className="text-xl">Seasons</h2>
                            <LargeCreditsList
                                data={content.seasons}
                                type="tv"
                                credits={false}
                                search={false}
                                fwr={false}
                                seasons={true}
                                showId={showId}
                            />
                        </>
                    )}

                    <ImageSlider
                        images={content.images.backdrops}
                        type="Backdrops"
                    />

                    <ImageSlider
                        images={content.images.posters}
                        type="Posters"
                    />

                    <ImageSlider images={content.images.logos} type="Logos" />
                </>
            )}
            {content &&
                contentTitle === 'seasons' &&
                content.seasons &&
                !isLoading && (
                    <>
                        <h2>Seasons</h2>
                        <LargeCreditsList
                            data={content.seasons}
                            type="tv"
                            credits={false}
                            search={false}
                            fwr={false}
                            seasons={true}
                            showId={showId.toString()}
                        />
                    </>
                )}
            <BackButton />
        </main>
    );
}
