import React from 'react';
import './App.css';
//状態遷移
import { useState,useEffect } from 'react';

//非同期処理  
import axios from 'axios'

//api呼び出し
import { githubApi } from './api';
//pagination
import ReactPaginate from 'react-paginate';

//WebStorage
import localforage from 'localforage';
import { updateSourceFile } from 'typescript';

//型宣言
import {repos_list,MyCardProps} from './reposList';

//Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';

//Cardのレイアウト
import { MyCard } from './myCard';



//メインの関数
function App() {

  //状態を持たせたコンポーネントuserNameを定義
  const [keyWord, setKeyWord] = useState('');
  const [reposList,setReposList]=useState<repos_list[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [favorites, setFavorites] = useState<repos_list[]>([]);
  const [myFavorites, setMyFavorites] = useState(true);

  //githubのリポジトリ検索を行う
  const githubSearch = async () => {
    const repoList = await githubApi(keyWord);
    setReposList(repoList);
    setMyFavorites(true);
    setCurrentPage(0);
    console.log('リポジトリ読み込み完了');
  };

  //ローカルストレージの中のfavoritesの一覧を取得
  const getFavorites=()=>{
    localforage.getItem<repos_list[]>('favorites')
      .then((data) => {
        if (data) {
          setFavorites(data);
          console.log('お気に入り情報を取得しました', data);
        }
      })
      .catch((e) => {
        console.error('お気に入り情報の取得に失敗しました', e);
    });
  }

  
  // お気に入りボタンがクリックされたときの関数
  const handleToggleFavorite=(repos: repos_list)=>{
    //送られてきた情報のidだけ抽出してrepoIdに挿入
    const repoId = repos.id;
    //.some()は、与えられた条件を満たす要素が配列内に存在するかどうかを確認するメソッド
    //favoriteは引数名で、この場合はfavorites配列の要素。アロー関数の右側の式でその要素のidプロパティにアクセス。
    const isFavorite = favorites.some(favorite => favorite.id === repoId);
    
    // 変数を宣言
    let updatedFavorites: repos_list[]; 

    if (isFavorite) {
      // お気に入り解除
      //filterは特定の条件を満たす要素を除外するメソッド
      updatedFavorites = favorites.filter(favorite => favorite.id !== repoId);
      setFavorites(updatedFavorites);
    } else {
      // お気に入り登録
      //favoritesとお気に入りボタンを押したreposを合わせて登録
      updatedFavorites = [...favorites, repos];
      setFavorites(updatedFavorites);
    }
    // お気に入り情報をWebストレージに保存
    localforage.setItem('favorites', updatedFavorites)
    .then(() => {
      console.log('お気に入り情報を保存しました');
    })
    .catch(err => {
      console.error('お気に入り情報の保存に失敗しました', err);
    });
  }

  //お気に入りに入っているか入っていないかを判定する関数
  const judgeFavorites=(repos: repos_list)=>{
    const repoId = repos.id;
    const isFavorite = favorites.some(favorite => favorite.id === repoId);
    if(isFavorite){
      return(
        <Button sx={{ml:5}} onClick={() =>handleToggleFavorite(repos)} variant="contained">お気に入り解除</Button>
      );
    }else{
      return(
        <Button sx={{ml:5}} onClick={() =>handleToggleFavorite(repos)} variant="contained">お気に入り</Button>
      );
    }
  }

  //自分のお気に入りか、情報全てかを選択
  const myFavoriteBool=()=>{
    if(myFavorites){
      setCurrentPage(0);
      setMyFavorites(false);
      setReposList(favorites);
    }else{
      setMyFavorites(true);
      githubSearch();
    }
  }

  // 上記のボタンの表示
  const myFavoriteButton=()=>{
    if(myFavorites){
      return(
        <Button sx={[{mb:5},{mr:5}]}variant="outlined" onClick={myFavoriteBool}>お気に入りを表示</Button>
      );
    }else{
      return(
        <Button sx={[{mb:5},{mr:5}]}variant="outlined" onClick={myFavoriteBool}>情報をすべて表示</Button>
      );
    }
  }  
  
  //useEffectを用いてKeyWordの入力が終わったときに実行されるようにする。
  useEffect(() => {
    const timer = setTimeout(() => {
      //githubのリポジトリを検索
      githubSearch();
      //ローカルのwebストレージからいいね一覧を取得
      getFavorites();
    }, 500)
    return () => clearTimeout(timer)
  }, [keyWord])

  //メインのJSX
  return (
    <div className="App">
      <div style={{textAlign:'right'}}>
        {myFavoriteButton()}
      </div>
      <TextField onChange = {e=> setKeyWord(e.target.value)} id="outlined-basic" value={keyWord} label="Repositries" variant="outlined" />
      
      { 
        myFavorites ? (
          <h1>{keyWord}</h1>
        ):(
        <h1>お気に入り一覧</h1>
        )
      }
      
      <div  className="flex">
      {
        reposList.length > 0?(
          reposList
          .slice(currentPage*6,(currentPage+1)*6)
          .map((repos, index) => (
          <div key={index} className='w-25 h-300'>
            <p>
              No.{index+(currentPage*5)}
              {judgeFavorites(repos)}
            </p>
            <MyCard repos = {repos} />
          </div>
          ))
        ) : (
          <p>検索結果が見つかりませんでした</p>
        )
      }
    </div>
      <Pagination 
      count={Math.ceil(reposList.length / 6)} 
      color="primary" 
      onChange={(e,page)=>setCurrentPage(page-1)}
      sx={{mt:5}}
      />
    </div>
  );
}

export default App;
