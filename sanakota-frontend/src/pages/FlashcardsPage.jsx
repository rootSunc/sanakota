import { useEffect, useMemo, useState } from "react";
import { WordsAPI } from "../api";

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function FlashcardsPage() {
  const [pos, setPos] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = useMemo(
    () => (cards.length > 0 ? cards[index] : null),
    [cards, index]
  );

  async function loadCards() {
    setLoading(true);
    setError("");
    try {
      const resp = pos
        ? await WordsAPI.listByPos(pos, limit, 0)
        : await WordsAPI.list({ limit, offset: 0 });
      const items = resp.data || [];
      setCards(shuffleArray(items));
      setIndex(0);
      setFlipped(false);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function next() {
    if (cards.length === 0) return;
    setIndex((prev) => (prev + 1) % cards.length);
    setFlipped(false);
  }

  function prev() {
    if (cards.length === 0) return;
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setFlipped(false);
  }

  return (
    <div className="space-y-6">
      {/* Controls moved to bottom */}

      {error && <div className="text-red-600">{error}</div>}

      <div className="max-w-3xl mx-auto">
        <div className="text-center text-sm text-gray-500 mb-2">
          {cards.length > 0
            ? `Card ${index + 1} of ${cards.length}`
            : "No cards"}
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => setFlipped((f) => !f)}
          style={{ perspective: "1000px", minHeight: "520px" }}
        >
          <div
            className="rounded-2xl shadow-lg bg-white p-10 md:p-12 transition"
            style={{
              minHeight: "520px",
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "none",
              transition: "transform 600ms",
            }}
          >
            {!current ? (
              <div
                className="h-48 flex items-center justify-center text-gray-400"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                No cards loaded
              </div>
            ) : (
              <>
                {/* Front */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="text-4xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                    {current.lemma}
                  </div>
                  <div className="text-center text-gray-500 mb-8 text-lg md:text-lg">
                    {current.pos}
                    {current.lexical_category
                      ? ` · ${current.lexical_category}`
                      : ""}
                  </div>
                  <div className="text-center text-gray-600">
                    Tap to reveal translation, definition, and examples
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {current.translation && (
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                        {current.translation}
                      </div>
                    </div>
                  )}
                  {current.definition && (
                    <div className="text-center mt-2 text-gray-700 text-base md:text-lg">
                      {current.definition}
                    </div>
                  )}

                  {Array.isArray(current.example_sentences) &&
                    current.example_sentences.length > 0 && (
                      <div className="text-center mt-4">
                        <div className="text-sm font-medium text-gray-700 text-center mb-1">
                          Examples
                        </div>
                        <ul className="list-disc list-inside text-base text-gray-600 space-y-2 max-w-2xl mx-auto text-center">
                          {current.example_sentences
                            .slice(0, 3)
                            .map((ex, i) => (
                              <li key={i}>{ex}</li>
                            ))}
                        </ul>
                      </div>
                    )}

                  {current.inflections &&
                    typeof current.inflections === "object" &&
                    Object.keys(current.inflections).length > 0 && (
                      <div className="text-center mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 text-center">
                          Inflections
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 text-sm">
                          {Object.values(current.inflections)
                            .slice(0, 6)
                            .map((v, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-gray-100 rounded-full"
                                title={String(v)}
                              >
                                {String(v).slice(0, 16)}
                                {String(v).length > 16 ? "…" : ""}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            className="btn-secondary"
            onClick={prev}
            disabled={cards.length === 0}
          >
            Prev
          </button>
          <button
            className="btn-primary"
            onClick={next}
            disabled={cards.length === 0}
          >
            Next
          </button>
        </div>
        <div className="mt-6 flex flex-row flex-wrap items-end justify-end gap-3">
          <div className="text-right">
            <label className="block text-[11px] font-medium text-gray-600 mb-1">
              Part of speech
            </label>
            <select
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="border rounded-full px-3 py-1.5 text-sm"
            >
              <option value="">Any</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
            </select>
          </div>
          <div className="text-right">
            <label className="block text-[11px] font-medium text-gray-600 mb-1">
              Deck size
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              className="border rounded-full px-3 py-1.5 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="md:pt-0 text-right">
            <button
              className="btn-primary px-4 py-2 text-sm"
              onClick={loadCards}
              disabled={loading}
            >
              {loading ? "Loading…" : "Load deck"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
