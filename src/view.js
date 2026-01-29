import i18next from 'i18next';

const renderFeeds = (feeds) => {
  const container = document.querySelector('#feeds');
  container.innerHTML = '';

  feeds.forEach(({ title, description }) => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    container.append(div);
  });
};

const renderPosts = (posts, viewedPosts) => {
  const container = document.querySelector('#posts');
  container.innerHTML = '';

  posts.forEach(({ id, title, link }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = link;
    a.textContent = title;
    a.target = '_blank';

    if (viewedPosts.includes(id)) {
      a.classList.add('fw-normal', 'text-muted');
    } else {
      a.classList.add('fw-bold');
    }

    li.append(a);
    container.append(li);
  });
};

export default (elements) => (path, value, previousValue, state) => {
  const { input } = elements;

  if (path === 'form.status') {
    if (value === 'error') {
      input.classList.add('is-invalid');
    }

    if (value === 'valid') {
      input.classList.remove('is-invalid');
      input.setCustomValidity('');
      input.value = '';
      input.focus();
    }

    if (value === 'loading') {
      input.setCustomValidity('');
    }
  }

  if (path === 'form.error' && value) {
    input.setCustomValidity(i18next.t(value));
    input.reportValidity();
  }

  if (path === 'feeds') {
    renderFeeds(value);
  }

  if (path === 'posts' || path === 'ui.viewedPosts') {
    renderPosts(state.posts, state.ui.viewedPosts);
  }
};
