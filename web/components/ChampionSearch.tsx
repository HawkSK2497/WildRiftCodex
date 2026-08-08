type ChampionSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ChampionSearch = ({ value, onChange }: ChampionSearchProps) => {
  return (
    <div className="group relative">
      <svg
        className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gold-dim transition-colors group-focus-within:text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>

      <input
        type="text"
        placeholder="SEARCH A CHAMPION..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gold-dim/60 bg-rift-deep/80 py-3.5 pr-12 pl-12 text-sm tracking-[0.2em] text-gold-bright uppercase placeholder:text-gold-dim/70 focus:border-gold focus:shadow-[0_0_20px_-4px_var(--color-gold)] focus:outline-none"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 px-2 py-1 text-gold-dim transition-colors hover:text-gold"
        >
          ✕
        </button>
      )}
    </div>
  );
};
