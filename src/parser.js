export default (data) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'application/xml')

  if (doc.querySelector('parsererror')) {
    throw new Error('parseError')
  }

  const channel = doc.querySelector('channel')
  const items = doc.querySelectorAll('item')

  if (!channel || items.length === 0) {
    throw new Error('parseError')
  }

  const feed = {
    title: channel.querySelector('title')?.textContent,
    description: channel.querySelector('description')?.textContent,
  }

  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent,
  }))

  return { feed, posts }
}
