export default (elements) => (path, value) => {
  const { input } = elements;

  if (path === 'form.status') {
    if (value === 'error') {
      input.classList.add('is-invalid');
    }

    if (value === 'valid') {
      input.classList.remove('is-invalid');
      input.value = '';
      input.focus();
    }
  }
};