import styles from "../../styles/css/Table.module.css"
import { ReactNode } from "react";

interface TableHeadingRowProps {
    item: ReactNode,
}

const TableHeadingRow = ({ item }: TableHeadingRowProps) => {
    return (
        <>
            <div className={styles.tableHeading}>
                {item}
            </div>
        </>
    );
}

export default TableHeadingRow;