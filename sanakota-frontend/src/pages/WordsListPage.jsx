import { useEffect, useMemo, useState } from "react";
import { WordsAPI } from "../api";

export default function WordsListPage() {
  const [lemma, setLemma] = useState("");
  const [pos, setPos] = useState("");
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [stats, setStats] = useState(null);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const listPromise = WordsAPI.list({
          lemma: lemma || undefined,
          pos: pos || undefined,
          limit,
          offset,
        });
        const [listResp, statsResp] = await Promise.all([
          listPromise,
          WordsAPI.stats(),
        ]);
        if (cancelled) return;
        setRows(listResp.data || []);
        setCount(listResp.count || 0);
        setStats(statsResp.data || null);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [lemma, pos, limit, offset]);

  function nextPage() {
    setOffset(offset + limit);
  }
  function prevPage() {
    setOffset(Math.max(0, offset - limit));
  }

  return (
    <div>
      {/* Google-like search bar with controls on the right */}
      <div className="mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.817-4.817A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              value={lemma}
              onChange={(e) => {
                setOffset(0);
                setLemma(e.target.value);
              }}
              placeholder="Search words"
              className="w-full bg-white border border-gray-300 rounded-full pl-12 pr-12 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
            {lemma && (
              <button
                type="button"
                onClick={() => {
                  setLemma("");
                  setOffset(0);
                }}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10l-4.95-4.95L5.05 3.636 10 8.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="shrink-0 flex items-end gap-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">
                POS
              </label>
              <select
                value={pos}
                onChange={(e) => {
                  setOffset(0);
                  setPos(e.target.value);
                }}
                className="border rounded-full px-3 py-1.5 text-sm"
              >
                <option value="">Any</option>
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">
                Page
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setOffset(0);
                  setLimit(parseInt(e.target.value, 10));
                }}
                className="border rounded-full px-3 py-1.5 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">{stats.total_words}</div>
          </div>
          <div className="card text-center">
            <div className="text-sm text-gray-500">POS</div>
            <div className="text-xl font-semibold">{stats.unique_pos}</div>
          </div>
          <div className="card text-center">
            <div className="text-sm text-gray-500">Categories</div>
            <div className="text-xl font-semibold">
              {stats.unique_categories}
            </div>
          </div>
          <div className="card text-center hidden md:block">
            <div className="text-sm text-gray-500">Since</div>
            <div className="text-xl font-semibold">
              {new Date(stats.first_word_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {loading
              ? "Loading…"
              : `Showing ${rows.length} items (page ${page})`}
          </div>
          <div className="space-x-2">
            <a href="/words/new" className="btn-primary">
              Add Word
            </a>
            <button
              className="btn-secondary"
              onClick={prevPage}
              disabled={offset === 0 || loading}
            >
              Prev
            </button>
            <button
              className="btn-primary"
              onClick={nextPage}
              disabled={loading}
            >
              Next
            </button>
          </div>
        </div>
        {error && <div className="px-4 py-3 text-red-600">{error}</div>}
        <ul className="divide-y">
          {rows.map((w) => (
            <li
              key={w.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  <a href={`/words/${w.id}`} className="hover:underline">
                    {w.lemma}
                  </a>{" "}
                  <span className="text-sm text-gray-500">({w.pos})</span>
                </div>
                {w.translation && (
                  <div className="text-sm text-gray-700">{w.translation}</div>
                )}
                {w.definition && (
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {w.definition}
                  </div>
                )}
              </div>
              <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                {Array.isArray(w.synonyms) && w.synonyms.length > 0 && (
                  <span>
                    Synonyms: {w.synonyms.slice(0, 4).join(", ")}
                    {w.synonyms.length > 4 ? "…" : ""}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
