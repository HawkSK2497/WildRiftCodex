import axios from "axios";
import type { Champion, Playstyle } from "../types/champion";

export const getAllChampions = async (): Promise<Champion[]> => {
  const response = await axios.get("/api/champions");
  return response.data;
};

export const getChampion = async (championId: string): Promise<Champion> => {
  const response = await axios.get(`/api/champions/${championId}`);
  return response.data;
};

export const getPlaystyle = async (description: string): Promise<Playstyle> => {
  const response = await axios.post("/api/playstyle", { description });
  return response.data;
};
