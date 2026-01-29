import { fetchRss } from './api.js';
import parseRss from './parser.js';

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
            id: crypto.randomUUID(),
            feedId: feed.id,
            title: post.title,
            link: post.link,
          }));

        if (newPosts.length > 0) {
          state.posts.push(...newPosts);
        }
      })
      .catch(() => {
        // намеренно игнорируем ошибки обновления
      })
  );

  Promise.all(promises).finally(() => {
    setTimeout(() => updateFeeds(state), 5000);
  });
};

export default updateFeeds;
