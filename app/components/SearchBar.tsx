'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SearchBar() {
    const [search, setSearch] = useState('');

    function editQuery(event: React.ChangeEvent<HTMLInputElement>) {
        let search = event.target.value;
        console.log(search);
        setSearch(search);
    }

    return (
        <div className="w-full m-8 my-20">
            <form
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
                        placeholder="Search for movies, tv, people..."
                    ></input>
                </div>
                <Link
                    className="w-16 h-8 grid place-items-center px-4 bg-slate-600"
                    href={`/search/multi?query=${search}&page=1`}
                >
                    Search
                </Link>
            </form>
        </div>
    );
}
