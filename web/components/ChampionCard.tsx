import type { Champion } from "../types/champion";
import { roleStyle } from "../lib/roleStyle";

const ABILITY_ORDER = ["passive", "first", "second", "third", "ultimate"];

const ABILITY_LABEL: Record<string, string> = {
  passive: "P",
  first: "1",
  second: "2",
  third: "3",
  ultimate: "ULT",
};

const SectionHeading = ({ children }: { children: string }) => (
  <div className="mb-5 flex items-center gap-4">
    <h3 className="font-display text-xl tracking-[0.25em] text-gold uppercase">
      {children}
    </h3>
    <div className="h-px flex-1 bg-gradient-to-r from-gold-dim to-transparent" />
  </div>
);

export const ChampionCard = ({ champion }: { champion: Champion }) => {
  const abilities = [...champion.abilities].sort(
    (a, b) =>
      ABILITY_ORDER.indexOf(a.abilityType) -
      ABILITY_ORDER.indexOf(b.abilityType),
  );
  const skins = [...champion.skins].sort((a, b) => a.position - b.position);
  const banner = skins[0]?.imageUrl ?? champion.imageUrl;

  return (
    <article className="border border-gold-dim/40 bg-rift-deep/60">
      {/* Hero banner */}
      <header className="relative">
        <img
          src={banner}
          alt=""
          aria-hidden="true"
          className="h-56 w-full object-cover object-top sm:h-72"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rift-deep via-rift-deep/70 to-transparent" />

        <div className="absolute right-6 bottom-0 left-6 flex flex-wrap items-end gap-5 pb-5">
          <img
            src={champion.imageUrl}
            alt={champion.name}
            className="h-24 w-24 border-2 border-gold object-cover shadow-[0_0_25px_-5px_var(--color-gold)]"
          />

          <div className="flex-1">
            <h2 className="font-display text-3xl leading-tight tracking-[0.12em] text-gold-bright uppercase sm:text-4xl">
              {champion.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span
                className={`border px-3 py-1 text-xs tracking-[0.2em] uppercase ${roleStyle(
                  champion.role,
                )}`}
              >
                {champion.role}
              </span>

              <span className="flex items-center gap-2 text-xs tracking-[0.2em] text-gold-bright/70 uppercase">
                Difficulty
                <span className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <span
                      key={level}
                      className={`h-3.5 w-2 skew-x-[-12deg] ${
                        level <= champion.difficulty
                          ? "bg-gold"
                          : "bg-gold-dim/30"
                      }`}
                    />
                  ))}
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-10 p-6 sm:p-8">
        {/* Abilities */}
        <section>
          <SectionHeading>Abilities</SectionHeading>

          <ul className="space-y-3">
            {abilities.map((ability) => (
              <li
                key={ability.id}
                className="flex gap-4 border border-rift-line/60 bg-rift-panel/50 p-4 transition-colors hover:border-gold-dim"
              >
                <div className="relative shrink-0">
                  <img
                    src={ability.iconUrl}
                    alt={ability.name}
                    className="h-16 w-16 border border-gold-dim/70 object-cover"
                  />
                  <span className="absolute -right-2 -bottom-2 flex h-6 min-w-6 items-center justify-center border border-gold bg-rift-void px-1.5 text-[10px] font-bold tracking-wider text-gold">
                    {ABILITY_LABEL[ability.abilityType] ?? ability.abilityType}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="font-display tracking-[0.1em] text-gold-bright uppercase">
                    {ability.name}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-gold-bright/65">
                    {ability.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Skins */}
        <section>
          <SectionHeading>{`Skins (${skins.length})`}</SectionHeading>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skins.map((skin) => (
              <figure
                key={skin.id}
                className="group relative overflow-hidden border border-rift-line/60"
              >
                <img
                  src={skin.imageUrl}
                  alt={skin.name}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rift-void/95 via-rift-void/20 to-transparent" />
                <figcaption className="absolute right-3 bottom-2 left-3 text-xs tracking-[0.12em] text-gold-bright uppercase">
                  {skin.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};
