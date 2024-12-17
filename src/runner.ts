import { format } from "date-fns";

import { checkDatabaseExists, createDatabase, getDatabaseClient } from "./db";
import { vendite } from "./db/schema";
import env from "./env";
import { getAvailableInstances } from "./lib/available-instances";

export async function runner() {
  console.log("Executing runner..");

  const istanze = await getAvailableInstances();
  console.log(`[AVAILABLE ISTANCES]: ${istanze}`);
  for (const item of istanze) {
    const { url, istanza } = item;
    const dbExists = await checkDatabaseExists(istanza);
    console.log(`[DB EXISTS]: ${item.istanza} - ${dbExists}`);
    if (!dbExists) {
      console.log(`[CREATING DB]: ${item.istanza} ...`);
      const createdDb = await createDatabase(istanza);
      console.log(`[DB CREATED] - ${createdDb?.name}`);
      await new Promise(res => setTimeout(res, 10000));
    }

    console.log(`[GETTING DB CLIENT]: ${item.istanza} ...`);
    const client = await getDatabaseClient(istanza);

    console.log(`[GETTING SALES FROM BISUITE]: ${item.istanza} ...`);
    const bisuiteResponse = await fetch(`https://${url}/${istanza}/Api/v1/public.php/VenditeDettagliPeriodo/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": env.BISUITE_API_TOKEN,
      },
      body: JSON.stringify({
        inizio: format(new Date(), "yyyy-MM-dd"),
        fine: format(new Date(), "yyyy-MM-dd"),
        limit: 5000,
      }),
    });

    if (!bisuiteResponse.ok) {
      console.error("Impossibile ottenere vendite per: ", `https://${url}/${istanza}`);
      continue;
    }

    console.log(`[BISUITE RESPONSE]: OK`);

    const bisuiteVendite = await bisuiteResponse.json();

    const iterations = await client?.transaction(async (tx) => {
      let count = 0;
      for (const v of bisuiteVendite.data) {
        await tx.insert(vendite).values(v).onConflictDoUpdate({
          target: vendite.venditaNumeroVendita,
          set: v,
        });
        count++;
      }
      return count;
    });

    console.log(`[${item.url}/${item.istanza}]: VENDITE PROCESSATE -> ${iterations}`);
  }

  console.log("Done!");
}

runner();
