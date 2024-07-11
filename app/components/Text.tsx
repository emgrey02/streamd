'use client';

import { useState } from 'react';

export default function Text(props: { text: string }) {
    const [expandedText, setExpandedText] = useState(false);

    function showText() {
        setExpandedText(true);
    }

    function hideText() {
        setExpandedText(false);
    }
    return (
        <div className="relative bg-slate-800">
            <p
                className={`max-w-2xl leading-relaxed ${!expandedText ? 'line-clamp-3' : ''}`}
            >
                {props.text}
            </p>

            <div className="flex justify-end items-end">
                {expandedText ?
                    <button
                        className="underline underline-offset-2 w-min "
                        onClick={hideText}
                    >
                        close
                    </button>
                :   <button
                        onClick={showText}
                        className="underline underline-offset-2 w-min "
                    >
                        read more
                    </button>
                }
            </div>
        </div>
    );
}
