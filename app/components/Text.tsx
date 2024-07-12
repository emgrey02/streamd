'use client';

import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

export default function Text(props: { text: string }) {
    const [expandedText, setExpandedText] = useState(false);
    const [clamped, setClamped] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        function isClamped(el: HTMLParagraphElement | null) {
            if (el) {
                const { clientHeight, scrollHeight } = el;
                return clientHeight !== scrollHeight;
            } else {
                console.log('this element is null');
                return false;
            }
        }

        setClamped(isClamped(containerRef.current));
    }, [containerRef]);

    function showText() {
        setExpandedText(true);
    }

    function hideText() {
        setExpandedText(false);
    }
    return (
        <div className="relative bg-slate-800">
            <p
                ref={containerRef}
                className={`max-w-2xl leading-relaxed ${!expandedText ? 'line-clamp-3' : ''} transition`}
            >
                {props.text}
            </p>

            {clamped && (
                <div className="flex justify-end items-end">
                    {!expandedText ?
                        <button
                            onClick={showText}
                            className="underline underline-offset-2 hover:underline-offset-4 w-min transition-all"
                        >
                            read more
                        </button>
                    :   <button
                            className="underline underline-offset-2 hover:underline-offset-4 w-min transition-all"
                            onClick={hideText}
                        >
                            close
                        </button>
                    }
                </div>
            )}
        </div>
    );
}
