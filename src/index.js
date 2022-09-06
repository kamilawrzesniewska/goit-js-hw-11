import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';


const input = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryCard = document.querySelector(".country-info");

const DEBOUNCE_DELAY = 300;

function renderCountry(countries) {
  return countries.map(({ name, capital, population, flags, languages }) =>
`
  <ul>
  <img src="${flags.svg}" alt="flag of ${name.official}" width = 100px; height = 50px;>
  <span class="countryName"><b>${name.official}</b></span>
  <li><span><b>Capital:</b></span> <span>${capital}</span></li>
  <li><span><b>Population:</b></span> <span>${population}</span></li>
  <li><span><b>Languages:</b></span><span>${Object.values(languages)}</span></li></ul>
  `
  ).join('');
}


function onCountry(event) {
    const name = event.target.value.trim();
    
    if (!name) {
        countryCard.innerHTML = '';
        countryList.innerHTML = "";
    }

    fetchCountries(name).then(countries => {
        if (countries.length === 1) {
            countryList.innerHTML = "";
            countryCard.innerHTML = renderCountry(countries);
            
        }
        else if (countries.length >= 2 && countries.length <= 10) {
            countryCard.innerHTML = '';
            countryList.innerHTML =  renderList(countries);
        }
        else {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
    })
    .catch (() => Notiflix.Notify.failure('Oops, there is no country with that name'))   
}
    
function renderList(countries) {
    return countries.map(({ flags, name }) =>
    `<li>
      <img src="${flags.svg}" alt="flag of ${name.official}" width = 50px; height = 30px;>
        <span><b>${name.official}</b></span>
    </li>`)
    .join('');
}
  

input.addEventListener('input', debounce(onCountry, DEBOUNCE_DELAY));
