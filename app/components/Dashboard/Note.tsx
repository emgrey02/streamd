'use client';

import { useState } from 'react';

export default function Note(props: { comments: any; mt: string; mi: string }) {
    const [showNote, setShowNote] = useState(false);

    return (
        <>
            {props.comments[`${props.mt}:${props.mi}`] && (
                <div className="flex flex-col gap-2 px-2 w-full pb-2">
                    <button
                        className="text-brand-blue underline underline-offset-4 text-start pt-1"
                        onClick={() => setShowNote(!showNote)}
                    >
                        {showNote ? 'close note' : 'see note'}
                    </button>
                    {showNote && (
                        <div>
                            <p>{props.comments[`${props.mt}:${props.mi}`]}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
