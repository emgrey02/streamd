'use client';

import { useEffect, useState } from 'react';
import { getContentAccountInfo, rateContent, deleteRating } from '../actions';

export default function SubmitRating(params: {
    content: string;
    id: number;
    sessionId: string;
    voteAvg: number;
    totalVotes: number;
}) {
    // const { data } = useFormState();
    const [isRating, setIsRating] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hasUserRated, setHasUserRated] = useState(false);
    const [progress, setProgress] = useState({ width: '0px' });
    const [youProgress, setYouProgress] = useState({ width: '0px' });

    const voteAverage = Math.round(params.voteAvg * 10) / 10;
    console.log(voteAverage);

    function deletePrevRating() {
        deleteRating(params.content, params.id, params.sessionId);
        setHasUserRated(false);
    }

    function triggerRatingForm() {
        if (hasUserRated) {
            deleteRating(params.content, params.id, params.sessionId).then(() =>
                setIsRating(true)
            );
        } else {
            setIsRating(true);
        }
    }

    function convertRating(rating: number) {
        let roundedToNearest5 = Math.round((rating * 10) / 5) * 5;

        let styleObj = {
            width: `${roundedToNearest5.toString()}%`,
        };
        return styleObj;
    }

    function changeRating(event: React.ChangeEvent<HTMLInputElement>) {
        setUserRating(+event.target.value);
        setYouProgress(convertRating(+event.target.value));
    }

    function submitRating() {
        rateContent(params.content, params.id, userRating, params.sessionId);
        setUserRating(userRating);
        setYouProgress(convertRating(userRating));
        setIsRating(false);
        setHasUserRated(true);
    }

    useEffect(() => {
        async function seeIfUserRated() {
            let ur = await getContentAccountInfo(
                params.sessionId,
                params.content,
                params.id
            );

            if (ur.rated) {
                setHasUserRated(true);
                setUserRating(ur.rated.value);
                setYouProgress(convertRating(ur.rated.value));
            } else {
                setHasUserRated(false);
            }
        }

        let convertedRating = convertRating(voteAverage);
        setProgress(convertedRating);
        seeIfUserRated();
    }, [params.content, params.id, params.sessionId, voteAverage]);

    return (
        <div className="grid grid-cols-2 w-full gap-8">
            <div className="flex flex-col gap-2">
                <p className="text-sm">Average Rating: {voteAverage}</p>
                <div className="h-3 w-full relative overflow-hidden bg-slate-900">
                    <div
                        className={`h-full bg-brand-blue absolute`}
                        style={progress}
                    ></div>
                </div>
                <p className="text-sm">Total votes: {params.totalVotes}</p>
            </div>
            <div className="w-full grid grid-rows-2 gap-4">
                {(hasUserRated || (!hasUserRated && isRating)) && (
                    <div className="flex flex-col gap-2 h-full">
                        <div className="text-sm">Your Rating: {userRating}</div>
                        <div className="h-3 w-full relative overflow-hidden bg-slate-900">
                            <div
                                className={`h-full bg-green-300/70 absolute`}
                                style={youProgress}
                            ></div>
                        </div>
                    </div>
                )}
                {!isRating && !hasUserRated && (
                    <button className="w-fit" onClick={triggerRatingForm}>
                        Rate {params.content === 'movie' ? 'movie' : 'tv show'}
                    </button>
                )}
                {!isRating && hasUserRated && (
                    <div className="text-sm grid grid-cols-2 h-full w-100 gap-4 font-semibold">
                        <button
                            className="bg-brand-blue text-slate-950 h-full w-full py-2 hover:bg-brand-blue/70 transition"
                            onClick={triggerRatingForm}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-slate-900 h-full w-full py-2 hover:bg-slate-900/70 transition"
                            onClick={deletePrevRating}
                        >
                            Delete
                        </button>
                    </div>
                )}
                {isRating && (
                    <form className="flex flex-col">
                        <div className="flex flex-col gap-2">
                            <input
                                className="accent-slate-500 cursor-pointer"
                                type="range"
                                id="rating"
                                name="rating"
                                min="1"
                                max="10"
                                step="0.5"
                                defaultValue={userRating}
                                onChange={changeRating}
                            ></input>
                            <div className="flex justify-between">
                                <button onClick={() => setIsRating(false)}>
                                    cancel
                                </button>
                                <button type="submit" onClick={submitRating}>
                                    submit
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
