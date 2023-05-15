import React from 'react';
import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios'
import { Box,Card, CardContent, Typography } from '@mui/material';


type repos_list={
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
            Fork数:{repos.created_at}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function App() {

  //状態を持たせたコンポーネントuserNameを定義
  const [keyWord, setKeyWord] = useState('');
  const [reposList,setReposList]=useState<repos_list[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const githubApi = async () => {
    try {
      const repoRes = await axios.get(`https://api.github.com/search/repositories?q={keyword}`);
      console.log(repoRes.data.items);
      setReposList(repoRes.data.items);
      console.log('リポジトリ読み込み完了');
    } catch (e) {
      console.log('検索結果が見つかりませんでした', e);
    }
  }
  //useEffectを用いて入力が終わったときに実行されるようにする。

  useEffect(() => {
    const timer = setTimeout(() => {
      githubApi();
    }, 500)

    return () => clearTimeout(timer)
  }, [keyWord])
  return (

    <div className="App">
      <input
        value={keyWord}
        type="text"
        onChange = {e=> setKeyWord(e.target.value)} 
      />
      <h1>{keyWord}</h1>
      <div  className="flex">
      {
        reposList.length > 0?(
          reposList.map((repos, index) => (
          <div key={index} className='w-25 h-300'>
            <MyCard repos = {repos} />
          </div>
          ))
        ) : (
          <p>検索結果が見つかりませんでした</p>
        )
      }
      </div>
    </div>
  );
}

export default App;
