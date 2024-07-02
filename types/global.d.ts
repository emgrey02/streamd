export {};

declare global {
    interface Movie {
        adult: boolean;
        backdrop_path: string;
        genre_ids: number[];
        id: number;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string;
        release_date: string;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    }

    interface Show {
        adult: boolean;
        backdrop_path: string;
        genre_ids: number[];
        id: number;
        first_air_date: string;
        last_air_date: string;
        in_production: boolean;
        networks: object[];
        number_of_episodes: number;
        number_of_seasons: number;
        original_language: string;
        original_name: string;
        overview: string;
        popularity: number;
        poster_path: string;
        name: string;
    }
}
