import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

import './css/styles.css';
import { photoRequest } from './js/request';
import { markingGallery } from './js/markup-creation';

let lightbox = new SimpleLightbox(".gallery a");
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
    page = 1;
    
    ref.buttonPage.classList.add('button-hidden')

    markupСreation().finally(() => {
        Notiflix.Notify.success(`Hooray!Are available to you ${numberPhotos} photos`);  
        searchQuery.value = '';
    })
    ref.gallery.innerHTML = '';  
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
    ref.gallery.insertAdjacentHTML('beforeend', markingGallery(photoArray));
    
    lightbox.refresh()

    if(response.data.total >= 40) {
        ref.buttonPage.classList.remove('button-hidden')
    };
}

ref.buttonPage.addEventListener('click', () => {
    let totalNumber = Math.ceil(numberPhotos / perPage);

    page += 1;
    if (page > totalNumber) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        ref.buttonPage.classList.add('button-hidden');
        return;
    }
    markupСreation();
})
