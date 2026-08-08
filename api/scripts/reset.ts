import { sql } from "drizzle-orm";
import { db } from "../db/index";
import { champions } from "../db/schema";

async function reset() {
  await db.execute(sql`TRUNCATE TABLE ${champions} RESTART IDENTITY CASCADE`);
  console.log("database reset");
}

reset()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
