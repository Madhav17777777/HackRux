export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("https://hackrux.onrender.com/upload/", { method: "POST", body: formData });
  return res.json();
}

export async function querySystem(query) {
  const res = await fetch("https://hackrux.onrender.com/query/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return res.json();
}