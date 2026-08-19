import { useState } from "react";
import { getPlaystyle } from "../api";
import type { Playstyle } from "../types/champion";
import { roleStyle } from "../lib/roleStyle";

type PlaystyleFinderProps = {
  onSelectChampion: (championName: string) => void;
};

export const PlaystyleFinder = ({ onSelectChampion }: PlaystyleFinderProps) => {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<Playstyle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!description.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setResult(await getPlaystyle(description));
    } catch {
      setError("The codex could not divine a champion. Try rephrasing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-gold-dim/40 bg-rift-deep/60 p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-4">
        <h2 className="font-display text-xl tracking-[0.25em] text-gold uppercase">
          Find your champion
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-gold-dim to-transparent" />
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gold-bright/65">
        Describe how you like to play — pacing, aggression, lane, how much
        mechanical complexity you want — and the codex will name the champion
        that fits.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void submit();
            }
          }}
          placeholder="I LIKE DIVING THE BACKLINE AND SNOWBALLING EARLY…"
          className="w-full resize-y border border-gold-dim/60 bg-rift-deep/80 p-4 text-sm leading-relaxed tracking-[0.1em] text-gold-bright placeholder:text-gold-dim/70 placeholder:uppercase focus:border-gold focus:shadow-[0_0_20px_-4px_var(--color-gold)] focus:outline-none"
        />

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="border border-gold-dim/60 px-5 py-2.5 text-xs tracking-[0.2em] text-gold uppercase transition-colors hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gold-dim/60 disabled:hover:bg-transparent"
          >
            {loading ? "Consulting…" : "Consult the codex"}
          </button>

          <span className="text-[10px] tracking-[0.2em] text-gold-dim uppercase">
            Ctrl + Enter
          </span>
        </div>
      </form>

      {error && (
        <p className="mt-5 border border-red-500/40 bg-red-950/30 p-4 text-center text-sm tracking-wider text-red-300 uppercase">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-5 p-6 text-center text-sm tracking-[0.25em] text-gold-dim uppercase">
          Reading the rift…
        </p>
      )}

      {result && !loading && (
        <button
          type="button"
          onClick={() => onSelectChampion(result.champion)}
          className="mt-6 flex w-full items-start gap-5 border border-rift-line/60 bg-rift-panel/50 p-5 text-left transition-colors hover:border-gold focus:border-gold focus:outline-none"
        >
          <img
            src={result.imageUrl}
            alt={result.champion}
            className="h-20 w-20 shrink-0 border-2 border-gold object-cover shadow-[0_0_25px_-5px_var(--color-gold)]"
          />

          <div className="min-w-0">
            <h3 className="font-display text-2xl leading-tight tracking-[0.12em] text-gold-bright uppercase">
              {result.champion}
            </h3>

            <span
              className={`mt-2 inline-block border px-3 py-1 text-xs tracking-[0.2em] uppercase ${roleStyle(
                result.role,
              )}`}
            >
              {result.role}
            </span>

            <p className="mt-3 text-sm leading-relaxed text-gold-bright/65">
              {result.playstyle}
            </p>

            <span className="mt-3 inline-block text-[10px] tracking-[0.2em] text-gold-dim uppercase">
              View full codex entry →
            </span>
          </div>
        </button>
      )}
    </section>
  );
};
