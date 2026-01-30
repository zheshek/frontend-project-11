import updateFeeds from './updater.js'
import i18next from 'i18next'
import onChange from 'on-change'

import resources from './locales/ru.js'
import initView from './view.js'
import validate from './validator.js'
import { fetchRss } from './api.js'
import parseRss from './parser.js'

import './style.css'

// i18n
i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: resources,
  },
})

const state = {
  form: {
    status: 'filling', // filling | loading | error | valid
    error: null,
  },
  feeds: [],
  posts: [],
  ui: {
    viewedPosts: [],
    activePostId: null,
  },
}

// DOM
const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input[name="url"]'),
  feedback: document.querySelector('.feedback'),
  modal: document.querySelector('#modal'),
}

// watcher
const watchedState = onChange(state, initView(elements, state))

elements.input.addEventListener('input', () => {
  watchedState.form.error = null
  watchedState.form.status = 'filling'
  elements.input.setCustomValidity('')
})

updateFeeds(watchedState)

const postsContainer = document.querySelector('#posts')

postsContainer.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') {
    return
  }

  const postId = e.target.dataset.id

  if (!watchedState.ui.viewedPosts.includes(postId)) {
    watchedState.ui.viewedPosts.push(postId)
  }

  watchedState.ui.activePostId = postId
})

// submit
elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const url = elements.input.value.trim()
  watchedState.form.status = 'loading'

  const existingUrls = watchedState.feeds.map(feed => feed.url)

  validate(url, existingUrls)
    .then(() => fetchRss(url))
    .then((response) => {
      const { feed, posts } = parseRss(response.data.contents)
      const feedId = crypto.randomUUID()

      watchedState.feeds.push({
        id: feedId,
        url,
        title: feed.title,
        description: feed.description,
      })

      const postsWithIds = posts.map(post => ({
        id: crypto.randomUUID(),
        feedId,
        title: post.title,
        link: post.link,
        description: post.description,
      }))

      watchedState.posts.push(...postsWithIds)

      watchedState.form.status = 'valid'
      watchedState.form.error = null
    })
    .catch((err) => {
      let errorKey = 'errors.network'

      if (err.name === 'ValidationError') {
        errorKey = err.message
      }
      else if (err.message === 'parseError') {
        errorKey = 'errors.parseError'
      }

      watchedState.form.error = errorKey
      watchedState.form.status = 'error'
    })
})
