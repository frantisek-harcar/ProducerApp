import { Col, Row } from "react-bootstrap";
import { File as FileModel } from "../../models/file";
import { User as UserModel } from "../../models/user";
import styles from "../../styles/Files.module.scss";
import styleUtils from "../../styles/utils.module.scss";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";

interface SingleFileProps {
    file: FileModel,
    user: UserModel | null,
    onEditFileClicked: (file: FileModel) => void,
    className?: string,
}

const FileSingleComponent = ({ file, user, onEditFileClicked, className }: SingleFileProps) => {

    const authenticatedUser = useAuthenticatedUser();

    return (
        <>
            <Row className={ authenticatedUser.user?.admin ? styles.iconTextRowAdmin : styles.iconTextRow}>
                <Col xs="1" md="1" lg="2" className={styles.iconContainer}>
                    {(file.isPaid || file.price < 1) &&
                        <div className={`${styles.iconPaid} ${styleUtils.center}`}>
                            <a href={file.downloadLink} target="_blank" rel="noreferrer" className={styleUtils.lightText}>
                                <img alt="icon" src={file.originalName.toLowerCase().endsWith('.pdf') ? '/pdf.svg' : '/mp3.svg'} />
                            </a>
                        </div>
                    }
                    {!file.isPaid && file.price >= 1 &&
                        <div className={`${styles.iconUnpaid} ${styleUtils.center}`}>
                            <span className={styleUtils.lightText}>
                                <img alt="icon" src={file.originalName.toLowerCase().endsWith('.pdf') ? '/pdf.svg' : '/mp3.svg'} />
                            </span>
                        </div>
                    }

                </Col>
                {authenticatedUser.user?.admin &&
                    <Col xs="11" md="11" lg="10"
                        className={`${styles.textContainer} ${styleUtils.clickable}`}
                        onClick={() => { onEditFileClicked(file) }}
                    >
                        <div>
                            {file.originalName}
                        </div>
                    </Col>
                }

                {!authenticatedUser.user?.admin &&
                    <Col xs="11" md="11" lg="10" className={styles.textContainer}>
                        <a href={file.downloadLink} target="_blank" rel="noreferrer" className={styleUtils.lightText}>
                            {file.originalName}
                        </a>
                    </Col>
                }
            </Row>
        </>
    );
}

export default FileSingleComponent;