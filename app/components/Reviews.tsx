import BackButton from './BackButton';
import Text from './Text';

export default function Reviews(props: { reviews: any }) {
    const reviews = props.reviews;

    return (
        <div className="w-full">
            <h2 className="text-lg font-medium mb-2">Reviews</h2>
            <div className="grid max-w-3xl">
                {reviews.results.length > 0 ?
                    reviews.results.map((post: any, index: number) => (
                        <div key={index} className="grid gap-4 max-w-2xl">
                            <p>
                                Written by{' '}
                                <span className="font-bold">{post.author}</span>{' '}
                                on{' '}
                                {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            <div className="flex flex-col gap-2">
                                <p>
                                    Rating:{' '}
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
                            <Text text={post.content} />
                            <div className="w-full h-[1px] bg-slate-500 my-10"></div>
                        </div>
                    ))
                :   <p className="font-light">There are no reviews!</p>}
            </div>
        </div>
    );
}
