import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/css/Navbar.module.css';
import NavBarLoggedInView from './NavBarLoggedInView';
import { Paths } from '../const/paths';
import { useTranslation } from 'react-i18next';
import { useAuthenticatedUser } from '../../network/users/usersWithCache';
import * as FaIcons from 'react-icons/fa';

interface TopbarProps {
    showSidebar: () => void;
}

const TopBar = ({showSidebar}:TopbarProps) => {

    const authenticatedUser = useAuthenticatedUser()

    const location = useLocation();

    const { t } = useTranslation();

    function onLogoutSuccessful() {
        authenticatedUser.mutateUser(null);
    }

    function getPageName(path: string): string {
        switch (path) {
            case Paths.PROJECTS:
                return t('pages.projectsPageName');
            case Paths.USERS:
                return t('pages.usersPageName');
            case Paths.FILES:
                return t('pages.filesPageName');
            case Paths.CALENDAR:
                return t('pages.calendarPageName');
            case Paths.SETTINGS:
                return t('pages.settingsPageName');
            default:
                return t('pages.appName');
        }
    }

    return (
        <div className={styles.navbar}>
            <Link to="#" className={styles.menuBars}>
                <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            <div className={styles.pageTitle}>
                {getPageName(location.pathname)}
            </div>
            <div className={styles.logout}>
                {authenticatedUser.user &&
                    <NavBarLoggedInView onLogoutSuccessful={onLogoutSuccessful} />
                }
            </div>
        </div>
    );
}

export default TopBar;