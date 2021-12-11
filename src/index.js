import './css/main.css';
import Axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    btn: document.querySelector('[type="submit"]'),
    div: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    photoCard: document.querySelector('.photo-card'),
};

const API_KEY = '24743165-5cd957bc5a8953f7a8bedce16';
const BASE_URL = 'https://pixabay.com/api/';
let query = '';
let page = 1;

const searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40, 
});

async function getInfo(url) {
  try {
      const response = await Axios.get(url);
      if (response.data.hits.length === 0 || query === '') {
        emptyArray();
        hideLoadMoreBtn();
        return;
      };
      
      renderCards(response.data.hits);
      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    hideLoadMoreBtn();
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  }
};



function emptyArray() {
    clearGallery();
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

function clearGallery() {
    refs.div.innerHTML = '';
};

function renderCards(cards) {
    
    const markup = cards.map(card => {
        
        return `
          <div class="photo-card">
            <a href="${card.largeImageURL}"><img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" /></a>
              <div class="info">
               <p class="info-item">
                 <b>Likes</b>
                 ${card.likes}
               </p>
               <p class="info-item">
                 <b>Views</b>
                 ${card.views}
               </p>
               <p class="info-item">
                 <b>Comments</b>
                 ${card.comments}
               </p>
               <p class="info-item">
                 <b>Downloads</b>
                 ${card.downloads}
               </p>
              </div>
          </div>
        `
        
    }).join("");

   
  refs.div.insertAdjacentHTML('beforeend', markup);
  
};

function onSearch(e) {
  e.preventDefault();
  clearGallery();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value;
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&${searchParams}&page=${page}`;

  getInfo(url);
  clearInput();
  showLoadMoreBtn();
};

function clearInput() {
  refs.input.value = '';
}

function onLoadMoreBtnClick() {
  page += 1;
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&${searchParams}&page=${page}`;

  getInfo(url);
};

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('visible')
};

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('visible')
};

function openOriginal(event) {
    const lightbox = new SimpleLightbox('.photo-card a', {captionType: 'attr', captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250});
    lightbox.refresh()
    event.preventDefault();
};

refs.div.addEventListener('click', openOriginal);
refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);