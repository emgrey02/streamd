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
    const [editMode, setEditMode] = useState<boolean>(false);
    const [listData, setListData] = useState<any>('');

    useEffect(() => {
        async function getThoseLists() {
            if (accountObjectId) {
                console.log('running use effect');
                let lists = await getLists(accountObjectId, 1);
                localStorage.setItem('dashcat', 'lists');
                setLists(lists);
                setMessage('Create some lists!');
                setListsUpdated(false);
                setEditMode(false);
                setListData('');
            }
        }
        getThoseLists();
    }, [accountObjectId, listsUpdated]);

    function updateLists() {
        console.log('updating list');
        setListsUpdated(true);
    }

    const deleteThisList = (id: string) => {
        if (accessToken) {
            deleteList(accessToken, id);
            updateLists();
        }
    };

    const editThisList = (
        id: string,
        name: string,
        desc: string,
        pub: boolean
    ) => {
        setEditMode(true);
        setListData({ id, name, desc, pub });
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
                                className="flex flex-col gap-1 border-2 border-slate-900 w-full py-2 px-4 hover:bg-slate-700"
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
                                    <div className="flex">
                                        <p className="italic font-light text-start max-w-[60ch]">
                                            {l.description}
                                        </p>
                                    </div>
                                </button>
                                <div className="flex justify-between items-end gap-4 z-20">
                                    <div className="flex gap-4 text-xs text-slate-400 text-end">
                                        <p>
                                            created {l.created_at.slice(0, 10)}
                                        </p>
                                        <p>
                                            updated {l.updated_at.slice(0, 10)}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                editThisList(
                                                    l.id,
                                                    l.name,
                                                    l.description,
                                                    l.public
                                                )
                                            }
                                        >
                                            <svg
                                                className="stroke-slate-400 hover:stroke-slate-300"
                                                width="30px"
                                                height="30px"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => deleteThisList(l.id)}
                                            className="text-end"
                                        >
                                            <svg
                                                className="stroke-slate-400 hover:stroke-slate-300"
                                                width="30px"
                                                height="30px"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                :   <div className="text-lg italic text-slate-400">
                        {message}
                    </div>
                }
            </div>
            <div>
                <NewListForm
                    at={accessToken || ''}
                    updateLists={updateLists}
                    edit={editMode}
                    data={listData}
                />
            </div>
        </div>
    );
}
