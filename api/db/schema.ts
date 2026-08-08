import {
  pgTable,
  serial,
  text,
  smallint,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const champions = pgTable("champions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  role: text("role").notNull(),
  introVideoUrl: text("intro_video_url").notNull(),
  difficulty: smallint("difficulty").notNull(),
});

export const abilities = pgTable(
  "abilities",
  {
    id: serial("id").primaryKey(),
    championId: text("champion_id")
      .notNull()
      .references(() => champions.id, { onDelete: "cascade" }),
    abilityType: text("ability_type").notNull(),
    name: text("name").notNull(),
    iconUrl: text("icon_url").notNull(),
    videoUrl: text("video_url").notNull(),
    description: text("description").notNull(),
  },
  (t) => [
    uniqueIndex("abilities_champion_type_uq").on(t.championId, t.abilityType),
  ],
);

export const skins = pgTable(
  "skins",
  {
    id: serial("id").primaryKey(),
    championId: text("champion_id")
      .notNull()
      .references(() => champions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    position: smallint("position").notNull().default(0),
  },
  (t) => [index("skins_champion_idx").on(t.championId)],
);

export const championsRelations = relations(champions, ({ many }) => ({
  abilities: many(abilities),
  skins: many(skins),
}));

export const abilitiesRelations = relations(abilities, ({ one }) => ({
  champion: one(champions, {
    fields: [abilities.championId],
    references: [champions.id],
  }),
}));

export const skinsRelations = relations(skins, ({ one }) => ({
  champion: one(champions, {
    fields: [skins.championId],
    references: [champions.id],
  }),
}));
