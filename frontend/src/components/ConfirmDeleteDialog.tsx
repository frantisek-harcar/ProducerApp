import { Modal, Button } from "react-bootstrap";
import styles from "../styles/css/Modal.module.css"
import { useTranslation } from "react-i18next";

interface AddEditReservationDialogProps {
    setShowDeleteConfirmation: (state: boolean) => void,
    confirmDelete: () => void,
    confirmArchive?: () => void,
    confirmDeleteTitle: string,
    confirmDeleteMessage: string,
    archive?: boolean,
    alreadyArchived?: boolean,
}

const ConfirmDeleteDialog = ({ setShowDeleteConfirmation, confirmDelete, confirmArchive, confirmDeleteTitle, confirmDeleteMessage, archive, alreadyArchived }: AddEditReservationDialogProps) => {

    const { t } = useTranslation();

    return (
        <>
            <Modal
                dialogClassName="modalWithBorder"
                show
                className={`${styles.modalContent} ${styles.confirmationModal}`}
                onHide={() => setShowDeleteConfirmation(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                    <Modal.Title>{confirmDeleteTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <p>{confirmDeleteMessage}</p>
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        {t('form.cancel')}
                    </Button>
                    {archive && confirmArchive &&
                        <Button variant="info" onClick={confirmArchive}>
                            {alreadyArchived ? t('form.unarchive') : t('form.archive')}
                        </Button>
                    }
                    <Button variant="danger" onClick={confirmDelete}>
                        {t('form.delete')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ConfirmDeleteDialog;