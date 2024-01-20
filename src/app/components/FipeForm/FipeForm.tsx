"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import {
  marcasPermitidasCarros,
  marcasPermitidasMotos,
} from "../../../lib/definitions";

export function FipeForm() {
  const [query, setQuery] = useState("");
  const [veiculoTipo, setVeiculoTipo] = useState("");
  const [veiculoMarca, setVeiculoMarca] = useState("");
  const [resultado, setResultado] = useState([]);
  const [selectDisabled, setSelectDisabled] = useState(true);
  const [activeButton, setActiveButton] = useState(""); // Estado para controlar o botão ativo

  function handleClickVeiculo(tipo: string) {
    if (tipo === "cars") {
      setQuery("cars/brands");
      setActiveButton("cars");
    } else if (tipo === "motorcycles") {
      setQuery("motorcycles/brands");
      setActiveButton("motorcycles");
    }
  }

  async function listarMarcas() {
    let marcasPermitidas = [];

    if (query === "cars/brands") {
      marcasPermitidas = marcasPermitidasCarros;
    } else if (query === "motorcycles/brands") {
      marcasPermitidas = marcasPermitidasMotos;
    }

    if (query !== "") {
      const response = await fetch(
        `https://parallelum.com.br/fipe/api/v2/${query}`
      );
      const connect = await response.json();

      // Filtrar marcas permitidas
      const marcasFiltradas = connect.filter((marca: any) =>
        marcasPermitidas.includes(marca.name)
      );

      setResultado(marcasFiltradas);
      setSelectDisabled(false);
    } else {
      setSelectDisabled(true);
    }
  }

  useEffect(() => {
    listarMarcas();
  }, [query]);

  return (
    <div className={styles.container}>
      <div className={styles.botoes}>
        <button
          onClick={() => handleClickVeiculo("cars")}
          className={activeButton === "cars" ? styles.activeButton : ""}
        >
          Carros
        </button>
        <button
          onClick={() => handleClickVeiculo("motorcycles")}
          className={activeButton === "motorcycles" ? styles.activeButton : ""}
        >
          Motos
        </button>
      </div>

      <select
        name=""
        id=""
        defaultValue={"selecione"}
        disabled={selectDisabled}
      >
        <option value={"selecione"} disabled>
          {selectDisabled ? "Selecione o Tipo" : "Selecione a Marca"}
        </option>
        {resultado.map((marcas: any) => (
          <option value={marcas.code} key={marcas.code}>
            {marcas.name}
          </option>
        ))}
      </select>
    </div>
  );
}
