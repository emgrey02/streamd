'use client';
import { useEffect, useState } from 'react';
import { AddToList, getItemStatus, searchForContent } from '../actions';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddContentToList(props: { at: string; id: string }) {
    const [searchResults, setSearchResults] = useState<any>();
    const [searchValue, setSearchValue] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const router = useRouter();
    const [itemStatuses, setItemStatuses] = useState<any>();

    const LoadMore = () => {
        setPageNum(pageNum + 1);
    };

    const getItemStatuses = async () => {
        if (itemStatuses) {
        }
        for (let i = 0; i++; i < searchResults.length) {
            const itemStatus = await getItemStatus(
                props.at,
                props.id,
                searchResults[i].media_type,
                searchResults[i].id
            ).then(() =>
                setItemStatuses((itemStatuses: any) => [
                    ...itemStatuses,
                    itemStatus,
                ])
            );
        }
    };

    useEffect(() => {
        const doASearch = async () => {
            const results = await searchForContent(searchValue, pageNum);
            setSearchResults(results);
        };

        if (searchValue.length > 2) {
            doASearch();
        } else {
            setSearchResults(null);
            setPageNum(1);
            setItemStatuses(null);
        }
    }, [searchValue, pageNum]);

    return (
        <div className="w-[400px]">
            <form className="grid" name="search for content">
                <label htmlFor="content-search">
                    Search for movies or shows...
                </label>
                <input
                    className="text-slate-900 bg-slate-300 ps-2 py-1"
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        getItemStatuses();
                    }}
                    type="text"
                    id="content-search"
                    name="content search"
                ></input>
            </form>
            {searchResults && (
                <div className="bg-slate-900">
                    <ul className="grid gap-4 overflow-y-scroll h-[300px] p-4">
                        {searchResults.map((r: any, index: number) => (
                            <li key={index} className="flex gap-2 items-center">
                                {r.profile_path || r.poster_path ?
                                    <Image
                                        className="overflow-y-clip"
                                        src={`https://image.tmdb.org/t/p/w200/${r.poster_path || r.profile_path}`}
                                        alt={`${r.profile_path ? 'Profile of' : 'Poster for'} ${r.name || r.title}`}
                                        width="50"
                                        height="75"
                                    />
                                :   <div className="w-[50px] h-[75px] bg-slate-900/80 text-slate-400 grid place-items-center text-center text-xs">
                                        no image
                                    </div>
                                }
                                <div className="flex justify-between w-full items-center">
                                    <p>{r.title || r.name}</p>
                                    <div className="flex flex-col items-end text-end gap-2">
                                        <button
                                            className="text-end"
                                            onClick={() => {
                                                AddToList(
                                                    props.at,
                                                    props.id,
                                                    r.media_type,
                                                    +r.id
                                                );
                                                router.refresh();
                                            }}
                                        >
                                            Add to List
                                        </button>
                                        <Link href={`/${r.media_type}/${r.id}`}>
                                            Visit Page
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <button onClick={LoadMore}>Load More</button>
                    </ul>
                </div>
            )}
        </div>
    );
}
