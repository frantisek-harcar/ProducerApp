import styles from "../../styles/css/Table.module.css"

interface TableRowItemProps {
    item: string,
}

const TableTag = ({ item }: TableRowItemProps) => {
    return (
        <>
            <div className={styles.tag}>
                {item}
            </div>
        </>
    );
}

export default TableTag;