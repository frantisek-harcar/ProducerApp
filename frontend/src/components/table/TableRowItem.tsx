import { ReactNode } from "react";
import { Col } from "react-bootstrap";
import { TableTypes } from "../const/tableTypes"
import styles from "../../styles/css/Table.module.css"

interface TableRowItemProps {
    item: string | ReactNode,
    type?: string
}

const TableRowItem = ({ item, type }: TableRowItemProps) => {
    return (
        <>
            {type === TableTypes.CENTER &&
                <Col className={`${styles.centerText}`} xs md xl="1">
                    {item}
                </Col>
            }

            {type !== TableTypes.CENTER &&
                <Col className={styles.centerText} xs md xl="2">
                    {item}
                </Col>
            }
        </>
    );
}

export default TableRowItem;