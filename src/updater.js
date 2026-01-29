import { fetchRss } from './api.js';
import parseRss from './parser.js';
import { v4 as uuidv4 } from 'uuid';

const updateFeeds = (state) => {
  const promises = state.feeds.map((feed) =>
    fetchRss(feed.url)
      .then((response) => parseRss(response.data.contents))
      .then(({ posts }) => {
        const existingLinks = state.posts
          .filter((post) => post.feedId === feed.id)
          .map((post) => post.link);

        const newPosts = posts
          .filter((post) => !existingLinks.includes(post.link))
          .map((post) => ({
            id: uuidv4(),
            feedId: feed.id,
            title: post.title,
            link: post.link,
          }));

        state.posts.push(...newPosts);
      })
      .catch(() => {
        // ошибки обновления игнорируем, чтобы цикл не ломался
      })
  );

  Promise.all(promises).finally(() => {
    setTimeout(() => updateFeeds(state), 5000);
  });
};

export default updateFeeds;
