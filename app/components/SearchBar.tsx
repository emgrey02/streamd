'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar(props: { searchTerm?: string }) {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const router = useRouter();

    function editQuery(event: React.ChangeEvent<HTMLInputElement>) {
        const search = event.target.value;
        setSearch(search);
    }

    return (
        <div className="max-w-125">
            <form
                onSubmit={() => {
                    router.push(`/search/multi?query=${search}&page=1`);
                }}
                aria-label="search bar"
                name="search"
                className="flex items-end justify-center w-full gap-2"
            >
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="search">
                        Search for movies, shows, people...
                    </label>
                    <input
                        id="search"
                        onChange={editQuery}
                        className="h-8 bg-slate-400 px-2 text-slate-800"
                        type="text"
                        defaultValue={
                            props.searchTerm ||
                            searchParams.get('query')?.toString()
                        }
                    ></input>
                </div>
                <button
                    className="h-8 grid place-items-center px-4 bg-slate-600 hover:bg-slate-600/60"
                    type="submit"
                >
                    Search
                </button>
            </form>
        </div>
    );
}
