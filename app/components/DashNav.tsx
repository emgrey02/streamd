'use client';

export default function DashNav(props: { cat: string; setCat: any }) {
    const setTheCategory = (cat: string) => {
        props.setCat(cat);
        localStorage.setItem('dashCat', cat);
    };

    return (
        <ul className="w-full sm:w-[500px] grid grid-cols-4 items-start place-items-stretch mb-4 ring-1 ring-slate-900">
            <li>
                <button
                    className={`${props.cat === 'favorite' && 'bg-slate-900 border-brand-blue'} ps-2  hover:bg-slate-600 w-full py-2 text-start border-s-2 border-slate-600 text-sm sm:text-base`}
                    onClick={() => setTheCategory('favorite')}
                >
                    favorites
                </button>
            </li>
            <li>
                <button
                    className={`${props.cat === 'watchlist' && 'bg-slate-900 border-brand-blue'} ps-2 hover:bg-slate-600 w-full py-2 text-start border-s-2 border-slate-600 text-sm sm:text-base`}
                    onClick={() => setTheCategory('watchlist')}
                >
                    watchlist
                </button>
            </li>
            <li>
                <button
                    className={`${props.cat === 'rated' && 'bg-slate-900 border-brand-blue'} ps-2  hover:bg-slate-600 w-full py-2 text-start border-s-2 border-slate-600 text-sm sm:text-base`}
                    onClick={() => setTheCategory('rated')}
                >
                    rated
                </button>
            </li>
            <li>
                <button
                    className={`${props.cat === 'lists' && 'bg-slate-900 border-brand-blue'} ps-2 hover:bg-slate-600 w-full py-2 text-start border-s-2 border-slate-600 text-sm sm:text-base`}
                    onClick={() => setTheCategory('lists')}
                >
                    your lists
                </button>
            </li>
        </ul>
    );
}
