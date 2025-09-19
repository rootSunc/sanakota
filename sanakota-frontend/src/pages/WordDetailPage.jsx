import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { WordsAPI } from "../api";

export default function WordDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [word, setWord] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const resp = await WordsAPI.get(id);
        if (!cancelled) setWord(resp.data || null);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const synonyms = Array.isArray(word?.synonyms) ? word.synonyms : [];
  const inflections =
    word?.inflections && typeof word.inflections === "object"
      ? word.inflections
      : {};
  const exampleSentences = Array.isArray(word?.example_sentences)
    ? word.example_sentences
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Word Detail</h2>
        <Link to="/words" className="btn-secondary">
          Back to list
        </Link>
      </div>

      {loading && <div className="text-gray-600">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {word && (
        <div className="space-y-6">
          <div className="bg-white rounded shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {word.lemma}{" "}
                  <span className="text-lg text-gray-500">({word.pos})</span>
                </div>
                {word.translation && (
                  <div className="text-gray-700 mt-1">{word.translation}</div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-3 md:mt-0">
                {word.lexical_category && (
                  <span>Category: {word.lexical_category}</span>
                )}
              </div>
            </div>
            {word.definition && (
              <div className="mt-4 text-gray-700">{word.definition}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Synonyms
              </h3>
              {synonyms.length === 0 ? (
                <div className="text-gray-500">No synonyms</div>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {synonyms.map((s, idx) => (
                    <li
                      key={idx}
                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded shadow p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Inflections
              </h3>
              {Object.keys(inflections).length === 0 ? (
                <div className="text-gray-500">No inflections</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-4">Form</th>
                      <th className="py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(inflections).map(([k, v]) => (
                      <tr key={k} className="border-t">
                        <td className="py-2 pr-4 font-medium text-gray-800 whitespace-nowrap">
                          {k}
                        </td>
                        <td className="py-2 text-gray-700">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Example sentences
            </h3>
            {exampleSentences.length === 0 ? (
              <div className="text-gray-500">No examples</div>
            ) : (
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {exampleSentences.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
