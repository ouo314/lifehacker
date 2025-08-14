
export const useDatabase = <T> (dataName:string) => {

    const [db, setDb] = useState<Database | null>(null);
    const [list,setList] = useState<T[]>(null); 
    useEffect(() => {
        import('@tauri-apps/plugin-sql') 
        .then(m => m.default.load('sqlite:lifehacker.db'))
        .then(d => setDb(d))
        .catch(() => { setDb(null) });
    }, []);

    const get = async (start: string, end: string,table:string[]): Promise<T[]> =>
    { 
        if(db){
            await db.select<T[]>(`SELECT ${table} FROM ${dataName} `)
        }
        else{
            demoStore.${dataName}$.all();
        }
            
    }

    const add = async (data: Omit<T, 'id'>) => {
      if (db) {
        const columns = Object.keys(data).join(',');
        const placeholders = Object.keys(data)
          .map((_, index) => `$${index + 1}`)
          .join(',');
        const values = Object.values(data);
        
        await db.execute(
          `INSERT INTO ${dataName} (${columns}) VALUES (${placeholders})`,
          values
        );
      } else {
        demoStore[dataName].add(data);
      }
      refresh(); 
    };

      
    const update = async (key: string[],value:string[]) => {
    if(db){
      await db.execute(
        
        `UPDATE ${dataName} SET 
             ${key}=$${i}
           WHERE id=$1`,
        [p.id, p.tag, p.title, p.status, p.level, p.description,
        p.possible_solution_description, p.possible_solution_result])
       
    }else{
      demoStore.${dataName}.update(value);
    }
    const remove = async (id:string) => {
    if (db) {
      await db.execute(`DELETE FROM ${dataName} WHERE id=?`, id)
    } else {
      demoStore.${dataName}.remove(id);
    }
    refresh();
  }
  };
};
