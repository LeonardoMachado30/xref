import { useEffect, useState } from "react";
import {
  getProdutos,
  getProdutoById,
  createProduto,
  deleteProduto,
} from "./api";

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newProduto, setNewProduto] = useState({ CodProd: "", DescrProd: "" });

  const fetchProdutos = async () => {
    const data = await getProdutos(search);
    setProdutos(data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleSearch = () => fetchProdutos();

  const handleRowClick = async (id: any) => {
    const produto = await getProdutoById(id);
    setSelected(produto);
    setShowViewModal(true);
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    await createProduto({
      CodProd: parseInt(newProduto.CodProd),
      DescrProd: newProduto.DescrProd,
    });
    setShowAddModal(false);
    setNewProduto({ CodProd: "", DescrProd: "" });
    fetchProdutos();
  };

  const handleDelete = async () => {
    if (selected?.CodProd) {
      await deleteProduto(selected.CodProd);
      setShowDeleteModal(false);
      setSelected(null);
      fetchProdutos();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <input
              className="border px-3 py-2 rounded-md"
              placeholder="Buscar produto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Pesquisar
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Adicionar Produto
          </button>
        </div>

        <table className="w-full text-left border mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Código</th>
              <th className="p-2 border">Descrição</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto: any) => (
              <tr
                key={produto.CodProd}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(produto.CodProd)}
              >
                <td className="p-2 border">{produto.CodProd}</td>
                <td className="p-2 border">{produto.DescrProd}</td>
                <td className="p-2 border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(produto);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Visualizar */}
        {showViewModal && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow w-96">
              <h2 className="text-xl font-bold mb-2">Detalhes do Produto</h2>
              <p>
                <strong>Código:</strong> {selected.CodProd}
              </p>
              <p>
                <strong>Descrição:</strong> {selected.DescrProd}
              </p>
              <div className="text-right mt-4">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Adicionar */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <form
              onSubmit={handleCreate}
              className="bg-white p-6 rounded-xl shadow w-96"
            >
              <h2 className="text-xl font-bold mb-4">Adicionar Produto</h2>
              <input
                type="number"
                required
                placeholder="Código"
                value={newProduto.CodProd}
                onChange={(e) =>
                  setNewProduto((prev) => ({
                    ...prev,
                    CodProd: e.target.value,
                  }))
                }
                className="w-full mb-2 border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                required
                placeholder="Descrição"
                value={newProduto.DescrProd}
                onChange={(e) =>
                  setNewProduto((prev) => ({
                    ...prev,
                    DescrProd: e.target.value,
                  }))
                }
                className="w-full mb-4 border px-3 py-2 rounded-md"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Excluir */}
        {showDeleteModal && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow w-96">
              <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
              <p>
                Tem certeza que deseja excluir o produto{" "}
                <strong>{selected.DescrProd}</strong>?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
