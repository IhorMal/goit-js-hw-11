import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import './css/styles.css';
import { photoRequest } from './js/request';
import { markupCreation } from './js/markup-creation';
import "simplelightbox/dist/simple-lightbox.min.css";

let page = 1;
let name = null;
const perPage = 40;
let numberPhotos = 0;

const ref = {
    forms: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    buttonPage: document.querySelector('.load-more')   
}

ref.forms.addEventListener('submit', onSearchNames);

function onSearchNames(e) {
    e.preventDefault()
    const { searchQuery } = e.currentTarget.elements;
    name = searchQuery.value;

    markupСreation().finally( () => searchQuery.value = '')
    ref.gallery.innerHTML = '';
    page = 1;    
}

async function markupСreation() {
    let response = await photoRequest(name, page, perPage);

    const photoArray = response.data;

    if (photoArray.hits.length === 0) {        
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        ref.buttonPage.classList.add('button-hidden')
        return;
    };
    numberPhotos = photoArray.totalHits;
    
    Notiflix.Notify.success(`Hooray!Are available to you ${numberPhotos} photos`);
    
    ref.gallery.insertAdjacentHTML('beforeend', markupCreation(photoArray));
    const lightbox = new SimpleLightbox(".gallery a");

    if(response.data.total >= 40) {
        ref.buttonPage.classList.remove('button-hidden')
    };
}

ref.buttonPage.addEventListener('click', (e) => {
    let totalNumber = perPage * page;
    
    if (totalNumber >= numberPhotos) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return
    }

    page += 1;
    markupСreation(name, page, perPage);
})
