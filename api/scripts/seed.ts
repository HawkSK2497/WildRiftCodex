import { eq } from "drizzle-orm";
import { wildRiftAPI } from "@wildrift/champions-api";
import { db } from "../db/index";
import { champions, abilities, skins } from "../db/schema";

async function seed() {
  const championList = await wildRiftAPI.loadChampions();

  for (const champion of championList) {
    await db.transaction(async (tx) => {
      await tx
        .insert(champions)
        .values({
          id: champion.id,
          name: champion.name,
          imageUrl: champion.image_url,
          role: champion.role,
          introVideoUrl: champion.intro_video_url,
          difficulty: champion.difficulty,
        })
        .onConflictDoUpdate({
          target: champions.id,
          set: {
            name: champion.name,
            imageUrl: champion.image_url,
            role: champion.role,
            introVideoUrl: champion.intro_video_url,
            difficulty: champion.difficulty,
          },
        });

      await tx.delete(abilities).where(eq(abilities.championId, champion.id));
      await tx.delete(skins).where(eq(skins.championId, champion.id));

      const abilityRows = Object.values(champion.abilities).map(
        (ability) => ({
          championId: champion.id,
          abilityType: ability.ability_type,
          name: ability.name,
          iconUrl: ability.icon_url,
          videoUrl: ability.video_url,
          description: ability.description,
        }),
      );
      if (abilityRows.length > 0) {
        await tx.insert(abilities).values(abilityRows);
      }

      const skinRows = champion.skins.map((skin, position) => ({
        championId: champion.id,
        name: skin.name,
        imageUrl: skin.image_url,
        position,
      }));
      if (skinRows.length > 0) {
        await tx.insert(skins).values(skinRows);
      }
    });

    console.log(`seeded ${champion.name}`);
  }

  console.log(`done, seeded ${championList.length} champions`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
