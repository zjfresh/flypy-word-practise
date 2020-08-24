import articleMap from '@/assets/article.js';

export const articleKeys = Object.keys(articleMap);


export function getArticle(articleName) {
  return articleMap[articleName];
}
