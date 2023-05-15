import React from 'react';
import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios'
import { Box,Card, CardContent, Typography } from '@mui/material';
import ReactPaginate from 'react-paginate';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import localforage from 'localforage';


type repos_list={
  //favorite用のid
  id :number;
  //リポジトリの説明
  description :string;
  //作成日
  created_at :string;
  //更新日
  updated_at :string;
  //Star数
  stargazers_count :number;
  //Watch数
  watchers_count :number;
  //Fork数
  forks_count :number;
}

type MyCardProps = {
  repos: repos_list;
}


function App() {

  //状態を持たせたコンポーネントuserNameを定義
  const [keyWord, setKeyWord] = useState('');
  const [reposList,setReposList]=useState<repos_list[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [favorites, setFavorites] = useState<repos_list[]>([]);

  const githubApi = async () => {
    try {
      const repoRes = await axios.get(`https://api.github.com/search/repositories?q=${keyWord}`);
      console.log(repoRes.data.items);
      setReposList(repoRes.data.items);
      console.log('リポジトリ読み込み完了');
    } catch (e) {
      console.log('検索結果が見つかりませんでした', e);
    }
  }

  const handleToggleFavorite=(repos: repos_list)=>{
    const repoId = repos.id;
    const isFavorite = favorites.some(favorite => favorite.id === repoId);
  
    let updatedFavorites: repos_list[]; // 変数を宣言
  
    if (isFavorite) {
      // お気に入り解除
      updatedFavorites = favorites.filter(favorite => favorite.id !== repoId);
      setFavorites(updatedFavorites);
    } else {
      // お気に入り登録
      updatedFavorites = [...favorites, repos];
      setFavorites(updatedFavorites);
    }
  
    // お気に入り情報をWebストレージに保存
    localforage.setItem('favorites', updatedFavorites).catch(err => {
      console.error('お気に入り情報の保存に失敗しました', err);
    });
  }

  const MyCard= ({ repos }: MyCardProps) => {
    return (
      <Box sx={{m:2,height: '100%'}}>
        <Card sx={{height: '75%'}}>
          <CardContent>
            <Typography>
              説明:{repos.description}
            </Typography>
            <Typography>
              作成日:{repos.created_at}
            </Typography>
            <Typography>
              更新日時:{repos.updated_at}
            </Typography>
            <Typography>
              Star数:{repos.stargazers_count}
            </Typography>
            <Typography>
              Watch数:{repos.forks_count}
            </Typography>
            <Typography>
              Fork数ss:{repos.created_at}
            </Typography>
            <Typography>
              <button onClick={() =>handleToggleFavorite(repos)}>お気に入り</button>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  //useEffectを用いて入力が終わったときに実行されるようにする。

  useEffect(() => {
    const timer = setTimeout(() => {
      githubApi();
    }, 500)

    return () => clearTimeout(timer)
  }, [keyWord])
  return (

    <div className="App">
      <TextField onChange = {e=> setKeyWord(e.target.value)} id="outlined-basic" label="Repositries" variant="outlined" />
      <h1>{keyWord}</h1>
      <div  className="flex">
      {
        reposList.length > 0?(
          reposList
          .slice(currentPage*6,(currentPage+1)*6)
          .map((repos, index) => (
          <div key={index} className='w-25 h-300'>
            <p>No.{index+(currentPage*5)}</p>
            <MyCard repos = {repos} />
          </div>
          ))
        ) : (
          <p>検索結果が見つかりませんでした</p>
        )
      }
    </div>
      <Pagination 
      count={reposList.length/6} 
      color="primary" 
      onChange={(e,page)=>setCurrentPage(page-1)}
      sx={{mt:5}}
      />
    </div>
  );
}

export default App;
