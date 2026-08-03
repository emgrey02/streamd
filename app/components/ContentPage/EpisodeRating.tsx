'use client';

import { useEffect, useState } from 'react';
import SubmitRating from '@/app/components/ContentPage/SubmitRating';
import { getSessionId } from '@/app/actions/auth';
import { useUsername } from '@/app/lib/useUsername';

export default function EpisodeRating(props: {
    id: number;
    voteAvg: number;
    totalVotes: number;
    seasonNum: string;
    episodeNum: string;
}) {
    const username = useUsername();
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!username) return;

        let cancelled = false;

        getSessionId().then((id) => {
            if (!cancelled) setSessionId(id);
        });

        return () => {
            cancelled = true;
        };
    }, [username]);

    if (!sessionId) return null;

    return (
        <SubmitRating
            content="tv"
            id={props.id}
            sessionId={sessionId}
            voteAvg={props.voteAvg}
            totalVotes={props.totalVotes}
            seasonNum={props.seasonNum}
            episodeNum={props.episodeNum}
        />
    );
}
