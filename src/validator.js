import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate',
  },
});

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export default (url, feeds) => {
  const schema = yup
    .string()
    .required()
    .test('valid-url', 'errors.invalidUrl', isValidUrl)
    .notOneOf(feeds);

  return schema.validate(url);
};