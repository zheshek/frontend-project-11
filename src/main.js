import './style.css';
import onChange from 'on-change';
import initView from './view.js';
import validate from './validator.js';

const state = {
  form: {
    status: 'filling', // filling | error | valid
    error: null,
  },
  feeds: [],
};

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
};

const watchedState = onChange(state, initView(elements));

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();

  const url = elements.input.value.trim();

  validate(url, watchedState.feeds)
    .then(() => {
      watchedState.feeds.push(url);
      watchedState.form.status = 'valid';
      watchedState.form.error = null;
    })
    .catch((err) => {
      watchedState.form.status = 'error';
      watchedState.form.error = err.message;
    });
});