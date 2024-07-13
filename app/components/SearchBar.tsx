'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar(props: { searchTerm?: string }) {
    const [search, setSearch] = useState('');
    const router = useRouter();

    function editQuery(event: React.ChangeEvent<HTMLInputElement>) {
        let search = event.target.value;
        setSearch(search);
    }

    return (
        <div className="max-w-[500px] my-10 px-2 md:px-8">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    router.push(`/search/multi?query=${search}&page=1`);
                }}
                name="search"
                className="flex items-end justify-center w-full gap-2"
            >
                <div className="w-80 flex flex-col gap-2">
                    <label htmlFor="search">
                        Search for movies, tv, people...
                    </label>
                    <input
                        id="search"
                        onChange={editQuery}
                        className="h-8 bg-slate-400 px-2 text-slate-800"
                        type="text"
                        defaultValue={props.searchTerm || ''}
                    ></input>
                </div>
                <button
                    className="w-16 h-8 grid place-items-center px-4 bg-slate-600 hover:bg-slate-600/60"
                    type="submit"
                >
                    Search
                </button>
            </form>
        </div>
    );
}
