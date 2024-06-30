import { Container } from "react-bootstrap";
import UnauthorizedView from "../components/UnauthorizedView";
import { useAuthenticatedUser } from "../network/users/usersWithCache";
import CalendarPageView from "../components/calendar/CalendarPageView";
import styles from "../styles/css/Layout.module.css";

const CalendarPage = () => {
    const authenticatedUser = useAuthenticatedUser();

    return (
        <Container className={styles.container}>
            {authenticatedUser.user
                ? <CalendarPageView />
                : <UnauthorizedView />
            }
        </Container >
    );
}

export default CalendarPage;