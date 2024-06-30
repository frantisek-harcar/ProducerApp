import { Modal } from "react-bootstrap";
import { Reservation as ReservationModel } from "../../models/reservation";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import { Project as ProjectModel } from '../../models/project';
import { formatReservationDate } from "../../utils/formatDate";

interface InfoReservationDialogProps {
    projects: ProjectModel[],
    reservationToDisplay: ReservationModel,
    reservationToDisplayProjectId?: string,
    onDismiss: () => void,
}

const InfoReservationDialog = ({ projects, reservationToDisplay, reservationToDisplayProjectId, onDismiss }: InfoReservationDialogProps) => {

    const [project, setProject] = useState<ProjectModel | null>(null)
    // const [dateFrom, setDateFrom] = useState(new Date(Date.now()));
    // const [dateTo, setDateTo] = useState(new Date(Date.now()));

    const { t } = useTranslation();

    useEffect(() => {
        const reservationProject: ProjectModel | null | undefined = projects.find((project) =>
            project._id === reservationToDisplayProjectId
        );
        if (reservationProject) {
            setProject(reservationProject)
        }
        // setDateFrom(new Date(reservationToDisplay.dateFrom))
        // setDateTo(new Date(reservationToDisplay.dateTo))
    }, [projects, reservationToDisplay, reservationToDisplayProjectId])

    return (
        <>


            <Modal className={styles.modalContent} show onHide={onDismiss}>
                <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                    <Modal.Title>
                        {reservationToDisplay.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className={styles.modalBody}>
                    {project &&
                        <>
                            <div className={styleUtils.flex}>
                                <div className={`${styles.reservationLabel}`}>
                                    {t('reservations.reservationsProject')+":"}
                                </div>
                                <div className={styles.reservationProjectTitle}>{project.name}</div>
                            </div>
                            <div className={styleUtils.flex}>
                                <div className={styles.reservationLabel}>
                                    {t('reservations.reservationsDate')+":"}
                                </div>
                                <div className={styles.reservationDate}>
                                    {formatReservationDate(
                                        "" + reservationToDisplay.dateFrom,
                                        "" + reservationToDisplay.dateTo
                                    )}
                                    {reservationToDisplay.projectTitle}

                                </div>
                            </div>
                        </>
                    }

                </Modal.Body>
            </Modal>
        </>
    );
}

export default InfoReservationDialog;