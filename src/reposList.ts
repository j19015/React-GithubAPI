export type repos_list={
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

//引数用の指定
export type MyCardProps = {
  repos: repos_list;
}