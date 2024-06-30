import { Container } from "react-bootstrap";
import ProjectPageView from "../components/projects/ProjectPageView";
import UnauthorizedView from "../components/UnauthorizedView";
import { useAuthenticatedUser } from "../network/users/usersWithCache";
import styles from "../styles/css/Layout.module.css";

const ProjectsPage = () => {
    const authenticatedUser = useAuthenticatedUser()

    return (
            <Container className={styles.container}>
                {authenticatedUser.user
                    ? <ProjectPageView />
                    : <UnauthorizedView />
                }
            </Container >
    );
}

export default ProjectsPage;