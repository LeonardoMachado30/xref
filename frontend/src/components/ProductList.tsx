import { useEffect, useState } from "react";
import { deleteProduto, getProdutos } from "../api";

interface Produto {
  CodProd: number;
  DescrProd: string;
}

export default function ProductList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const data = await getProdutos(search);
    setProdutos(data);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await deleteProduto(id);
    fetchData();
  };

  return (
    <div>
      <h3>Lista de Produtos</h3>
      <input
        placeholder="Buscar por nome"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {produtos.map((p) => (
          <li key={p.CodProd}>
            {p.CodProd} - {p.DescrProd}
            <button onClick={() => handleDelete(p.CodProd)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
