export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("http://localhost:8000/upload/", { method: "POST", body: formData });
  return res.json();
}

export async function querySystem(query) {
  const res = await fetch("http://localhost:8000/query/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return res.json();
}