import Notiflix from 'notiflix';
import axios from 'axios';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.classList.add('hidden');

let currentPage = 1;
let totalHits;

function isFull() {
  if (currentPage * 40 >= totalHits) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  currentPage = 1;
  const input = document.querySelector('#search-form input');
  const fixedQueryString = input.value.split(' ').join('+');

  try {
    const images = await fetchImages(fixedQueryString);
    showTotalHits(images);
    renderImages(images);
    isFull();
  } catch (error) {
    Notiflix.Notify.failure(
      `We have problems with loading these pictures: ${error}`
    );
  }
});

loadMoreBtn.addEventListener('click', async () => {
  const input = document.querySelector('#search-form input');
  const fixedQueryString = input.value.split(' ').join('+');
  currentPage += 1;

  try {
    const images = await fetchImages(fixedQueryString);
    renderImages(images);
    isFull();
  } catch (error) {
    Notiflix.Notify.failure(
      `We have problems with loading these pictures: ${error}`
    );
  }
});

async function fetchImages(queryString) {
  return axios.get('https://pixabay.com/api/', {
    params: {
      key: '42529634-f4ee0a007b87bc585b0bc2cb3',
      q: queryString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: currentPage,
    },
  });
}

function showTotalHits(data) {
  totalHits = data.data.totalHits;
  Notiflix.Notify.success(`${totalHits} matching pictures were found`);
}

function renderImages(data) {
  const markupArray = data.data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) =>
      `<div class="photo-card">
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item"><b>Likes: ${likes}</b></p>
              <p class="info-item"><b>Views: ${views}</b></p>
              <p class="info-item"><b>Comments: ${comments}</b></p>
              <p class="info-item"><b>Downloads: ${downloads}</b></p>
            </div>
          </div>`
  );
  if (currentPage > 1) {
    gallery.insertAdjacentHTML('beforeend', markupArray.join(' '));
  } else {
    gallery.innerHTML = markupArray.join(' ');
  }
}
