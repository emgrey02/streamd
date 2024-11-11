'use server';

import AddNoteButton from '@/app/components/AddNoteButton';
import AddContentToList from '@/app/components/AddContentToList';
import BackButton from '@/app/components/BackButton';
import DeleteListItemButton from '@/app/components/DeleteListItemButton';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import Note from '@/app/components/Note';
import { getContentAccountInfo } from '@/app/actions';

export default async function ListPage({ params }: { params: { id: string } }) {
    const accessToken: string | undefined = cookies().get('accessToken')?.value;
    const sessionId: string | undefined = cookies().get('sessionId')?.value;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/4/list/${params.id}?language=en-US&page=1`,
        options
    );

    let list = await res.json();

    list.results.forEach(async (res: any) => {
        let accountInfo = await getContentAccountInfo(
            sessionId || '',
            res.media_type,
            res.id
        );
        console.log(accountInfo);
    });

    if (!res.ok) {
        console.error('failed to get list details by id');
    } else {
        console.log('successfully retrieved list details by id');
    }

    return (
        <div className="flex flex-col gap-4">
            <BackButton main={false} />
            <div className="flex flex-col-reverse gap-4 md:grid md:grid-cols-[auto,_400px]">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-3xl font-light">{list.name}</h2>
                        <p className="text-sm">
                            created by {list.created_by.username}
                        </p>
                        <p className="italic">{list.description}</p>
                    </div>
                    {list.results && (
                        <div className="@container">
                            <ul className="flex flex-col gap-4 ">
                                {list.results.map((c: any, index: number) => (
                                    <li
                                        key={index}
                                        className="flex flex-col items-start relative"
                                    >
                                        <Link
                                            className="flex gap-2 p-2 w-full hover:bg-slate-900 ring-slate-900 ring-2"
                                            href={`/${c.media_type}/${c.id}/`}
                                        >
                                            {c.poster_path ?
                                                <Image
                                                    className="overflow-y-clip"
                                                    src={`https://image.tmdb.org/t/p/w200/${c.poster_path}`}
                                                    alt={`Poster for ${c.name || c.title}`}
                                                    width="60"
                                                    height="90"
                                                />
                                            :   <div className="w-[50px] h-[75px] bg-slate-900/80 text-slate-400 grid place-items-center text-center text-xs">
                                                    no image
                                                </div>
                                            }
                                            <div>
                                                <p>{c.name || c.title}</p>
                                                <p>
                                                    {c.first_air_date ||
                                                        c.release_date}
                                                </p>
                                            </div>
                                        </Link>
                                        <DeleteListItemButton
                                            at={accessToken || ''}
                                            listId={params.id}
                                            mt={c.media_type}
                                            mi={+c.id}
                                        />
                                        <div className="flex justify-between w-full">
                                            <Note
                                                comments={list.comments}
                                                mt={c.media_type}
                                                mi={c.id}
                                            />
                                            <AddNoteButton
                                                at={accessToken || ''}
                                                listId={params.id}
                                                mt={c.media_type}
                                                mi={+c.id}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <AddContentToList at={accessToken || ''} id={params.id} />
                </div>
            </div>
        </div>
    );
}
