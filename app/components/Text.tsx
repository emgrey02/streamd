'use client';

import { useEffect, useRef, useState } from 'react';

export default function Text(props: { text: string }) {
    const [expandedText, setExpandedText] = useState(false);
    const [clamped, setClamped] = useState(true);
    const containerRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState<number>(0);

    function getWindowWidth() {
        const width = window.innerWidth;
        return width;
    }

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

        function handleResize() {
            setWindowWidth(getWindowWidth());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [containerRef, windowWidth]);

    function showText() {
        setExpandedText(true);
    }

    function hideText() {
        setExpandedText(false);
    }
    return (
        <div className="relative w-fit">
            <p
                ref={containerRef}
                className={`max-w-2xl leading-relaxed ${!expandedText ? 'line-clamp-3' : 'bg-slate-800'} transition`}
            >
                {props.text}
            </p>

            {clamped && (
                <div className="flex justify-end items-end">
                    {!expandedText ?
                        <button
                            onClick={showText}
                            className="underline underline-offset-2 hover:underline-offset-4  transition-all"
                        >
                            more
                        </button>
                    :   <button
                            className="underline underline-offset-2 hover:underline-offset-4  transition-all"
                            onClick={hideText}
                        >
                            less
                        </button>
                    }
                </div>
            )}
        </div>
    );
}
