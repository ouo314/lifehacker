import { useEffect, useState, useCallback } from "react";
import Database from "@tauri-apps/plugin-sql";

export type PainPoint = {
  id: number;
  tag: string;
  title: string;
  status: number; // 1=critical 2=blocked 3=good
  level: number;  // 1~5
  description: string;
  possible_solution_description: string;
  possible_solution_result: string;
};

export function usePainPoints() {
  const [db, setDb] = useState<Database | null>(null);
  const [points, setPoints] = useState<PainPoint[]>([]);

  useEffect(() => {
    Database.load("sqlite:lifehacker.db").then(setDb).catch(console.error);
  }, []);

  const refresh = useCallback(async () => {
    if (!db) return;
    const rows = await db.select<PainPoint[]>(
      "SELECT * FROM pain_points ORDER BY id DESC"
    );
    setPoints(rows);
  }, [db]);

  useEffect(() => { if (db) refresh(); }, [db, refresh]);

  /* --- CRUD ------------------------------------------------------------ */
  const add = async (p: Omit<PainPoint, "id">) => {
    if (!db) return;
    await db.execute(
      `INSERT INTO pain_points
      (tag,title,status,level,description,possible_solution_description,possible_solution_result)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [p.tag, p.title, p.status, p.level, p.description,
      p.possible_solution_description, p.possible_solution_result]
    );
    refresh();
  };

  const update = async (p: PainPoint) => {
    if (!db) return;
    await db.execute(
      `UPDATE pain_points SET
      tag=$2,title=$3,status=$4,level=$5,description=$6,
      possible_solution_description=$7,possible_solution_result=$8
      WHERE id=$1`,
      [p.id, p.tag, p.title, p.status, p.level, p.description,
      p.possible_solution_description, p.possible_solution_result]
    );
    refresh();
  };

  const remove = async (id: number) => {
    if (!db) return;
    await db.execute("DELETE FROM pain_points WHERE id=$1", [id]);
    refresh();
  };

  return { points, add, update, remove };
}
