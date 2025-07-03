import { FaCalendar, FaList } from 'react-icons/fa';
import { PiProjectorScreenChartDuotone } from "react-icons/pi";
import styles from './header.module.scss'
export default function Header() {
    return (
        <div className={styles.header}>
            <button className={styles.calendar}>
                <FaCalendar size={30} />
            </button >
            <button className={styles.project}>
                <PiProjectorScreenChartDuotone size={30} />
            </button>
            <button className={styles.todo}>
                <FaList size={30} />
            </button>
        </div>
    )


}