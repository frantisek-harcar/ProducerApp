import { Button } from "react-bootstrap";
import styleUtils from "../../styles/css/utils.module.css";
import styles from "../../styles/css/Calendar.module.css";
import { t } from "i18next";
import { OrderProjects } from "../const/orderProjects";

interface ProjectToolbarProps {
    handleArchivedClick: () => void,
    handleSortByCreatedUpdatedClick: () => void,
    handleSortByUserClick: () => void,
    showArchivedProjects: boolean,
    orderProjects: OrderProjects,
}

const ProjectToolbarComponent = ({ orderProjects, showArchivedProjects, handleSortByUserClick, handleArchivedClick, handleSortByCreatedUpdatedClick }: ProjectToolbarProps) => {

    return (
        <>
            <div className={styles.toolbarButtons}>
                <Button
                    key={t('projects.showArchived')}
                    className={showArchivedProjects ? `${styleUtils.btnBorderActive}` : `${styleUtils.btnBorder}`}
                    onClick={() => handleArchivedClick()}
                >
                    {t('projects.showArchived')}
                </Button>

                {/* <Button
                    key={t('projects.recentProjects')}
                    className={orderProjects === OrderProjects.CREATEDUPDATED ? `${styleUtils.btnBorderActive}` : `${styleUtils.btnBorder}`}
                    onClick={() => handleSortByCreatedUpdatedClick()}
                >
                    {t('projects.recentProjects')}
                </Button>

                <Button
                    key={t('projects.users')}
                    className={orderProjects === OrderProjects.USER ? `${styleUtils.btnBorderActive}` : `${styleUtils.btnBorder}`}
                    onClick={() => handleSortByUserClick()}
                >
                    {t('projects.users')}
                </Button> */}
            </div>
        </>
    );
}

export default ProjectToolbarComponent;