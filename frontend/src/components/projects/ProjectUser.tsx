import { Project as ProjectModel } from "../../models/project";
import { MdDone, MdClose } from "react-icons/md";
import TableRowItem from "../table/TableRowItem";
import { TableTypes } from "../const/tableTypes";
import { useEffect, useState } from "react";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";
import styles from "../../styles/css/Table.module.css"

interface ProjectUserProps {
    project: ProjectModel,
}

const ProjectUser = ({ project }: ProjectUserProps) => {
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
    const {
        name,
        isDone,
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

    return (
        <>
            <TableRowItem item={
                <div className={styles.rowItemClickable}>
                    {name}
                </div>}
            />
            <TableRowItem item={isDone ? <MdDone /> : <MdClose />} type={TableTypes.CENTER} />
            <TableRowItem item={
                <div className={unreadMessagesCount > 0 ? styles.unreadMessagesNumber : ""}>
                    {unreadMessagesCount}
                </div>
            } />
        </>
    )
}

export default ProjectUser;