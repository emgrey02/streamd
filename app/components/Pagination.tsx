import Link from 'next/link';

export default function Pagination(props: {
    page: number;
    totalPages: number;
    cat: string;
    query?: string;
    content?: string;
    search: boolean;
}) {
    const page = props.page;

    return (
        <div className="flex justify-center my-4">
            <div className="w-full h-full grid grid-cols-2 gap-8 w-[300px]">
                <div className="grid items-center">
                    {+page > 1 && (
                        <Link
                            className="bg-slate-700 hover:bg-slate-700/60 h-full w-[125px] flex gap-2 justify-start items-center ps-2 py-1"
                            href={
                                props.search ?
                                    `/search/${props.cat}?query=${props.query}&page=${page - 1}`
                                :   `/${props.content}/${props.cat}/${+page - 1}`
                            }
                        >
                            <p className="text-3xl font-bold mb-1">&#171;</p>
                            <p className="">Previous</p>
                        </Link>
                    )}
                </div>
                <div className="grid items-center justify-end h-full">
                    {+page < +props.totalPages && (
                        <Link
                            className="bg-slate-700 hover:bg-slate-700/60 h-full w-[125px] flex gap-2 justify-end items-center pe-2 py-1"
                            href={
                                props.search ?
                                    `/search/${props.cat}?query=${props.query}&page=${props.page + 1}`
                                :   `/${props.content}/${props.cat}/${+page + 1}`
                            }
                        >
                            Next{' '}
                            <p className="text-3xl font-bold mb-1">&#187;</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
