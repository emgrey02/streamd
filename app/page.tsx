import ContentList from './components/ContentList';
import SearchBar from './components/SearchBar';

export default async function Home() {
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
        <main className="min-h-screen px-2 sm:px-4 flex flex-col gap-10 pb-10">
            <SearchBar />
            <ContentList content="trending" cat={trendingCats} />
            <ContentList content="movie" cat={movieCats} />
            <ContentList content="tv" cat={showCats} />
        </main>
    );
}
