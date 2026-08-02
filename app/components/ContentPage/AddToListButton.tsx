'use client';

import { useEffect, useState } from 'react';
import {
    AddToList,
    deleteListItem,
    getItemStatus,
    getLists,
} from '../../actions';

type TmdbList = { id: string; name: string };
type ItemStatus = { id: string; isItemInList: boolean };

export default function AddToListButton(props: {
    accountObjectId: string;
    accessToken: string;
    mediaType: string;
    mediaId: number;
}) {
    const [lists, setLists] = useState<TmdbList[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [itemStatuses, setItemStatuses] = useState<ItemStatus[]>([]);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const getAllLists = async () => {
            const listOfLists = await getLists(props.accountObjectId, 1);
            setLists(listOfLists);
            return listOfLists;
        };

        const getStatuses = async () => {
            const lists = await getAllLists();

            if (lists && lists.length > 0) {
                const finalArray: ItemStatus[] = [];

                for (const list of lists) {
                    const stat = await getItemStatus(
                        props.accessToken,
                        list.id,
                        props.mediaType,
                        props.mediaId
                    );
                    const newStateObj = { id: list.id, isItemInList: stat };
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
        const newStateObj = { id: listId, isItemInList: isInList };
        const currentItemStatuses = [...itemStatuses];
        const index = itemStatuses.map((e: ItemStatus) => e.id).indexOf(listId);
        currentItemStatuses[index] = newStateObj;
        setItemStatuses(currentItemStatuses);
    };

    //console.log(itemStatuses);

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
                <ul className="bg-slate-600 absolute top-full w-full">
                    {lists.map((l: TmdbList, index: number) => (
                        <li
                            className={`p-2 ${!itemStatuses[index].isItemInList ? 'hover:bg-slate-900' : 'hover:none'} flex justify-between`}
                            key={index}
                        >
                            <p>{l.name}</p>
                            <div className="flex justify-between gap-2">
                                {itemStatuses[index].isItemInList ? (
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
                                        {statusLoading
                                            ? 'loading...'
                                            : 'Remove'}
                                    </button>
                                ) : (
                                    <button
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
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
