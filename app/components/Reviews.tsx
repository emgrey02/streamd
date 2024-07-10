import BackButton from './BackButton';

export default function Reviews(props: { reviews: any }) {
    const reviews = props.reviews;

    return (
        <div className="w-full">
            <BackButton />
            <h2 className="text-xl font-bold my-8">Reviews</h2>
            <ul className="grid max-w-3xl">
                {reviews.results.length > 0 ?
                    reviews.results.map((post: any, index: number) => (
                        <li key={index} className="grid gap-4">
                            <p>
                                user:{' '}
                                <span className="font-bold">{post.author}</span>
                            </p>
                            <div className="flex flex-col gap-2">
                                <p>
                                    rating:{' '}
                                    {post.author_details.rating ?
                                        post.author_details.rating.toString() +
                                        '/10'
                                    :   'none'}
                                </p>
                                <div className="h-3 w-50 relative overflow-hidden bg-slate-900">
                                    <div
                                        className={`h-full bg-green-300/70 absolute`}
                                        style={{
                                            width: `${post.author_details.rating * 10}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <p className="w-full leading-relaxed">
                                {post.content}
                            </p>
                            <div className="w-full h-[1px] bg-slate-500 my-10"></div>
                        </li>
                    ))
                :   <>
                        <p>There are no reviews!</p>
                    </>
                }
            </ul>
            <BackButton />
        </div>
    );
}
