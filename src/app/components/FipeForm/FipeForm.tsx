"use client";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import {
  marcasPermitidasCarros,
  marcasPermitidasMotos,
} from "../../../lib/definitions";
import styles from "./styles.module.scss";

interface FipeFormProps {
  code: string;
  name: string;
  price: string;
  brand: string;
  model: string;
  modelYear: 0;
  fuel: string;
  codeFipe: string;
  referenceMonth: string;
  vehicleType: 0;
  fuelAcronym: string;
}

export function FipeForm() {
  const [vehycleType, setVehycleType] = useState("");

  const [veiculoModelo, setVeiculoModelo] = useState("");
  const [veiculoMarca, setVeiculoMarca] = useState("");
  const [veiculoAno, setVeiculoAno] = useState("");

  const [todosModelos, setTodosModelos] = useState<FipeFormProps[]>([]);
  const [todosAnos, setTodosAnos] = useState<FipeFormProps[]>([]);
  const [todasMarcas, setTodasMarcas] = useState<FipeFormProps[]>([]);

  const [selectTipoDisabled, setSelectTipoDisabled] = useState(true);
  const [selectModeloDisabled, setSelectModeloDisabled] = useState(true);
  const [selectAnoDisabled, setSelectAnoDisabled] = useState(true);

  const [veiculo, setVeiculo] = useState<FipeFormProps | null>(null);

  function handleClickVeiculo(tipo: string) {
    if (tipo === "cars") {
      setVehycleType("cars");
      setTodasMarcas([]);
      setTodosModelos([]);
      setTodosAnos([]);
      setVeiculo(null);
      setSelectModeloDisabled(true);
      setSelectAnoDisabled(true);
    } else if (tipo === "motorcycles") {
      setVehycleType("motorcycles");
      setTodasMarcas([]);
      setTodosModelos([]);
      setTodosAnos([]);
      setVeiculo(null);
      setSelectModeloDisabled(true);
      setSelectAnoDisabled(true);
    }
  }

  async function listarMarcas() {
    let marcasPermitidas: string[] = [];

    if (vehycleType === "cars") {
      marcasPermitidas = marcasPermitidasCarros;
    } else if (vehycleType === "motorcycles") {
      marcasPermitidas = marcasPermitidasMotos;
    }

    if (vehycleType !== "") {
      const response = await api.get(`${vehycleType}/brands`);

      // Filtrar marcas permitidas
      const marcasFiltradas = response.data.filter((marca: any) =>
        marcasPermitidas.includes(marca.name)
      );

      setTodasMarcas(marcasFiltradas);
      setSelectTipoDisabled(false);
    } else {
      setSelectTipoDisabled(true);
    }
  }

  async function listarModelos() {
    const response = await api.get(
      `${vehycleType}/brands/${veiculoMarca}/models/`
    );

    setTodosModelos(response.data);
    setSelectModeloDisabled(false);
  }

  async function listarAnos() {
    const response = await api.get(
      `${vehycleType}/brands/${veiculoMarca}/models/${veiculoModelo}/years`
    );

    setTodosAnos(response.data);
    setSelectAnoDisabled(false);
  }

  async function resultadoFipe() {
    const response = await api.get(
      `${vehycleType}/brands/${veiculoMarca}/models/${veiculoModelo}/years/${veiculoAno}`
    );

    setVeiculo(response.data);
  }

  // Se o tipo do veículo já estiver definido
  useEffect(() => {
    listarMarcas();
  }, [vehycleType]);

  // Se a marca do veículo já estiver definida
  useEffect(() => {
    if (veiculoMarca) {
      listarModelos();
    }
  }, [veiculoMarca]);

  // Se o modelo do veículo já estiver definido
  useEffect(() => {
    if (veiculoModelo) {
      listarAnos();
    }
  }, [veiculoModelo]);

  // Se o ano do veículo já estiver definido
  useEffect(() => {
    if (veiculoAno) {
      resultadoFipe();
    }
  }, [veiculoAno]);

  //HTML
  return (
    <div className={styles.container}>
      <h2>ConsultaFIPE</h2>
      <div className={styles.botoes}>
        <button
          onClick={() => handleClickVeiculo("cars")}
          className={vehycleType === "cars" ? styles.activeButton : ""}
        >
          Carros
        </button>
        <button
          onClick={() => handleClickVeiculo("motorcycles")}
          className={vehycleType === "motorcycles" ? styles.activeButton : ""}
        >
          Motos
        </button>
      </div>

      <select
        name="marca"
        id="marca"
        defaultValue={"selecionetipo"}
        disabled={selectTipoDisabled}
        onChange={(e) => setVeiculoMarca(e.target.value)}
      >
        <option value={"selecionetipo"}>
          {selectTipoDisabled ? "Selecione o Tipo" : "Selecione a Marca"}
        </option>
        {todasMarcas.map((marcas: any) => (
          <option value={marcas.code} key={marcas.code}>
            {marcas.name}
          </option>
        ))}
      </select>

      <select
        name="modelo"
        id="modelo"
        defaultValue={"selecionemodelo"}
        disabled={selectModeloDisabled}
        onChange={(e) => setVeiculoModelo(e.target.value)}
      >
        <option value={"selecionetipo"}>
          {selectModeloDisabled ? "Selecione o Modelo" : "Selecione o Modelo"}
        </option>
        {todosModelos &&
          todosModelos.map((modelos: any) => (
            <option value={modelos.code} key={modelos.code}>
              {modelos.name}
            </option>
          ))}
      </select>

      <select
        name="ano"
        id="ano"
        defaultValue={"selecioneano"}
        disabled={selectAnoDisabled}
        onChange={(e) => setVeiculoAno(e.target.value)}
      >
        <option value={"selecioneano"}>
          {selectAnoDisabled ? "Selecione o Ano" : "Selecione o Ano"}
        </option>
        {todosAnos &&
          todosAnos.map((anos: any) => (
            <option value={anos.code} key={anos.code}>
              {anos.name}
            </option>
          ))}
      </select>
      {veiculo && (
        <div className={styles.veiculoValor}>
          Valor do veículo: <strong>{veiculo.price}</strong>
        </div>
      )}
    </div>

    // NAO USADOS

    // const [search, setSearch] = useState("");

    // const filterVeiculos = veiculos.filter((veiculo) =>
    //   veiculo.name.toLowerCase().includes(search.toLowerCase())
    // );

    // console.log("filterVeiculos", filterVeiculos);

    //  <input
    //   className=""
    //   type="text"
    //   onChange={(e) => setSearch(e.target.value)}
    //       />

    // {
    // /* {filterVeiculos.length < 50 &&
    //   filterVeiculos.map((veiculo) => (
    //     <h3 key={veiculo.code}>{veiculo.name}</h3>
    //   ))} */
    // }

    // {
    // /* <FipeComponent brand={veiculoMarca} /> */
    // }

    // {
    // /* {veiculoMarca && (
    //     <select
    //       name=""
    //       id=""
    //       defaultValue={"selecione"}
    //       disabled={selectDisabled}
    //       onChange={(e) => setVeiculoMarca(e.target.value)}
    //     >
    //       <option value={"selecione"} disabled>
    //         {selectDisabled ? "Selecione o Tipo" : "Selecione a Marca"}
    //       </option>
    //       {resultado.map((marcas: any) => (
    //         <option value={marcas.code} key={marcas.code}>
    //           {marcas.name}
    //         </option>
    //       ))}
    //     </select>
    //   )} */
    // }
  );
}
