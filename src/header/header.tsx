import { FaCalendar } from 'react-icons/fa';//, FaList 
import { PiProjectorScreenChartDuotone } from "react-icons/pi";
import styles from './header.module.scss'

type HookFunction = {
    setSection: (section: string) => void;
};

export default function Header({ setSection }: HookFunction) {
    return (
        <div className={styles.header}>
            <button className={styles.button} onClick={() => { setSection('calendar') }}>
                <FaCalendar size={30} />
            </button >
            <button className={styles.button} onClick={() => { setSection('pain point') }}>
                <PiProjectorScreenChartDuotone size={30} />
            </button>

        </div>
    )


}