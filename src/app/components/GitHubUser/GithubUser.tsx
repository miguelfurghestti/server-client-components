"use client";
import { useState } from "react";
import styles from "./styles.module.scss";

export function GithubUser() {
  const [inputValue, setInputValue] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");

  async function handleSearchUser() {
    const response = await fetch(`https://api.github.com/users/${inputValue}`);
    const user = await response.json();
    setAvatarUrl(user.avatar_url);
    //console.log(user.avatar_url);
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Digite o nome do usuário"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSearchUser}>Buscar Usuário</button>
      {!avatar_url ? <p>Sem foto!</p> : <img src={avatar_url} />}
    </div>
  );
}
