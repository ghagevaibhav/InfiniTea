import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as Schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {schema: Schema});

export {sql};