import * as yup from 'yup';

export default (url, feeds) => {
  const schema = yup
    .string()
    .url('Ссылка должна быть валидным URL')
    .notOneOf(feeds, 'RSS уже существует')
    .required();

  return schema.validate(url);
};