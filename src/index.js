import './css/styles.css';
import axios from 'axios'
import Notiflix from 'notiflix';

const form = document.querySelector(`.search-form`);
const input = document.querySelector(`input`);
const button = document.querySelector(`button`);
const gallery = document.querySelector(`.gallery`);
const nextItems = document.querySelector(`.load-more`);
    

const API_KEY = '29713049-07e20095513e7d10800a19bda';
const baseURL = 'https://pixabay.com/api/';
const perPage = 40;
let currentPage = 1;

const fetchPhoto = async (searchQuery, page) => {
  const response = await axios.get(`${baseURL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
  return response.data;
};


form.addEventListener('submit', searchImage);
nextItems.addEventListener('click', morePages);

nextItems.classList.add('ishidden');


function searchImage(event) {    
  event.preventDefault();
const searchName = event.currentTarget.elements.searchQuery.value.trim();
if (searchName === "" ) {
  return;
} else {
clearGalleryList();
currentPage = 1;
renderImg (searchName, currentPage); 
  };
event.currentTarget.elements.searchQuery.value = ""
};


function morePages() {
  currentPage += 1;
  const searchName = input.value.trim();
  renderImg (searchName, currentPage); 
}

async function renderImg (searchQuery, currentPage) {
  try {
    const fetchResult = await fetchPhoto(searchQuery, currentPage);  
    if (fetchResult.totalHits > 1 && currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${fetchResult.totalHits} images.`);
      nextItems.classList.add('ishidden');
    };
    filterResult(fetchResult);
  } catch (error) {
    console.log(error)
  };
};

function filterResult(fetchResult) {
  if (currentPage === Math.ceil(fetchResult.totalHits / 40)) {
      insertMarkup(fetchResult.hits);  
    Notiflix.Notify.success("We're sorry, but you've reached the end of search results.");
    nextItems.classList.add('ishidden');
      return;
  } else if (fetchResult.total === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    nextItems.classList.add('ishidden');
      return;
  } else { 
      insertMarkup(fetchResult.hits);  
      nextItems.classList.remove('ishidden');
      return;
  };
};


function  renderImages (images) {
  return `
        <div class="photo-card">
            <img src="${images.webformatURL}" alt="${images.tags}" loading="lazy" width="220px" height="150px"/>
             <div class="info">
                 <p class="info-item">
                 <b>Likes:</b> <br>${images.likes}
                 </p>
                 <p class="info-item">
                 <b>Views:</b> <br>${images.views}
                 </p>
                 <p class="info-item">
                 <b>Comments:</b> <br>${images.comments}
                 </p>
                 <p class="info-item">
                 <b>Downloads:</b> <br>${images.downloads}
                 </p>
             </div>
         </div>
`};
function insertMarkup(arrayImages) {
    const result = newList(arrayImages);
   
    gallery.insertAdjacentHTML('beforeend', result);
  
  };
  
  function newList (arrayImages) {
    return arrayImages.reduce((acc, item) => acc + renderImages(item), "");
  };


  function clearGalleryList () {
    gallery.innerHTML = "";
};


window.addEventListener('scroll',
  debounce (async () => {
    try {
      if (window.innerHeight === document.documentElement.scrollHeight) {
        return;
      }
      if (window.scrollY + 0.5 + window.innerHeight >= document.documentElement.scrollHeight) {

        page += 1;
        let trimInput = localStorage.getItem('inputValue');
        const varPhotos = await fetchImages(trimInput, page);
        const photosArr = varPhotos.hits;

        renderImages(photosArr);
        lightbox.refresh();

        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();
        
        window.scrollBy({
          top: cardHeight * 1.5,
          behavior: 'smooth',
        });

      }
    } catch (error) {}
  }, 200)
);