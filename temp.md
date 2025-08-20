``` typescript
export const useDatabase = <T> (dataName:string) => {
    const [db, setDb] = useState<Database | null>(null);
      
    useEffect(() => {
        import('@tauri-apps/plugin-sql') 
        .then(m => m.default.load('sqlite:lifehacker.db'))
        .then(d => setDb(d))
        .catch(() => { setDb(null) });
    }, []);

    const getAll = async (): Promise<T[]> =>
    { 
        if(db){
            return await db.select<T[]>(`SELECT * FROM ${dataName} `)
        }
        else{
            return demoStore[dataName].all();
        }            
    }

    const add = async (data: Omit<T, 'id'>) => {
      if (db) {
        const columns = Object.keys(data).join(',');
        const placeholders = Object.keys(data)
          .map((_, index) => `$${index + 1}`)
          .join(',');
        const values = Object.values(data);
        
        return await db.execute(
          `INSERT INTO ${dataName} (${columns}) VALUES (${placeholders})`,
          values
        );
      } else {
        demoStore[dataName].add(data);
      }
   
    };
      
    const update = async (data:Partial<Omit<T,'id'>>,id:string|number) => {
    if(db){
      const setClause = Object.keys(data).map( (key,index)=> 
      `${key}=$${index+2}` ).join(',')
      const values = Object.values(data);
      return await db.execute(        
        `UPDATE ${dataName} SET 
        ${setClause} 
        WHERE id=$1`,
        [id,...values])       
    }else{
      demoStore[dataName].update(values);
    }

    const remove = async (id:string) => {
      if (db) {
        return await db.execute(`DELETE FROM ${dataName} WHERE id=$1`, id)
      } else {
        demoStore[dataName].remove(id);
      }
 
    }

  };
  return { getAll, add, update, remove}

};
```


## Database Refactor Devlog

### 1. Problem Discovery
- Multiple hooks (Todos, PainPoints, Calendar) had highly repetitive CRUD code.
- Source switching (between SQLite and localStorage) meant copy-pasting and high maintenance cost.

***

### 2. Refactoring Goals
- Unified CRUD interface.
- Support for both SQLite and localStorage, easily switchable.
- Fully type-safe and extendable with TypeScript.

***

### 3. Technical Approach
- Use a generic function to abstract CRUD: `getAll`, `add`, `update(id, data)`, `remove(id)`.
- Dynamically construct parameterized SQL queries to prevent injection.
- Single implementation for both localStorage and SQLite—the caller doesn’t care which.

