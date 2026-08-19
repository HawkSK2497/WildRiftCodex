import { useEffect, useMemo, useState } from "react";
import { ChampionSearch } from "./components/ChampionSearch";
import { ChampionCard } from "./components/ChampionCard";
import { ChampionGrid } from "./components/ChampionGrid";
import { PlaystyleFinder } from "./components/PlaystyleFinder";
import { getAllChampions } from "./api";
import type { Champion } from "./types/champion";

export const App = () => {
  const [search, setSearch] = useState("");
  const [champions, setChampions] = useState<Champion[]>([]);
  const [selected, setSelected] = useState<Champion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllChampions()
      .then(setChampions)
      .catch(() =>
        setError("Could not reach the API. Is `npm run dev:api` running?"),
      )
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return champions;
    return champions.filter(
      (champion) =>
        champion.name.toLowerCase().includes(query) ||
        champion.id.toLowerCase().includes(query),
    );
  }, [champions, search]);

  const selectByName = (championName: string) => {
    const match = champions.find(
      (champion) =>
        champion.name.toLowerCase() === championName.toLowerCase(),
    );
    if (match) setSelected(match);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--color-rift-deep),var(--color-rift-void)_60%)]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl tracking-[0.3em] text-gold-bright uppercase sm:text-5xl">
            Wild Rift
          </h1>
          <div className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-3 text-xs tracking-[0.35em] text-gold-dim uppercase">
            Champion Codex · SiddyK2
          </p>
        </header>

        <div className="mx-auto mb-8 max-w-xl">
          <ChampionSearch value={search} onChange={setSearch} />
        </div>

        {error && (
          <p className="border border-red-500/40 bg-red-950/30 p-5 text-center text-sm tracking-wider text-red-300 uppercase">
            {error}
          </p>
        )}

        {loading && !error && (
          <p className="p-10 text-center text-sm tracking-[0.25em] text-gold-dim uppercase">
            Summoning champions…
          </p>
        )}

        {!loading && !error && selected && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="border border-gold-dim/60 px-4 py-2 text-xs tracking-[0.2em] text-gold uppercase transition-colors hover:border-gold hover:bg-gold/10"
            >
              ← Back to all champions
            </button>
            <ChampionCard champion={selected} />
          </div>
        )}

        {!loading && !error && !selected && (
          <>
            <div className="mb-8">
              <PlaystyleFinder onSelectChampion={selectByName} />
            </div>

            <p className="mb-4 text-xs tracking-[0.25em] text-gold-dim uppercase">
              {results.length} champion{results.length === 1 ? "" : "s"}
            </p>
            <ChampionGrid champions={results} onSelect={setSelected} />
          </>
        )}
      </div>
    </div>
  );
};
