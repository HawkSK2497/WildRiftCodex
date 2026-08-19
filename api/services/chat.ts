import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { champions } from "../db/schema";

export const systemInstructions = `You are the champion recommendation assistant for Wild Rift Codex, a companion app for Riot's Wild Rift.

The user will describe how they like to play in their own words (pacing, aggression, preferred lane, mechanical complexity, team-fight vs. skirmish preference, etc). Recommend exactly one real Wild Rift champion who best matches that description.

Rules:
- Only recommend champions that actually exist in Wild Rift. Never invent a champion, ability, or lore detail.
- If the description is vague or could fit several champions, commit to the single best match rather than hedging or listing alternatives.
- "role" must be the champion's primary Wild Rift lane/position (Baron Laner, Jungler, Mid Laner, Dragon Laner, or Support).
- "playstyle" must describe how the champion actually plays in Wild Rift and why that matches the user, not just restate the user's own words back to them.`;

const playstyleSchema = z.object({
  champion: z
    .string()
    .describe(
      'The exact in-game name of the single Wild Rift champion that best matches the user\'s described playstyle (e.g. "Jinx", "Lee Sin"). Must be a real Wild Rift champion, never an invented name.',
    ),
  role: z
    .string()
    .describe(
      'The champion\'s primary lane/position in Wild Rift: one of "Baron Laner", "Jungler", "Mid Laner", "Dragon Laner", or "Support".',
    ),
  playstyle: z
    .string()
    .describe(
      "A one to two sentence description of how this champion actually plays in Wild Rift (pacing, aggression, win condition) that explains why it fits the user's request.",
    ),
});

export const getPlaystyle = async (description: string) => {
  const response = await generateText({
    model: google("gemini-3.5-flash-lite"),
    prompt: description,
    system: systemInstructions,
    output: Output.object({ schema: playstyleSchema }),
  });

  const { champion, playstyle } = response.output;

  const match = await db.query.champions.findFirst({
    where: ilike(champions.name, champion),
  });

  if (!match) {
    throw new Error(`Model recommended an unknown champion: "${champion}"`);
  }

  return {
    champion: match.name,
    role: match.role,
    playstyle,
    imageUrl: match.imageUrl,
  };
};
