'use client';

import { useEffect, useState } from 'react';
import { AddToList, deleteListItem, getItemStatus, getLists } from '../actions';

export default function AddToListButton(props: {
    accountObjectId: string;
    accessToken: string;
    mediaType: string;
    mediaId: number;
}) {
    const [lists, setLists] = useState<any>();
    const [showOptions, setShowOptions] = useState(false);
    const [itemStatuses, setItemStatuses] = useState<any>([]);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const getAllLists = async () => {
            let listOfLists = await getLists(props.accountObjectId, 1);
            setLists(listOfLists);
            return listOfLists;
        };

        const getStatuses = async () => {
            let lists = await getAllLists();

            if (lists && lists.length > 0) {
                let finalArray: any = [];

                for (const list of lists) {
                    let stat = await getItemStatus(
                        props.accessToken,
                        list.id,
                        props.mediaType,
                        props.mediaId
                    );
                    let newStateObj = { id: list.id, isItemInList: stat };
                    finalArray.push(newStateObj);
                }

                setItemStatuses(finalArray);
            }
        };

        getStatuses();
    }, [
        props.accountObjectId,
        props.accessToken,
        props.mediaType,
        props.mediaId,
    ]);

    const updateItemStatus = (listId: string, isInList: boolean) => {
        let newStateObj = { id: listId, isItemInList: isInList };
        let currentItemStatuses = [...itemStatuses];
        let index = itemStatuses.map((e: any) => e.id).indexOf(listId);
        currentItemStatuses[index] = newStateObj;
        setItemStatuses(currentItemStatuses);
    };

    console.log(itemStatuses);

    return (
        <div className="flex flex-col items-start bg-slate-700 relative w-full">
            <button
                className="p-2 w-full text-start"
                onClick={() => {
                    setShowOptions(!showOptions);
                }}
            >
                {showOptions ? 'Close' : 'Add to List'}
            </button>
            {showOptions && itemStatuses.length > 0 && (
                <ul className="bg-slate-600 absolute top-[100%] w-full">
                    {lists.map((l: any, index: number) => (
                        <li
                            className={`p-2 ${!itemStatuses[index].isItemInList ? 'hover:bg-slate-900' : 'hover:none'} flex justify-between`}
                            key={index}
                        >
                            <p>{l.name}</p>
                            <div className="flex justify-between gap-2">
                                {itemStatuses[index].isItemInList ?
                                    <button
                                        onClick={() => {
                                            setStatusLoading(true);

                                            deleteListItem(
                                                props.accessToken,
                                                l.id,
                                                props.mediaType,
                                                props.mediaId
                                            ).then((res) => {
                                                if (res.success) {
                                                    updateItemStatus(
                                                        l.id,
                                                        false
                                                    );
                                                }
                                                setStatusLoading(false);
                                            });
                                        }}
                                        className={`w-full text-start cursor-pointer'}`}
                                    >
                                        {statusLoading ?
                                            'loading...'
                                        :   'Remove'}
                                    </button>
                                :   <button
                                        onClick={() => {
                                            setStatusLoading(true);

                                            AddToList(
                                                props.accessToken,
                                                l.id,
                                                props.mediaType,
                                                props.mediaId
                                            ).then((res) => {
                                                if (res.success) {
                                                    updateItemStatus(
                                                        l.id,
                                                        true
                                                    );
                                                }
                                                setStatusLoading(false);
                                            });
                                        }}
                                        className={`w-full text-start cursor-pointer'}`}
                                    >
                                        {statusLoading ? 'loading...' : `Add`}
                                    </button>
                                }
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
