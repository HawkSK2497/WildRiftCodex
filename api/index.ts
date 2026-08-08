import express from "express";
import { eq } from "drizzle-orm";
import { db } from "./db/index";
import { champions } from "./db/schema";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/api/champions", async (_req, res) => {
  const result = await db.query.champions.findMany({
    with: { abilities: true, skins: true },
  });
  res.json(result);
});

app.get("/api/champions/:id", async (req, res) => {
  const result = await db.query.champions.findFirst({
    where: eq(champions.id, req.params.id),
    with: { abilities: true, skins: true },
  });

  if (!result) {
    res.status(404).json({ error: "champion not found" });
    return;
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`api listening on http://localhost:${PORT}`);
});
