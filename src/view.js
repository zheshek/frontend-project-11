import i18next from 'i18next';
import { Modal } from 'bootstrap';

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
    li.classList.add('d-flex', 'justify-content-between', 'align-items-start');

    const a = document.createElement('a');
    a.href = link;
    a.textContent = title;
    a.target = '_blank';

    if (viewedPosts.includes(id)) {
      a.classList.add('fw-normal', 'text-muted');
    } else {
      a.classList.add('fw-bold');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-sm', 'btn-outline-primary');
    button.textContent = 'Просмотр';
    button.dataset.id = id;

    li.append(a, button);
    container.append(li);
  });
};

const renderModal = (state, modalElement) => {
  const post = state.posts.find((p) => p.id === state.ui.activePostId);
  if (!post) return;

  modalElement.querySelector('.modal-title').textContent = post.title;
  modalElement.querySelector('.modal-body').textContent = post.description ?? '';
  modalElement.querySelector('.modal-footer a').href = post.link;

  const modal = new Modal(modalElement);
  modal.show();
};

export default (elements, state) => (path, value) => {
  const { input, modal, feedback } = elements;

  if (path === 'form.status') {
    if (value === 'error') {
      input.classList.add('is-invalid');

      feedback.textContent = i18next.t(state.form.error);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    }

    if (value === 'valid') {
      input.classList.remove('is-invalid');
      input.setCustomValidity('');
      input.value = '';
      input.focus();

      feedback.textContent = 'RSS успешно загружен';
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
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

  if (path === 'ui.activePostId') {
    renderModal(state, modal);
  }
};