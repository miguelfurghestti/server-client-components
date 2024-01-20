"use client";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import {
  marcasPermitidasCarros,
  marcasPermitidasMotos,
} from "../../../lib/definitions";
import styles from "./styles.module.scss";

interface VeiculosProps {
  code: string;
  name: string;
}

export function FipeForm() {
  const [query, setQuery] = useState("");
  const [veiculoTipo, setVeiculoTipo] = useState("");
  const [veiculoMarca, setVeiculoMarca] = useState("");
  const [veiculos, setVeiculos] = useState<VeiculosProps[]>([]);
  const [resultado, setResultado] = useState([]);
  const [selectDisabled, setSelectDisabled] = useState(true);
  const [activeButton, setActiveButton] = useState(""); // Estado para controlar o botão ativo
  const [search, setSearch] = useState("");

  const filterVeiculos = veiculos.filter((veiculo) =>
    veiculo.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log("filterVeiculos", filterVeiculos);

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
    let marcasPermitidas: string[] = [];

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

  async function listarModelos() {
    const response = await api.get(
      `${activeButton}/brands/${veiculoMarca}/models`
    );

    setVeiculos(response.data);
  }

  useEffect(() => {
    listarMarcas();
  }, [query]);

  useEffect(() => {
    if (veiculoMarca) {
      listarModelos();
    }
  }, [veiculoMarca]);

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
        onChange={(e) => setVeiculoMarca(e.target.value)}
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

      {/* {veiculoMarca && (
        <select
          name=""
          id=""
          defaultValue={"selecione"}
          disabled={selectDisabled}
          onChange={(e) => setVeiculoMarca(e.target.value)}
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
      )} */}

      {/* <FipeComponent brand={veiculoMarca} /> */}

      <input
        className=""
        type="text"
        onChange={(e) => setSearch(e.target.value)}
      />

      {filterVeiculos.length < 50 &&
        filterVeiculos.map((veiculo) => (
          <h3 key={veiculo.code}>{veiculo.name}</h3>
        ))}
    </div>
  );
}
