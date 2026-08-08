export type Ability = {
  id: number;
  championId: string;
  abilityType: string;
  name: string;
  iconUrl: string;
  videoUrl: string;
  description: string;
};

export type Skin = {
  id: number;
  championId: string;
  name: string;
  imageUrl: string;
  position: number;
};

export type Champion = {
  id: string;
  name: string;
  imageUrl: string;
  role: string;
  introVideoUrl: string;
  difficulty: number;
  abilities: Ability[];
  skins: Skin[];
};
