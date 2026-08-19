import express from "express";
import { eq } from "drizzle-orm";
import { db } from "./db/index";
import { champions } from "./db/schema";
import { getPlaystyle } from "./services/chat";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

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

app.post("/api/playstyle", async (req, res) => {
  const { description } = req.body ?? {};

  if (typeof description !== "string" || description.trim() === "") {
    res.status(400).json({ error: "description is required" });
    return;
  }

  try {
    const result = await getPlaystyle(description);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "failed to generate a recommendation" });
  }
});

app.listen(PORT, () => {
  console.log(`api listening on http://localhost:${PORT}`);
});
