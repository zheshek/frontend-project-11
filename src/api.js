import axios from 'axios';

const proxyUrl = 'https://allorigins.hexlet.app/get';

export const fetchRss = (url) => {
  return axios.get(proxyUrl, {
    params: {
      url,
      disableCache: true,
    },
  });
};