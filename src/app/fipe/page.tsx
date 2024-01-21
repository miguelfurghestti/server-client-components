import { FipeForm } from "../components/FipeForm/FipeForm";
import Head from "next/head";

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

export default function Home() {
  return (
    <>
      <title>ConsultaFIPE</title>
      <FipeForm />
    </>
  );
}
