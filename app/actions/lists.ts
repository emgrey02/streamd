'use server';
import { revalidatePath } from 'next/cache';
import { fetchTmdb } from '../lib/tmdb';

//list utilities
export async function getLists(accountObjectId: string, pageNum: number) {
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-cache',
    };

    const lists = await fetchTmdb(
        `https://api.themoviedb.org/4/account/${accountObjectId}/lists?page=${pageNum}`,
        options,
        'fetch lists'
    );

    return lists.results;
}

export async function createList(at: string, formData: FormData) {
    const rawFormData = {
        name: formData.get('list name'),
        description: formData.get('list description'),
        public: formData.get('public toggle'),
    };

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            description: rawFormData.description,
            name: rawFormData.name,
            iso_3166_1: 'US',
            iso_639_1: 'en',
            public: !rawFormData.public ? 'false' : 'true',
        }),
    };

    const res = await fetch('https://api.themoviedb.org/4/list', options);
    const resJson = await res.json();

    if (!res.ok) {
        console.error('failed to create list', resJson);
    }

    revalidatePath('/dashboard', 'page');
}

export async function updateList(at: string, id: string, formData: FormData) {
    const rawFormData = {
        name: formData.get('list name'),
        description: formData.get('list description'),
        public: formData.get('public toggle'),
    };

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            description: rawFormData.description,
            name: rawFormData.name,
            public: !rawFormData.public ? false : true,
            sort_by: 'original_order.asc',
        }),
    };

    const res = await fetch(`https://api.themoviedb.org/4/list/${id}`, options);
    const resJson = await res.json();

    if (!res.ok) {
        console.error('failed to update list', resJson);
    }

    revalidatePath('/dashboard', 'page');
}

export async function deleteList(at: string, listId: string) {
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${at}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}`,
        options
    );
    const resJson = await res.json();

    if (!res.ok) {
        console.error('failed to delete list', resJson);
    }

    revalidatePath('/dashboard', 'page');
}

export async function AddToList(
    at: string,
    listId: string,
    mt: string,
    mi: number
) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            items: [{ media_type: mt, media_id: mi }],
        }),
    };

    const res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/items`,
        options
    );
    const resJson = await res.json();

    if (!res.ok) {
        console.error('failed to add item to list', resJson);
    }

    revalidatePath('/dashboard/list/[id]', 'page');

    return resJson;
}

export async function deleteListItem(
    at: string,
    listId: string,
    mt: string,
    mi: number
) {
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            items: [{ media_type: mt, media_id: mi }],
        }),
    };

    const res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/items`,
        options
    );
    const resJson = await res.json();

    if (!res.ok) {
        console.error('failed to delete item from list', resJson);
    }

    revalidatePath('/dashboard/list/[id]', 'page');

    return resJson;
}

export async function addNote(
    at: string,
    listId: string,
    mt: string,
    mi: number,
    formData: FormData
) {
    const rawFormData = {
        note: formData.get('note'),
    };

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            items: [
                { media_type: mt, media_id: mi, comment: rawFormData.note },
            ],
        }),
    };

    const res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/items`,
        options
    );
    const resJson = await res.json();

    if (!res.ok) {
        console.error('failed to add note', resJson);
    }

    revalidatePath('/dashboard/list/[id]', 'page');
}

export async function getItemStatus(
    at: string,
    listId: string,
    mt: string,
    mi: number
) {
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${at}`,
        },
        cache: 'no-cache',
    };

    const res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/item_status?media_id=${mi}&media_type=${mt}`,
        options
    );

    const status = await res.json();

    return Boolean(status.success);
}
