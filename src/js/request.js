import axios from 'axios'
const API_KEY = '30100202-c7ab2410f29d8d653d9b1941b';
const HTTPS = 'https://pixabay.com/api/';
async function photoRequest(name, page, perPage) {
    let response = await axios.get(`${HTTPS}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    console.log(response)
    return response;

};


export {photoRequest}