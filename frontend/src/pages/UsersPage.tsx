import { Container } from "react-bootstrap";
import UnauthorizedView from "../components/UnauthorizedView";
import UserPageView from "../components/users/UserPageView";
import { useAuthenticatedUser } from "../network/users/usersWithCache";
import styles from "../styles/css/Layout.module.css";

const UsersPage = () => {
  const authenticatedUser = useAuthenticatedUser()

  return (
    <Container className={styles.container}>
      {authenticatedUser.user && authenticatedUser.user?.admin
        ? <UserPageView />
        : <UnauthorizedView />
      }
    </Container >
  );
}

export default UsersPage;