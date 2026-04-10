'use client';

import Link from 'next/link';

export default function DashboardLink() {
    return (
        <Link
            className="hover:bg-slate-900 bg-slate-700/40 ring-1 ring-gray-900 px-2 py-2 text-brand-blue transition"
            href={`/dashboard/${localStorage.getItem('dashCat') || 'favorites'}`}
        >
            dashboard
        </Link>
    );
}
