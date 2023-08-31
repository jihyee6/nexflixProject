const API_KEY = "528d889b7a423e2a234ba0429aef63c1";
const BASE_PATH = 'https://api.themoviedb.org/3/';

interface IMovie {
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    id: number;
}


export interface IGetMoviesResult{
    dates:{
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}
export interface ILatestMovieResult{
    id: number;
    backdrop_path: string;
    overview: string;
    poster_path: string;
    title: string;
}


export function getMovie(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

export function latestMovie(){
    return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}
export function topRatedMovie(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}
export function upComingMovie(){
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}