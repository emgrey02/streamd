'use client';

import { capitalizeCategory } from '../../utils';

/**
 * A navigation bar with the category options based on the content shown
 *
 */

interface ContentListNavProps {
    /** the current selected category */
    currentCategory: string;
    /** the category options for this content */
    categoryOptions: string[];
    /** a callback for the onClick event when a category is clicked */
    setContent: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export default function ContentListNav({
    currentCategory,
    categoryOptions,
    setContent,
}: ContentListNavProps) {
    return (
        <ul
            className={`grid grid-cols-4 max-w-150 items-center ring-1 ring-gray-900 bg-slate-700/40`}
        >
            {categoryOptions.map((c: string, index: number) => (
                <li
                    key={index}
                    className={`h-full ${c === currentCategory && 'bg-slate-900'} border-s-2 ${c === currentCategory ? 'border-slate-400' : 'border-slate-600'} transition-all `}
                >
                    <button
                        className={`grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue`}
                        data-cat={c}
                        onClick={setContent}
                    >
                        {capitalizeCategory(c)}
                    </button>
                </li>
            ))}
        </ul>
    );
}
