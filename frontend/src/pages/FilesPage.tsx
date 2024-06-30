import { Container } from "react-bootstrap";
import FilesPageView from "../components/files/FilesPageView";
import UnauthorizedView from "../components/UnauthorizedView";
import { useAuthenticatedUser } from "../network/users/usersWithCache";
import styles from "../styles/css/Layout.module.css";

const FilesPage = () => {
    const authenticatedUser = useAuthenticatedUser();

    return (
        <Container className={styles.container}>
            {authenticatedUser.user
                ? <FilesPageView />
                : <UnauthorizedView />
            }
        </Container >
    );
}

export default FilesPage;