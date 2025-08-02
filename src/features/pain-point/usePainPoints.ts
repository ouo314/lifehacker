import { useEffect, useState, useCallback } from 'react';
import type Database from '@tauri-apps/plugin-sql';
import { demoStore } from '../../lib/demoStore';
import type { PainPoint } from '../../lib/demo';

export function usePainPoints() {
  const [db, setDb] = useState<Database | null>(null);
  const [points, set] = useState<PainPoint[]>([]);

  useEffect(() => {

    import('@tauri-apps/plugin-sql')
      .then(m => m.default.load('sqlite:lifehacker.db'))
      .then(d => setDb(d))
      .catch(() => { setDb(null) });

  }, []);

  const refresh = useCallback(async () => {
    set(db
      ? await db.select<PainPoint[]>('SELECT * FROM pain_points ORDER BY id DESC')
      : demoStore.painPoints.all());
  }, [db]);

  useEffect(() => { refresh(); }, [refresh]);

  /* CRUD ---------------------------------------------------------------- */
  const add = async (p: Omit<PainPoint, 'id'>) => {
    db
      ? await db.execute(
        `INSERT INTO pain_points
           (tag,title,status,level,description,possible_solution_description,possible_solution_result)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [p.tag, p.title, p.status, p.level, p.description,
        p.possible_solution_description, p.possible_solution_result])
      : demoStore.painPoints.add(p);
    refresh();
  };

  const update = async (p: PainPoint) => {
    db
      ? await db.execute(
        `UPDATE pain_points SET
             tag=$2,title=$3,status=$4,level=$5,description=$6,
             possible_solution_description=$7,possible_solution_result=$8
           WHERE id=$1`,
        [p.id, p.tag, p.title, p.status, p.level, p.description,
        p.possible_solution_description, p.possible_solution_result])
      : demoStore.painPoints.update(p);
    refresh();
  };

  const remove = async (id: number) => {
    db
      ? await db.execute('DELETE FROM pain_points WHERE id=$1', [id])
      : demoStore.painPoints.remove(id);
    refresh();
  };

  return { points, add, update, remove };
}
