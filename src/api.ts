import axios from 'axios';

export const githubApi = async (keyWord: string) => {
  try {
    const repoRes = await axios.get(`https://api.github.com/search/repositories?q=${keyWord}`);
    console.log(repoRes.data.items);
    return repoRes.data.items;
  } catch (e) {
    console.log('検索結果が見つかりませんでした', e);
    return [];
  }
};