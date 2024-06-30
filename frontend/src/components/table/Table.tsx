import { PropsWithChildren } from "react";
import styles from "../../styles/css/Table.module.css";

interface TableProps extends PropsWithChildren {}

const Table = ({ children }: TableProps) => {
    return (
        <div className={styles.table}>
            <>{children}</>
        </div>
    );
}

export default Table;