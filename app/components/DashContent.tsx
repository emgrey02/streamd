'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Lists from './Lists';
import DashNav from './DashNav';
import { getFavorWatchRated } from '../actions';
import FavWatchRatedContent from './FavWatchRatedContent';

type Props = {
    accountId?: string;
    sessionId?: string;
    accessToken?: string;
    accountObjectId?: string;
};

export default function DashContent({
    accessToken,
    accountObjectId,
    sessionId,
    accountId,
}: Props) {
    const [category, setCategory] = useState<string>(
        localStorage.getItem('dashCat') || 'favorite'
    );

    return (
        <div className="flex flex-col gap-4">
            <DashNav cat={category || ''} setCat={setCategory} />
            {category !== 'lists' ?
                <FavWatchRatedContent
                    category={category}
                    sessionId={sessionId || ''}
                    accountId={accountId || ''}
                />
            :   <Lists
                    accessToken={accessToken}
                    accountObjectId={accountObjectId}
                />
            }
        </div>
    );
}
