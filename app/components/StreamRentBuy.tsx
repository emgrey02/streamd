'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function StreamRentBuy(props: { content: any }) {
    const [currentTab, setCurrentTab] = useState('Stream it');
    const [currentContent, setCurrentContent] = useState<any>(null);
    const content = props.content;
    console.log(content);

    useEffect(() => {
        switch (currentTab) {
            case 'Stream it':
                setCurrentContent(content?.flatrate);
                break;
            case 'Buy it':
                setCurrentContent(content?.buy);
                break;
            case 'Rent it':
                setCurrentContent(content?.rent);
            default:
                break;
        }
    }, [currentTab, content]);

    return (
        <>
            {content && (
                <>
                    <div className="ring-2 ring-slate-700 h-full pt-4 px-4 flex flex-col">
                        <ul className="mb-4 flex ring-1 ring-slate-900 w-fit">
                            <li className="border-e-2 border-slate-600">
                                <button
                                    className={`pe-6 py-2 px-2 hover:bg-slate-600 ${currentTab === 'Stream it' ? 'bg-slate-900' : 'bg-slate-700'}`}
                                    onClick={() => setCurrentTab('Stream it')}
                                >
                                    Stream it
                                </button>
                            </li>
                            <li className="border-e-2 border-slate-600">
                                <button
                                    className={`pe-6 py-2 px-2 hover:bg-slate-600 ${currentTab === 'Buy it' ? 'bg-slate-900' : 'bg-slate-700'}`}
                                    onClick={() => setCurrentTab('Buy it')}
                                >
                                    Buy it
                                </button>
                            </li>
                            <li className="">
                                <button
                                    className={`pe-6 py-2 px-2 hover:bg-slate-600 ${currentTab === 'Rent it' ? 'bg-slate-900' : 'bg-slate-700'}`}
                                    onClick={() => setCurrentTab('Rent it')}
                                >
                                    Rent it
                                </button>
                            </li>
                        </ul>

                        <ul className="flex flex-wrap gap-4 w-full">
                            {currentContent ?
                                currentContent.map((wp: any, index: number) => (
                                    <li
                                        key={index}
                                        className="w-fit flex items-center gap-2"
                                    >
                                        <div className="grid place-items-center bg-slate-600 min-w-[60px] min-h-[60px]">
                                            {wp.logo_path ?
                                                <Image
                                                    className="p-2"
                                                    src={`https://image.tmdb.org/t/p/w200/${wp.logo_path}`}
                                                    alt={`logo`}
                                                    width="60"
                                                    height="60"
                                                />
                                            :   <div className="w-[60px] h-[60px] bg-slate-900 grid place-items-center p-2 text-center text-slate-400">
                                                    no logo available
                                                </div>
                                            }
                                        </div>
                                        <div className="w-fit max-w-28">
                                            <p className="text-sm w-fit">
                                                {wp.provider_name}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            :   <p className="px-4 pb-2 font-light">
                                    no info available...
                                </p>
                            }
                        </ul>
                        <a
                            className="text-sm text-end text-slate-500"
                            href={content.link}
                        >
                            JustWatch
                        </a>
                    </div>
                </>
            )}
        </>
    );
}
