import styleUtils from "../../styles/css/utils.module.css";
import { Project as ProjectModel } from "../../models/project";
import { User as UserModel } from '../../models/user';
import { formatDate } from "../../utils/formatDate";
import { MdDelete, MdModeEdit, MdDone, MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TableRowItem from "../table/TableRowItem";
import { TableTypes } from "../const/tableTypes"
import { useEffect, useState } from "react";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";
import styles from "../../styles/css/Table.module.css"

interface ProjectProps {
    project: ProjectModel,
    user: UserModel | null,
    onEditProjectClicked: (project: ProjectModel) => void,
    onDeleteProjectClicked: (project: ProjectModel) => void,
    className?: string,
}

const Project = ({ project, user, onEditProjectClicked, onDeleteProjectClicked, className }: ProjectProps) => {

    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

    const { t } = useTranslation();

    const {
        name,
        isDone,
        createdAt,
        updatedAt,
    } = project

    const authenticatedUser = useAuthenticatedUser();

    useEffect(() => {
        if (project && project.chatId.messages && project.chatId.messages.length > 0 && authenticatedUser.user) {
            const projectUnreadMessages = project.chatId.messages.filter(
                (message) =>
                    message.status === 'unread' &&
                    message.recipientId === authenticatedUser.user?._id
            );

            setUnreadMessagesCount(projectUnreadMessages.length);
        }
    }, [project, authenticatedUser.user?._id, authenticatedUser.user]);

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = t('general.updated') + ": " + formatDate(updatedAt);
    } else {
        createdUpdatedText = t('general.created') + ": " + formatDate(createdAt);
    }

    return (
        <>
            <TableRowItem item={
                <div className={styles.rowItemClickable}>
                    {name}
                </div>
            }
            />
            <TableRowItem item={user?.email ?? t('general.userNotFound')} />
            <TableRowItem item={isDone ? <MdDone /> : <MdClose />} type={TableTypes.CENTER} />
            <TableRowItem item={createdUpdatedText} />
            <TableRowItem item={
                <div className={unreadMessagesCount > 0 ? styles.unreadMessagesNumber : ""}>
                    {unreadMessagesCount}
                </div>
            } />
            <TableRowItem
                item={
                    <MdModeEdit
                        className={`ms-auto ${styleUtils.clickable}`}
                        onClick={(e) => {
                            onEditProjectClicked(project);
                            e.stopPropagation();
                        }}
                    />
                }
                type={TableTypes.CENTER}
            />
            <TableRowItem
                item={
                    <MdDelete
                        className={`ms-auto ${styleUtils.clickable}`}
                        onClick={(e) => {
                            onDeleteProjectClicked(project);
                            e.stopPropagation();
                        }}
                    />
                }
                type={TableTypes.CENTER}
            />
        </>
    )
}

export default Project;