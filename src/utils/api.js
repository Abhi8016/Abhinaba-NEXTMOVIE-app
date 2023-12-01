import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3"
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN

const headers = {
    Authorization: "bearer " + TMDB_TOKEN, // space is important
}

export const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get(BASE_URL + url, {
            headers,
            params
        })
        return data
    } catch (err) {
        console.log(err);
        return err;
    }
}
document.addEventListener('contextmenu', event => {
    event.preventDefault();
});