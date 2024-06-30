import Container from "react-bootstrap/esm/Container";
import SettingsPageView from "../components/settings/SettingsPageView";
import UnauthorizedView from "../components/UnauthorizedView";
import styleUtils from "../styles/css/utils.module.css";
import styles from "../styles/css/Layout.module.css";
import { useAuthenticatedUser } from "../network/users/usersWithCache";

const SettingsPage = () => {
    const authenticatedUser = useAuthenticatedUser()
    return (
        <Container className={styles.container}>
            {authenticatedUser.user
                ? <div className={`${styleUtils.blockCenter} ${styleUtils.flexCenter}`}>
                    <SettingsPageView />
                </div>
                : <UnauthorizedView />
            }
        </Container>
    );
}

export default SettingsPage;