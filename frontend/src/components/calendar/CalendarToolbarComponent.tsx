import { Button } from "react-bootstrap";
import styleUtils from "../../styles/css/utils.module.css";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { CalendarViews } from '../const/calendarViews';
import styles from "../../styles/css/Calendar.module.css";
import { t } from "i18next";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";

interface CalendarToolbarProps {
    currentView: String,
    handleNextClick: () => void,
    handlePrevClick: () => void,
    handleWeekViewClick: () => void,
    handleDayViewClick: () => void,
    handleMonthViewClick: () => void,
    handleAddClick: () => void,
}

const CalendarToolbarComponent = ({ currentView, handleAddClick, handleNextClick, handlePrevClick, handleDayViewClick, handleWeekViewClick, handleMonthViewClick }: CalendarToolbarProps) => {

    const authenticatedUser = useAuthenticatedUser();

    return (
        <>
            <div className={styles.toolbarButtons}>
                {authenticatedUser.user?.admin &&
                    <Button
                        className={`${styleUtils.buttonColor} ${styleUtils.flexCenter}`}
                        onClick={() => handleAddClick()}
                    >
                        <FaPlus />
                    </Button>
                }

                <Button
                    className={`${styleUtils.btnTag} ${styleUtils.flexCenter}`}
                    onClick={() => handlePrevClick()}
                >
                    <FaChevronLeft
                        className={`${styleUtils.teal}`}
                    />
                </Button>

                <Button
                    className={`${styleUtils.btnTag} ${styleUtils.flexCenter}`}
                    onClick={() => handleNextClick()}
                >
                    <FaChevronRight
                        className={`${styleUtils.teal}`}
                    />
                </Button>

                <Button
                    className={currentView === CalendarViews.DAY ? `${styleUtils.btnBorderActive} ${styleUtils.flexCenter}` : `${styleUtils.btnBorder} ${styleUtils.flexCenter}`}
                    onClick={() => handleDayViewClick()}
                >
                    {t('reservations.day')}
                </Button>

                <Button
                    className={currentView === CalendarViews.WEEK ? `${styleUtils.btnBorderActive} ${styleUtils.flexCenter}` : `${styleUtils.btnBorder} ${styleUtils.flexCenter}`}
                    onClick={() => handleWeekViewClick()}
                >
                    {t('reservations.week')}
                </Button>

                <Button
                    className={currentView === CalendarViews.MONTH ? `${styleUtils.btnBorderActive} ${styleUtils.flexCenter}` : `${styleUtils.btnBorder} ${styleUtils.flexCenter}`}
                    onClick={() => handleMonthViewClick()}
                >
                    {t('reservations.month')}
                </Button>
            </div>
        </>
    );
}

export default CalendarToolbarComponent;