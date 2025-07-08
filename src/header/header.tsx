import { FaCalendar, FaList } from 'react-icons/fa';
import { PiProjectorScreenChartDuotone } from "react-icons/pi";
import styles from './header.module.scss'
export default function Header({ setSection }) {
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