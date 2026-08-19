export const ROLE_STYLE: Record<string, string> = {
  FIGHTER: "border-red-400/50 text-red-300",
  ASSASSIN: "border-fuchsia-400/50 text-fuchsia-300",
  MAGE: "border-sky-400/50 text-sky-300",
  MARKSMAN: "border-amber-400/50 text-amber-300",
  SUPPORT: "border-emerald-400/50 text-emerald-300",
  TANK: "border-slate-300/50 text-slate-200",
};

export const roleStyle = (role: string) =>
  ROLE_STYLE[role] ?? "border-gold-dim/50 text-gold";
