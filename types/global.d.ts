export {};

declare global {
    type MovieItem = {
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
    };

    type ShowItem = {
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
    };

    type ContentItem = {
        id: number;
        media_type?: string;
        poster_path?: string;
        profile_path?: string;
        name?: string;
        title?: string;
    };

    type CastCrewItem = {
        id: number;
        gender?: number;
        known_for_department?: string;
        name?: string;
        profile_path?: string;
        cast_id?: number;
        character?: string;
        credit_id?: string;
        department?: string;
        job?: string;
    };
}
