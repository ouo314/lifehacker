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
    possible_solution_description: string,
    possible_solution_result: string
}
const iconSize = 35;
function PainPoint() {
    const [painPoints, setPaintPoints] = useState<painPoint[]>([]);
    const [db, setDb] = useState<Database | null>(null);
    const [showNewWindow, setShowNewWindow] = useState(false)
    const [showInfoWindow, setShowInfoWindow] = useState(false)
    const statusIcon = [<GrStatusCritical size={iconSize} color='red' />,
    <GrStatusDisabled size={iconSize} color='rgb(147, 126, 72)' />, <GrStatusGood size={iconSize} color='green' />]
    const levelIcon = [<TbHexagonNumber1Filled size={iconSize} />, <TbHexagonNumber2Filled size={iconSize} />,
    <TbHexagonNumber3Filled size={iconSize} />, <TbHexagonNumber4Filled size={iconSize} />, <TbHexagonNumber5Filled size={iconSize} />]
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
            [p.tag, p.title, p.status, p.level, p.description, p.possible_solution_description, p.possible_solution_result]);
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
            [p.id, p.tag, p.title, p.status, p.level, p.description, p.possible_solution_description, p.possible_solution_result]);
        refresh();
    }

    async function deleteItem(id: Number) {
        await db.execute(`DELETE FROM pain_points WHERE id=?`, [id]);
        refresh()
    }
    const [item, setItem] = useState<painPoint | null>(null)

    function InfoWindow() {
        /*
        async function getItem(id: number) {
            const data = await db.select<painPoint>(`SELECT * FROM pain_points WHERE id=$1`, [id]);
            setItem(data)
        }
        getItem(id)*/
        const [infoStatus, setInfoStatus] = useState(item?.status || 1)
        const [infoLevel, setInfoLevel] = useState(item?.level || 1)


        return (
            <div className={styles.window}>
                <button
                    className={styles.close_button}
                    onClick={() => {
                        setShowInfoWindow(false)

                    }}>
                    <IoClose size={iconSize} />
                </button>
                <label >
                    Title:
                    <textarea onChange={(e) => { item.title = e.target.value }} >
                        {item.title}
                    </textarea>
                </label>
                <p className={styles.common}>
                    infoStatus:
                    <button onClick={() => setInfoStatus(1)}> <GrStatusCritical size={1.12 * iconSize} color={infoStatus === 1 ? 'red' : undefined} /> </button>
                    <button onClick={() => setInfoStatus(2)}> <GrStatusDisabled size={iconSize} color={infoStatus === 2 ? 'rgb(147, 126, 72)' : undefined} /> </button>
                    <button onClick={() => setInfoStatus(3)}> <GrStatusGood size={iconSize} color={infoStatus === 3 ? 'green' : undefined} /> </button>
                </p>
                <p className={styles.common}>
                    infoLevel:
                    <button onClick={() => setInfoLevel(1)}>{infoLevel === 1 ? <TbHexagonNumber1Filled size={iconSize} /> : <TbHexagonNumber1 size={iconSize} />}</button>
                    <button onClick={() => setInfoLevel(2)}>{infoLevel === 2 ? <TbHexagonNumber2Filled size={iconSize} /> : <TbHexagonNumber2 size={iconSize} />}</button>
                    <button onClick={() => setInfoLevel(3)}>{infoLevel === 3 ? <TbHexagonNumber3Filled size={iconSize} /> : <TbHexagonNumber3 size={iconSize} />}</button>
                    <button onClick={() => setInfoLevel(4)}>{infoLevel === 4 ? <TbHexagonNumber4Filled size={iconSize} /> : <TbHexagonNumber4 size={iconSize} />}</button>
                    <button onClick={() => setInfoLevel(5)}>{infoLevel === 5 ? <TbHexagonNumber5Filled size={iconSize} /> : <TbHexagonNumber5 size={iconSize} />}</button>
                </p>

                <label >
                    Description:
                    <textarea onChange={(e) => { item.description = e.target.value }} >
                        {item.description}
                    </textarea>
                </label>

                <label >
                    Possible Solution (Description):
                    <textarea onChange={(e) => { item.possible_solution_description = e.target.value }} >
                        {item.possible_solution_description}
                    </textarea>
                </label>

                <label >
                    Possible Solution (Result):
                    <textarea onChange={(e) => { item.possible_solution_result = e.target.value }} >
                        {item.possible_solution_result}
                    </textarea>
                </label>
                <div className={styles.button_div}>

                    <button className={styles.save_button}
                        onClick={() => {
                            item.level = infoLevel
                            item.status = infoStatus
                            update(item)
                            setShowInfoWindow(false)
                        }}>Save</button>

                    <button className={styles.delete_button}
                        onClick={() => {
                            deleteItem(item.id)
                            setShowInfoWindow(false)
                        }}>Delete</button>
                </div>

            </div>
        )
    }

    function NewWindow() {
        let input: painPoint = {
            id: -1,
            tag: '',
            title: '',
            status: 1,
            level: 1,
            description: '',
            possible_solution_description: '',
            possible_solution_result: ''
        }
        const [status, setStatus] = useState(1)
        const [level, setLevel] = useState(1)
        return (
            <div className={styles.window}>
                <button
                    className={styles.close_button}
                    onClick={() => {
                        setShowNewWindow(false)

                    }}>
                    <IoClose size={iconSize} />
                </button>
                <label >
                    Title:
                    <textarea onChange={(e) => { input.title = e.target.value }} />
                </label>
                <p className={styles.common}>
                    Status:
                    <button onClick={() => setStatus(1)}> <GrStatusCritical size={1.12 * iconSize} color={status === 1 ? 'red' : undefined} /> </button>
                    <button onClick={() => setStatus(2)}> <GrStatusDisabled size={iconSize} color={status === 2 ? 'rgb(147, 126, 72)' : undefined} /> </button>
                    <button onClick={() => setStatus(3)}> <GrStatusGood size={iconSize} color={status === 3 ? 'green' : undefined} /> </button>
                </p>
                <p className={styles.common}>
                    Level:
                    <button onClick={() => setLevel(1)}>{level === 1 ? <TbHexagonNumber1Filled size={iconSize} /> : <TbHexagonNumber1 size={iconSize} />}</button>
                    <button onClick={() => setLevel(2)}>{level === 2 ? <TbHexagonNumber2Filled size={iconSize} /> : <TbHexagonNumber2 size={iconSize} />}</button>
                    <button onClick={() => setLevel(3)}>{level === 3 ? <TbHexagonNumber3Filled size={iconSize} /> : <TbHexagonNumber3 size={iconSize} />}</button>
                    <button onClick={() => setLevel(4)}>{level === 4 ? <TbHexagonNumber4Filled size={iconSize} /> : <TbHexagonNumber4 size={iconSize} />}</button>
                    <button onClick={() => setLevel(5)}>{level === 5 ? <TbHexagonNumber5Filled size={iconSize} /> : <TbHexagonNumber5 size={iconSize} />}</button>
                </p>

                <label >
                    Description:
                    <textarea onChange={(e) => { input.description = e.target.value }} />
                </label>

                <label >
                    Possible Solution (Description):
                    <textarea onChange={(e) => { input.possible_solution_description = e.target.value }} />
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
                            setShowNewWindow(false)
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
            <ul className={styles.point_list}>
                {painPoints.map(p => (
                    <li key={p.id}
                        onClick={() => {
                            setItem(p);
                            setShowInfoWindow(true)
                        }}>
                        <div className={styles.point_item}>
                            <p className={styles.title}>{p.title}</p>
                            <div className={styles.icon}>
                                {statusIcon[p.status - 1]}
                                {levelIcon[p.level - 1]}
                            </div>

                        </div>
                    </li>
                ))}
            </ul>
            {showInfoWindow && <InfoWindow />}
            {showNewWindow && <NewWindow />}
            <button className={styles.new_button} onClick={() => setShowNewWindow(true)}>
                <BsPlusSquare size={40} />
            </button>
        </div>
    )
}

export default PainPoint