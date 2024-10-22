'use client';

import { useEffect, useState } from 'react';
import { getContentAccountInfo, rateContent, deleteRating } from '../actions';

export default function SubmitRating(props: {
    content: string;
    id: number;
    sessionId: string;
    voteAvg: number;
    totalVotes: number;
    seasonNum?: string;
    episodeNum?: string;
}) {
    const [isRating, setIsRating] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hasUserRated, setHasUserRated] = useState(false);
    const [progress, setProgress] = useState({ width: '0px' });
    const [youProgress, setYouProgress] = useState({ width: '0px' });

    const voteAverage = Math.round(props.voteAvg * 10) / 10;

    function deletePrevRating() {
        props.seasonNum && props.episodeNum ?
            deleteRating(
                props.content,
                props.id,
                props.sessionId,
                props.seasonNum,
                props.episodeNum
            )
        :   deleteRating(props.content, props.id, props.sessionId);
        setHasUserRated(false);
    }

    function triggerRatingForm() {
        if (hasUserRated && props.seasonNum) {
            deleteRating(
                props.content,
                props.id,
                props.sessionId,
                props.seasonNum,
                props.episodeNum
            ).then(() => setIsRating(true));
        } else if (hasUserRated) {
            deleteRating(props.content, props.id, props.sessionId).then(() =>
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
        props.seasonNum && props.episodeNum ?
            rateContent(
                props.content,
                props.id,
                userRating,
                props.sessionId,
                props.seasonNum,
                props.episodeNum
            )
        :   rateContent(props.content, props.id, userRating, props.sessionId);
        setUserRating(userRating);
        setYouProgress(convertRating(userRating));
        setIsRating(false);
        setHasUserRated(true);
    }

    useEffect(() => {
        async function seeIfUserRated() {
            let ur;

            if (props.seasonNum && props.episodeNum) {
                ur = await getContentAccountInfo(
                    props.sessionId,
                    props.content,
                    props.id,
                    props.seasonNum,
                    props.episodeNum
                );
            } else {
                ur = await getContentAccountInfo(
                    props.sessionId,
                    props.content,
                    props.id
                );
            }

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
    }, [
        props.content,
        props.id,
        props.sessionId,
        voteAverage,
        props.seasonNum,
        props.episodeNum,
    ]);

    return (
        <div className="@container">
            <div className="grid @md:grid-cols-2 w-full gap-8 items-center">
                <div className="flex flex-col gap-2">
                    <p className="text-sm">
                        Average Rating: {voteAverage} / 10
                    </p>
                    <div className="h-3 w-full relative overflow-hidden bg-slate-900">
                        <div
                            className={`h-full bg-brand-blue absolute`}
                            style={progress}
                        ></div>
                    </div>
                    <p className="text-sm">Total votes: {props.totalVotes}</p>
                </div>
                <div className="w-full gap-4">
                    {(hasUserRated || (!hasUserRated && isRating)) && (
                        <div className="flex flex-col gap-2 h-full">
                            <div className="text-sm">
                                Your Rating: {userRating} / 10
                            </div>
                            <div className="h-3 w-full relative overflow-hidden bg-slate-900">
                                <div
                                    className={`h-full bg-green-300/70 absolute`}
                                    style={youProgress}
                                ></div>
                            </div>
                        </div>
                    )}
                    {!isRating && !hasUserRated && (
                        <button
                            className="w-fit border-2 px-2 py-1 border-slate-500 hover:border-brand-blue"
                            onClick={triggerRatingForm}
                        >
                            Rate it
                        </button>
                    )}
                    {!isRating && hasUserRated && (
                        <div className="text-sm grid grid-cols-2 h-full w-100 gap-4 font-semibold mt-4">
                            <button
                                className="bg-brand-blue text-slate-950 h-full w-full py-2 hover:bg-brand-blue/70 transition"
                                onClick={triggerRatingForm}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-slate-900 h-full w-full py-2 hover:bg-red-800 transition"
                                onClick={deletePrevRating}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                    {isRating && (
                        <form className="flex flex-col mt-4">
                            <div className="flex flex-col">
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
                                <div className="text-sm grid grid-cols-2 h-full w-100 gap-4 font-semibold mt-4">
                                    <button
                                        className="bg-brand-blue text-slate-950 h-full w-full py-2 hover:bg-brand-blue/70 transition"
                                        onClick={() => setIsRating(false)}
                                    >
                                        cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-slate-900 h-full w-full py-2 hover:bg-green-300/70 hover:text-slate-900 transition"
                                        onClick={submitRating}
                                    >
                                        submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
