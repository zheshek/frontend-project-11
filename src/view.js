import i18next from 'i18next';

export default (elements) => (path, value) => {
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
  }

  if (path === 'form.error' && value) {
    input.setCustomValidity(i18next.t(value));
    input.reportValidity();
  }
};