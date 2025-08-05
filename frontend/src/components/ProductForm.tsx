import { useState } from "react";
import { createProduto } from "../api";

export default function ProductForm({ onCreated }: { onCreated: () => void }) {
  const [CodProd, setCodProd] = useState("");
  const [DescrProd, setDescrProd] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CodProd || !DescrProd) return alert("Preencha todos os campos");

    const result = await createProduto({
      CodProd: parseInt(CodProd, 10),
      DescrProd,
    });

    if (result.error) alert(result.error);
    else {
      setCodProd("");
      setDescrProd("");
      onCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cadastrar Produto</h3>
      <input
        type="number"
        placeholder="Código"
        value={CodProd}
        onChange={(e) => setCodProd(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descrição"
        value={DescrProd}
        onChange={(e) => setDescrProd(e.target.value)}
      />
      <button type="submit">Salvar</button>
    </form>
  );
}
