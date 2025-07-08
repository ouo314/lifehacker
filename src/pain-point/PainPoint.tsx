import styles from './PainPoint.module.scss'
import { BsPlusSquare } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { GrStatusCritical, GrStatusDisabled, GrStatusGood, GrStatusUnknown } from "react-icons/gr";
import {
    TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled,
    TbHexagonNumber4Filled, TbHexagonNumber5Filled, TbHexagonNumber1,
    TbHexagonNumber2, TbHexagonNumber3,
    TbHexagonNumber4, TbHexagonNumber5
} from "react-icons/tb";
import { useEffect, useState } from 'react';
import Database from '@tauri-apps/plugin-sql';
type painPoint = {
    id: number,
    tag: string,
    title: string,
    status: number,
    level: number,
    description: string,
    possible_solution_descriptioin: string,
    possible_solution_result: string
}

function PainPoint() {
    const [painPoints, setPaintPoints] = useState<painPoint[]>([]);
    const [db, setDb] = useState<Database | null>(null);
    const [showWindow, setShowWindow] = useState(false)
    const statusIcon = [<GrStatusCritical />, <GrStatusDisabled />, <GrStatusGood />]
    const levelIcon = [<TbHexagonNumber1Filled />, <TbHexagonNumber2Filled />, <TbHexagonNumber3Filled />, <TbHexagonNumber4Filled />, <TbHexagonNumber5Filled />]
    useEffect(() => {
        async function initDb() {
            try {
                const database = await Database.load('sqlite:lifehacker.db');
                setDb(database);
            } catch (error) {
                console.error('database load error:', error);
            }
        }
        initDb();
    }, []);

    async function refresh() {
        const rows = await db.select<painPoint[]>(`
          SELECT *
          FROM pain_points 
          ORDER BY id ASC`
        );
        setPaintPoints(rows);
    }

    async function add(p: painPoint) {
        await db.execute(`
          INSERT INTO pain_points (tag,title,status,level,description,possible_solution_description,possible_solution_result) 
          VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [p.tag, p.title, p.status, p.level, p.description, p.possible_solution_descriptioin, p.possible_solution_result]);
        refresh();
    }

    async function update(p: painPoint) {
        await db.execute(`
          UPDATE pain_points 
          SET tag=$2,
          title=$3,
          status=$4,
          level=$5,
          description=$6,
          possible_solution_description=$7,
          possible_solution_result=$8
          WHERE id=$1`,
            [p.id, p.tag, p.title, p.status, p.level, p.description, p.possible_solution_descriptioin, p.possible_solution_result]);
        refresh();
    }

    function NewWindow() {
        let input: painPoint = {
            id: -1,
            tag: '',
            title: '',
            status: -1,
            level: -1,
            description: '',
            possible_solution_descriptioin: '',
            possible_solution_result: ''
        }
        const [status, setStatus] = useState(1)
        const [level, setLevel] = useState(1)
        return (
            <div className={styles.window}>
                <button
                    className={styles.close_button}
                    onClick={() => {
                        setShowWindow(false)

                    }}>
                    <IoClose size={25} />
                </button>
                <label >
                    Title:
                    <textarea onChange={(e) => { input.title = e.target.value }} />
                </label>
                <p className={styles.common}>
                    Status:
                    <button onClick={() => setStatus(1)}> <GrStatusCritical size={28} color={status === 1 ? 'red' : undefined} /> </button>
                    <button onClick={() => setStatus(2)}> <GrStatusDisabled size={25} color={status === 2 ? 'rgb(147, 126, 72)' : undefined} /> </button>
                    <button onClick={() => setStatus(3)}> <GrStatusGood size={25} color={status === 3 ? 'green' : undefined} /> </button>
                </p>
                <p className={styles.common}>
                    Level:
                    <button onClick={() => setLevel(1)}>{level === 1 ? <TbHexagonNumber1Filled size={25} /> : <TbHexagonNumber1 size={25} />}</button>
                    <button onClick={() => setLevel(2)}>{level === 2 ? <TbHexagonNumber2Filled size={25} /> : <TbHexagonNumber2 size={25} />}</button>
                    <button onClick={() => setLevel(3)}>{level === 3 ? <TbHexagonNumber3Filled size={25} /> : <TbHexagonNumber3 size={25} />}</button>
                    <button onClick={() => setLevel(4)}>{level === 4 ? <TbHexagonNumber4Filled size={25} /> : <TbHexagonNumber4 size={25} />}</button>
                    <button onClick={() => setLevel(5)}>{level === 5 ? <TbHexagonNumber5Filled size={25} /> : <TbHexagonNumber5 size={25} />}</button>
                </p>

                <label >
                    Description:
                    <textarea onChange={(e) => { input.description = e.target.value }} />
                </label>

                <label >
                    Possible Solution (Description):
                    <textarea onChange={(e) => { input.possible_solution_descriptioin = e.target.value }} />
                </label>

                <label >
                    Possible Solution (Result):
                    <textarea onChange={(e) => { input.possible_solution_result = e.target.value }} />
                </label>
                <div className={styles.button_div}>

                    <button className={styles.save_button}
                        onClick={() => {
                            input.level = level
                            input.status = status
                            add(input)

                        }}>Save</button>
                </div>

            </div>
        )
    }

    useEffect(() => {
        if (db) refresh();
    }, [db]);

    return (
        <div className={styles.background}>
            <ul>
                {painPoints.map(p => (
                    <li key={p.id} >
                        <div >
                            <p>{p.title}</p>
                            statusIcon[{p.status}]
                            levelIcon[{p.level}]
                        </div>
                    </li>
                ))}
            </ul>
            {showWindow && <NewWindow />}
            <button className={styles.new_button} onClick={() => setShowWindow(true)}>
                <BsPlusSquare size={30} />
            </button>
        </div>
    )
}

export default PainPoint