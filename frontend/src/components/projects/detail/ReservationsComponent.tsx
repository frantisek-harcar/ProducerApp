import { useTranslation } from "react-i18next";
import styles from "../../../styles/css/ProjectDetail.module.css";
import styleUtils from "../../../styles/css/utils.module.css";
import { Reservation as ReservationModel } from "../../../models/reservation";
import { Project as ProjectModel } from '../../../models/project';
import { formatReservationDate } from "../../../utils/formatDate";
import { Button } from "react-bootstrap";
import { useAuthenticatedUser } from "../../../network/users/usersWithCache";
import { FaPlus } from "react-icons/fa";

interface ReservationsComponentProps {
    reservations: ReservationModel[],
    project: ProjectModel,
    handleReservationClick: (reservation: ReservationModel) => void,
    handleAddReservationClick: () => void,
}

const ReservationsComponent = ({ reservations, project, handleReservationClick, handleAddReservationClick }: ReservationsComponentProps) => {

    const authenticatedUser = useAuthenticatedUser();

    const { t } = useTranslation();

    return (
        <>
            <div className={`${styles.reservationsLabel} ${styleUtils.flexCenter}`}>
                {t('reservations.reservationsLabel')}

                {authenticatedUser.user?.admin &&
                    <Button
                        className={`${styleUtils.buttonColor} ${styleUtils.flexCenter} ms-3`}
                        onClick={() => handleAddReservationClick()}
                    >
                        <FaPlus />
                    </Button>
                }
            </div>
            <div className={styles.reservationColumn}>
                {reservations.filter((reservation) => (
                    reservation.userId === project?.userId && project.reservations.some((projectReservation) => projectReservation._id === reservation._id)
                )).length > 0 && (
                        <div className={`${styles.reservations}`}>
                            <>
                                {reservations
                                    .filter(
                                        (reservation) =>
                                            reservation.userId === project?.userId &&
                                            new Date(reservation.dateTo) > new Date()
                                    )
                                    .sort((a, b) =>
                                        new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
                                    )
                                    .map((reservation, index) => (
                                        <div key={index}>
                                            <div
                                                className={`${styles.reservation} ${styleUtils.blockCenter}`}
                                                onClick={() => handleReservationClick(reservation)}
                                            >
                                                <div className={styles.title}>{reservation.title}</div>
                                                <div className={styles.date}>
                                                    {formatReservationDate(
                                                        "" + reservation.dateFrom,
                                                        "" + reservation.dateTo
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </>
                        </div>
                    )}
            </div>
        </>
    );
}

export default ReservationsComponent;