'use server';

import BackButton from '@/app/components/BackButton';
import { cookies } from 'next/headers';

export default async function ListPage({ params }: { params: { id: string } }) {
    const accessToken: string | undefined = cookies().get('accessToken')?.value;

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

    if (!res.ok) {
        console.error('failed to get list details by id');
    } else {
        console.log('successfully retrieved list details by id');
    }

    console.log(list);

    return (
        <div>
            <BackButton main={false} />
            <h2 className="text-2xl font-light">{list.name}</h2>
            <p className="text-sm">created by {list.created_by.username}</p>
            <p className="italic">{list.description}</p>
        </div>
    );
}
