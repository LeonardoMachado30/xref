const BASE_URL = "https://xref.onrender.com/api"; // ajuste se backend estiver em outra porta

export async function getProdutos(search = "") {
  const res = await fetch(`${BASE_URL}/produto?search=${search}`);
  return res.json();
}

export async function getProdutoById(id: number) {
  const res = await fetch(`${BASE_URL}/produto/${id}`);
  return res.json();
}

export async function createProduto(data: {
  CodProd: number;
  DescrProd: string;
}) {
  const res = await fetch(`${BASE_URL}/produto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduto(id: number) {
  const res = await fetch(`${BASE_URL}/produto/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
