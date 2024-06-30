import Container from "react-bootstrap/esm/Container";
import ProjectDetailView from "../components/projects/detail/ProjectDetailView";
import UnauthorizedView from "../components/UnauthorizedView";
import { useAuthenticatedUser } from "../network/users/usersWithCache";
import styles from "../styles/css/Layout.module.css";

const ProjectDetailPage = () => {

    const authenticatedUser = useAuthenticatedUser()

    return (
        <Container className={styles.container}>
            {authenticatedUser.user
                ? <ProjectDetailView />
                : <UnauthorizedView />
            }
        </Container>
    );
}

export default ProjectDetailPage;