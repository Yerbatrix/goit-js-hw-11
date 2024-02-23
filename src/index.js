import axios from 'axios';

const queryString = 'flowers yellow';
const fixedQuerryString = queryString.split(' ').join('+');

const response = axios
  .get('https://pixabay.com/api/', {
    params: {
      key: '42529634-f4ee0a007b87bc585b0bc2cb3',
      q: fixedQuerryString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  })
  .then(response => console.log(response));
