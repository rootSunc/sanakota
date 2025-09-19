import { API_BASE } from "./config";

async function request(path, params = {}) {
  const url = new URL(path, API_BASE);
  const res = await fetch(url.toString(), params);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const WordsAPI = {
  list({ lemma, pos, lexical_category, limit = 20, offset = 0 } = {}) {
    const url = new URL("/api/words", API_BASE);
    if (lemma) url.searchParams.set("lemma", lemma);
    if (pos) url.searchParams.set("pos", pos);
    if (lexical_category)
      url.searchParams.set("lexical_category", lexical_category);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    return request(url.pathname + url.search);
  },
  search(q, limit = 10) {
    const url = new URL("/api/words/search", API_BASE);
    url.searchParams.set("q", q);
    url.searchParams.set("limit", String(limit));
    return request(url.pathname + url.search);
  },
  stats() {
    return request("/api/words/stats");
  },
  listByPos(pos, limit = 20, offset = 0) {
    const url = new URL(`/api/words/pos/${encodeURIComponent(pos)}`, API_BASE);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    return request(url.pathname + url.search);
  },
  listByCategory(category, limit = 20, offset = 0) {
    const url = new URL(
      `/api/words/category/${encodeURIComponent(category)}`,
      API_BASE
    );
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    return request(url.pathname + url.search);
  },
  create(body) {
    return request("/api/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },
  get(id) {
    return request(`/api/words/${id}`);
  },
};
