export async function fetchAPI(path) {
  const res = await fetch(path);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  }

  const resBody = await res.json();
  return resBody;
}
