import Notiflix from 'notiflix';
import axios from 'axios';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

function handleError(error) {
  Notiflix.Notify.failure(`Wystąpił błąd: ${error}`);
  errorElement.classList.remove('hidden');
  loader.classList.add('hidden');
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const queryString = event.target.searchQuery.value;
  fetchImages(queryString)
    .then(({ data }) => {
      const markupArray = data.hits.flatMap(
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
      gallery.innerHTML = markupArray.join(' ');
    })
    .catch(error => {
      handleError(error);
    });
});

function fetchImages(queryString) {
  const fixedQueryString = queryString.split(' ').join('+');

  return axios.get('https://pixabay.com/api/', {
    params: {
      key: '42529634-f4ee0a007b87bc585b0bc2cb3',
      q: fixedQueryString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
}
