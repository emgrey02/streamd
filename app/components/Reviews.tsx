import BackButton from './BackButton';
import Text from './Text';
import Image from 'next/image';

export default function Reviews(props: { reviews: any }) {
    const reviews = props.reviews;

    return (
        <div className="w-full">
            <h2 className="text-lg font-medium mb-8">Reviews</h2>
            <div className="grid max-w-3xl">
                {reviews.results.length > 0 ?
                    reviews.results.map((post: any, index: number) => (
                        <div key={index} className="grid gap-2 max-w-2xl ">
                            <div className="flex flex-col gap-2 text-end">
                                <div className="h-5 w-50 relative overflow-hidden bg-slate-900">
                                    <div
                                        className={`h-full bg-green-300/70 absolute`}
                                        style={{
                                            width: `${post.author_details.rating * 10}%`,
                                        }}
                                    ></div>
                                </div>
                                <p>
                                    Rating:{' '}
                                    {post.author_details.rating ?
                                        post.author_details.rating.toString() +
                                        '/10'
                                    :   'none'}
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                {post.author_details.avatar_path ?
                                    <div className="w-[40px] h-[40px] bg-slate-900 grid place-items-center">
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200/${post.author_details.avatar_path}`}
                                            alt={`${post.author}'s profile image`}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                :   <div className="w-[40px] h-[40px] bg-slate-900 text-center text-4xl font-thin text-slate-500">
                                        X
                                    </div>
                                }
                                <p className="font-light italic text-slate-300 text-lg">
                                    {post.author}:
                                </p>
                            </div>
                            <Text text={post.content} />
                            <div className="my-4">
                                <p className="text-sm text-slate-400 text-end">
                                    {new Date(
                                        post.created_at
                                    ).toLocaleDateString()}
                                </p>
                                <div className="w-full h-[1px] bg-slate-500 mb-10"></div>
                            </div>
                        </div>
                    ))
                :   <p className="font-light">There are no reviews!</p>}
            </div>
        </div>
    );
}
