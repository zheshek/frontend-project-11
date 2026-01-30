import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate',
  },
  string: {
    url: 'errors.invalidUrl',
  },
})

export default (url, feeds) => {
  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(feeds)

  return schema.validate(url)
}
