import { useTranslation } from "react-i18next";
import { File as FileModel } from "../../models/file";
import { User as UserModel } from "../../models/user";
import { Project as ProjectModel } from "../../models/project";
import TableRowItem from "../table/TableRowItem";
import { MdDelete, MdDownload, MdModeEdit } from "react-icons/md";
import styleUtils from "../../styles/css/utils.module.css";
import { TableTypes } from "../const/tableTypes";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";
import { formatFileSize } from "../../utils/formatFileSize";

interface FileProps {
    file: FileModel,
    user: UserModel | null,
    project: ProjectModel | undefined,
    onEditFileClicked: (file: FileModel) => void,
    onDeleteFileClicked: (file: FileModel) => void,
    onProjectClicked: (projectId: string) => void,
    className?: string,
}

const FileAdminTableComponent = ({ file, user, onEditFileClicked, onDeleteFileClicked, onProjectClicked, project, className }: FileProps) => {

    const { t } = useTranslation();

    const authenticatedUser = useAuthenticatedUser();

    const {
        originalName,
        price,
        size,
    } = file

    return (
        <>
            <TableRowItem item={originalName} />
            <TableRowItem item={user?.email || t('general.userNotFound')} />
            <TableRowItem item={`${price.toLocaleString(navigator.language) + " " + t('general.currency')}`} />
            <TableRowItem item={`${formatFileSize(size)}`} type={TableTypes.CENTER} />

            {authenticatedUser.user?.admin &&
                <>
                    {project &&
                        <TableRowItem
                            item={
                                <div
                                    className={`ms-auto ${styleUtils.clickableText}`}
                                    onClick={(e) => {
                                        onProjectClicked(project?._id);
                                        e.stopPropagation();
                                    }}>
                                    {project?.name}
                                </div>
                            }
                        />
                    }
                    <TableRowItem
                        item={
                            <a href={file.downloadLink} target="_blank" rel="noreferrer" className={styleUtils.lightText}>
                                <MdDownload />
                            </a>
                        }
                        type={TableTypes.CENTER}
                    />
                    <TableRowItem
                        item={
                            <MdModeEdit
                                className={`ms-auto ${styleUtils.clickable}`}
                                onClick={(e) => {
                                    onEditFileClicked(file);
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
                                    onDeleteFileClicked(file);
                                    e.stopPropagation();
                                }}
                            />
                        }
                        type={TableTypes.CENTER}
                    />
                </>
            }
        </>
    );
}

export default FileAdminTableComponent;