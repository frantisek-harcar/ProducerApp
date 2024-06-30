import { useEffect, useState } from "react";
import styles from "../../../styles/css/Timer.module.css";
import { Button } from "react-bootstrap";
import { formatTime } from "../../../utils/formatTime";
import { useTranslation } from "react-i18next";

const Timer = () => {
    const [startTimer, setStartTimer] = useState<boolean>(false);
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

    const { t } = useTranslation();

    useEffect(() => {
        let intervalId: NodeJS.Timer | undefined;

        if (startTimer) {
            intervalId = setInterval(() => {
                setElapsedSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [startTimer]);

    const handleStartTimerClick = () => {
        setStartTimer(!startTimer);
    };


    return (
        <>
            <div className={styles.timer}>
                <div className={styles.workedTimeLabel}>
                    {t('timer.timeLabel')}
                </div>
                <div className={styles.workedTime}>
                    <div className={styles.workedTimeNumber}>
                        {formatTime(elapsedSeconds)}
                    </div>
                </div>
                <div>
                    <Button
                        className={startTimer ? styles.workedTimeButtonStop : styles.workedTimeButtonStart}
                        onClick={handleStartTimerClick}
                    >
                        {startTimer ? t('timer.stop') : t('timer.start')}
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Timer;