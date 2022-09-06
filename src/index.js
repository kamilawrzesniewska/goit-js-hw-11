import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import axios from 'axios'

const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGES = 40;
const API_KEY = '29713049-07e20095513e7d10800a19bda';


const refs = {
    form: document.querySelector(`.search-form`),
    input: document.querySelector(`input`),
    button: document.querySelector(`button`),
    gallery: document.querySelector(`.gallery`),
    loadMore: document.querySelector(`.load-more`)
};


const fetchPictures = async (searchQuery, page) => {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGES}&page=${page}`);
  return response.data;
};


refs.form.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMoreBtn);


let currentPage = 1;
refs.loadMore.classList.add('ishidden');


function onFormSubmit(e) {    
  e.preventDefault();
const searchName = e.currentTarget.elements.searchQuery.value.trim();
if (searchName === "" ) {
  return;
} else {
clearGalleryList();
currentPage = 1;
fetchRequest (searchName, currentPage); 
  };
e.currentTarget.elements.searchQuery.value = ""
};


function onLoadMoreBtn() {
  currentPage += 1;
  const searchName = refs.input.value.trim();
  fetchRequest(searchName, currentPage); 
}

async function fetchRequest (searchQuery, currentPage) {
  try {
    const fetchResult = await fetchPictures(searchQuery, currentPage);  
    if (fetchResult.totalHits > 1 && currentPage === 1) {
      Notiflix.Notify.info(`Hooray! We found ${fetchResult.totalHits} images.`);
      refs.loadMore.classList.add('ishidden');
    };
    filterFetchResult(fetchResult);
  } catch (error) {
    console.log(error)
  };
};

function filterFetchResult(fetchResult) {
  if (currentPage === Math.ceil(fetchResult.totalHits / 40)) {
      insertMarkup(fetchResult.hits);  
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMore.classList.add('ishidden');
      return;
  } else if (fetchResult.total === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    refs.loadMore.classList.add('ishidden');
      return;
  } else { 
      insertMarkup(fetchResult.hits);  
      refs.loadMore.classList.remove('ishidden');
      return;
  };
};

function insertMarkup(arrayImages) {
  const result = createList(arrayImages);
 
  refs.gallery.insertAdjacentHTML('beforeend', result);

};

function createList (arrayImages) {
  return arrayImages.reduce((acc, item) => acc + createMarkup(item), "");
};

function  createMarkup (img) {
  return `
        <div class="photo-card">
            <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" width="220px" height="150px"/>
             <div class="info">
                 <p class="info-item">
                 <b>Likes:</b> <br>${img.likes}
                 </p>
                 <p class="info-item">
                 <b>Views:</b> <br>${img.views}
                 </p>
                 <p class="info-item">
                 <b>Comments:</b> <br>${img.comments}
                 </p>
                 <p class="info-item">
                 <b>Downloads:</b> <br>${img.downloads}
                 </p>
             </div>
         </div>
`};


  function clearGalleryList () {
    refs.gallery.innerHTML = "";
};
