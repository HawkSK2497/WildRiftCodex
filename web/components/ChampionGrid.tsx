import type { Champion } from "../types/champion";

type ChampionGridProps = {
  champions: Champion[];
  onSelect: (champion: Champion) => void;
};

export const ChampionGrid = ({ champions, onSelect }: ChampionGridProps) => {
  if (champions.length === 0) {
    return (
      <p className="border border-rift-line/60 bg-rift-deep/40 p-10 text-center text-sm tracking-[0.2em] text-gold-dim uppercase">
        No champions found
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {champions.map((champion) => (
        <button
          key={champion.id}
          type="button"
          onClick={() => onSelect(champion)}
          className="group relative overflow-hidden border border-rift-line/60 transition-colors hover:border-gold focus:border-gold focus:outline-none"
        >
          <img
            src={champion.imageUrl}
            alt={champion.name}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rift-void via-rift-void/30 to-transparent" />
          <span className="absolute right-1 bottom-1.5 left-1 truncate text-[10px] tracking-wider text-gold-bright uppercase">
            {champion.name}
          </span>
        </button>
      ))}
    </div>
  );
};
