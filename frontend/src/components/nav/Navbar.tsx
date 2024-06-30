import { useEffect, useState } from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/css/Navbar.module.css';
// import NavBarLoggedInView from './NavBarLoggedInView';
import { Paths } from '../const/paths';
import { useTranslation } from 'react-i18next';
import { useAuthenticatedUser } from "../../network/users/usersWithCache";

interface NavbarProps {
    sidebar: boolean;
    showSidebar: () => void;
}

const Navbar = ({ sidebar, showSidebar }: NavbarProps) => {

    const location = useLocation();

    const [active, setActive] = useState(location.pathname);

    const { t } = useTranslation();

    const authenticatedUser = useAuthenticatedUser()

    // function onLogoutSuccessful() {
    //     authenticatedUser.mutateUser(null);
    // }

    useEffect(() => {
        if (active !== location.pathname) {
            setActive(location.pathname);
        }
    }, [active, location.pathname]);

    return (
        <>
            <IconContext.Provider value={{ color: "undefined" }}>
                <nav className={sidebar ? `${styles.navMenu} ${styles.active}` : `${styles.navMenu}`}>
                    <ul className={`${styles.navMenuItems}`}>
                        <li className={styles.navbarToggle}>
                            <Link to="#" className={styles.menuBars}>
                                <AiIcons.AiOutlineClose onClick={showSidebar} />
                            </Link>
                        </li>
                        <div className={styles.border}>
                            <li className={active === Paths.PROJECTS ? `${styles.navTextActive}` : `${styles.navText}`}>
                                <Link to={Paths.PROJECTS}>
                                    <span>{<FaIcons.FaFolderOpen />}</span>
                                    <span>{t('nav.projects')}</span>
                                </Link>
                            </li>
                            {authenticatedUser.user?.admin &&
                                <>
                                    <li className={active === Paths.USERS ? `${styles.navTextActive}` : `${styles.navText}`}>
                                        <Link to={Paths.USERS}>
                                            <span>{<FaIcons.FaUsers />}</span>
                                            <span>{t('nav.users')}</span>
                                        </Link>
                                    </li>


                                </>
                            }

                            <li className={active === Paths.FILES ? `${styles.navTextActive}` : `${styles.navText}`}>
                                <Link to={Paths.FILES}>
                                    <span>{<FaIcons.FaFile />}</span>
                                    <span>{t('nav.files')}</span>
                                </Link>
                            </li>
                            <li className={active === Paths.CALENDAR ? `${styles.navTextActive}` : `${styles.navText}`}>
                                <Link to={Paths.CALENDAR}>
                                    <span>{<FaIcons.FaCalendarAlt />}</span>
                                    <span>{t('nav.calendar')}</span>
                                </Link>
                            </li>

                            <li className={active === Paths.SETTINGS ? `${styles.navTextActive}` : `${styles.navText}`}>
                                <Link to={Paths.SETTINGS}>
                                    <span>{<FaIcons.FaCogs />}</span>
                                    <span>{t('nav.settings')}</span>
                                </Link>
                            </li>
                        </div>
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default Navbar;