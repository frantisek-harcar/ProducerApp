import { Container } from "react-bootstrap";
import UnauthorizedView from "../components/UnauthorizedView";
import { useAuthenticatedUser } from "../network/users/usersWithCache";
import styles from "../styles/css/Layout.module.css";
import PaymentSuccessfulPageView from "../components/payments/PaymentSuccessfulPageView";

const PaymentSuccessfulPage = () => {
    const authenticatedUser = useAuthenticatedUser();

    return (
        <Container className={styles.container}>
            {authenticatedUser.user
                ? <PaymentSuccessfulPageView />
                : <UnauthorizedView />
            }
        </Container >
    );
}

export default PaymentSuccessfulPage;