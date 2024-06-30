import { Outlet, useLocation } from "react-router-dom";
import { useAuthenticatedUser } from "../network/users/usersWithCache";
import Footer from "./footer/Footer";
import Navbar from "./nav/Navbar";
import styles from "../styles/css/Layout.module.css";
import TopBar from "./nav/TopBar";
import { useState } from "react";

const AppLayout = () => {
    const location = useLocation();
    const authenticatedUser = useAuthenticatedUser();

    const [sidebar, setSidebar] = useState(true);

    const showSidebar = () => setSidebar(!sidebar);
    return (
        <>
            {(location.pathname !== "/" && authenticatedUser.user) &&
                <TopBar showSidebar={showSidebar} />
            }

            <div className={styles.pageContainer}>
                <div className={styles.sidebar}>
                    {(location.pathname !== "/" && authenticatedUser.user) &&
                        <Navbar sidebar={sidebar}
                            showSidebar={showSidebar}
                        />
                    }
                </div>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>

            {(location.pathname !== "/" && authenticatedUser.user) &&
                <Footer />
            }
        </>
    );
}

export default AppLayout;