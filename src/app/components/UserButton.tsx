"use client";
import { useState } from "react";

export function UserButton() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <input type="text" />
      <button>Atualizar Usuário</button>
    </div>
  );
}
