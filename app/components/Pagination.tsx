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
        <>
            <div className="flex justify-center">
                <div className="grid grid-cols-2 px-4 py-8 max-w-[300px]">
                    {+page > 1 && (
                        <Link
                            className="col-start-1"
                            href={
                                props.search ?
                                    `/search/${props.cat}?query=${props.query}&page=${page - 1}`
                                :   `/${props.content}/${props.cat}/${+page - 1}`
                            }
                        >
                            Previous
                        </Link>
                    )}
                    {+page < +props.totalPages && (
                        <Link
                            className="col-start-2 justify-self-end"
                            href={
                                props.search ?
                                    `/search/${props.cat}?query=${props.query}&page=${props.page + 1}`
                                :   `/${props.content}/${props.cat}/${+page + 1}`
                            }
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
