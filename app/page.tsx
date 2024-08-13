import ContentList from './components/ContentList';
import { cookies } from 'next/headers';
import SearchBar from './components/SearchBar';

export default async function Home() {
    const sessionId = cookies().get('sessionId')?.value;
    const username = cookies().get('username')?.value;

    let movieCats: string[] = [
        'now_playing',
        'popular',
        'top_rated',
        'upcoming',
    ];

    let showCats: string[] = [
        'airing_today',
        'on_the_air',
        'popular',
        'top_rated',
    ];

    let trendingCats: string[] = ['all', 'movie', 'tv', 'people'];

    return (
        <main className="min-h-screen py-4">
            {!sessionId && (
                <div className="px-4 flex flex-col items-start my-8">
                    <p>Hello, {username}!</p>
                </div>
            )}
            <div className="">
                <SearchBar />
            </div>
            <ContentList content="trending" cat={trendingCats} />
            <ContentList content="movie" cat={movieCats} />
            <ContentList content="tv" cat={showCats} />
        </main>
    );
}
