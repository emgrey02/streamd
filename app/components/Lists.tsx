'use client';

import { useEffect, useState } from 'react';
import { deleteList, getLists } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NewListForm from './NewListForm';

type Props = {
    sessionId?: string;
    accessToken?: string;
    accountId?: string;
    accountObjectId?: string;
};

export default function Lists({ accessToken, accountObjectId }: Props) {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [lists, setLists] = useState<any>([]);
    const [listsUpdated, setListsUpdated] = useState<boolean>(false);

    console.log(lists);

    useEffect(() => {
        async function getThoseLists() {
            if (accountObjectId) {
                console.log('running use effect');
                let lists = await getLists(accountObjectId, 1);
                localStorage.setItem('dashcat', 'lists');
                setLists(lists);
                setMessage('Create some lists!');
                setListsUpdated(false);
            }
        }
        getThoseLists();
    }, [accountObjectId, listsUpdated]);

    function updateLists() {
        console.log('updating list');
        setListsUpdated(true);
    }

    const deleteThisList = (id: string) => {
        console.log(id);
        if (accessToken) {
            deleteList(accessToken, id);
            updateLists();
        }
    };

    return (
        <div className="flex flex-col-reverse md:grid md:grid-cols-[auto,_300px] gap-4 items-start">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl">Your Lists</h2>
                {lists && lists.length > 0 ?
                    <ul className="flex flex-col gap-4">
                        {lists.map((l: any, index: number) => (
                            <li
                                key={index}
                                className="flex flex-col gap-1 border-2 border-slate-900 w-full py-2 px-4"
                            >
                                <button
                                    onClick={() =>
                                        router.push(`/dashboard/list/${l.id}`)
                                    }
                                    className="flex flex-col items-stretch gap-2"
                                >
                                    <div className="flex gap-2">
                                        {l.backdrop_path ?
                                            <Image
                                                className="overflow-y-clip"
                                                src={`https://image.tmdb.org/t/p/w200/${l.backdrop_path}`}
                                                alt={`backdrop for list: ${l.name}`}
                                                width="100"
                                                height="60"
                                            />
                                        :   <div className="w-[100px] h-[60px] text-xs grid place-items-center bg-slate-700">
                                                image unavailable
                                            </div>
                                        }
                                        <div className="flex justify-between w-full">
                                            <h3 className="text-2xl text-brand-blue">
                                                {l.name}
                                            </h3>
                                            <div>
                                                <p className="text-sm text-end font-light">
                                                    {l.public == 1 ?
                                                        'public'
                                                    :   'private'}
                                                </p>
                                                <p className="text-slate-400">
                                                    {l.number_of_items} item(s)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="italic font-light text-start max-w-[60ch]">
                                            {l.description}
                                        </p>
                                        <div className="flex gap-4 text-xs text-slate-400 text-end">
                                            <p>
                                                created{' '}
                                                {l.created_at.slice(0, 10)}
                                            </p>
                                            <p>
                                                updated{' '}
                                                {l.updated_at.slice(0, 10)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteThisList(l.id)}
                                        className="text-end"
                                    >
                                        delete
                                    </button>
                                </button>
                            </li>
                        ))}
                    </ul>
                :   <div className="text-lg italic text-slate-400">
                        {message}
                    </div>
                }
            </div>
            <div>
                <NewListForm at={accessToken || ''} updateLists={updateLists} />
            </div>
        </div>
    );
}
