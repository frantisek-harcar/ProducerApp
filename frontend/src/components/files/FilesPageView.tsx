import styleUtils from "../../styles/css/utils.module.css"
import { useTranslation } from "react-i18next";
import * as FileApi from "../../network/files/files_api"
import { File as FileModel } from "../../models/file";
import { User as UserModel } from '../../models/user';
import { Project as ProjectModel } from '../../models/project';
import { ReactNode, useEffect, useState } from "react";
import Spinner from "../Spinner";
import { useAuthenticatedUser, useUsers } from "../../network/users/usersWithCache";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import styles from "../../styles/css/Table.module.css";
import Table from '../table/Table';
import TableRow from '../table/TableRow';
import TableRowItem from '../table/TableRowItem';
import { TableTypes } from '../const/tableTypes';
import TableHeadingRow from '../table/TableHeadingRow';
import AddEditFileDialog from "./AddEditFileDialog";
import FileAdminTableComponent from "./FileAdminTableComponent";
import { useProjects } from "../../network/projects/projectsWithCache";
import { Tag as TagModel } from '../../models/tag';
import { useNavigate } from "react-router-dom";
import FileUserTableComponent from "./FileUserTableComponent";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

const FilesPageView = () => {

    const [files, setFiles] = useState<FileModel[]>([]);

    const [fileToEdit, setFileToEdit] = useState<FileModel | null>(null);

    const [fileToDelete, setFileToDelete] = useState<FileModel | null>(null);

    const [filesLoading, setFilesLoading] = useState(true);

    const [users, setUsers] = useState<UserModel[]>([]);

    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const [showAddFileDialog, setShowAddFileDialog] = useState(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { t } = useTranslation();

    const filesWithCache = FileApi.useFiles();

    const usersWithCache = useUsers();

    const projectsWithCache = useProjects();

    const authenticatedUser = useAuthenticatedUser();

    const navigate = useNavigate();

    useEffect(() => {
        if (filesWithCache.files) {
            const cachedFilesToState: FileModel[] = []
            filesWithCache.files.map((item) => (
                cachedFilesToState.push(item)
            ))
            setFiles(cachedFilesToState);
            setFilesLoading(false);
        }
    }, [filesWithCache.files])

    useEffect(() => {
        if (projectsWithCache.projects) {
            const cachedProjectsToState: ProjectModel[] = []
            projectsWithCache.projects.map((item) => (
                cachedProjectsToState.push(item)
            ))
            setProjects(cachedProjectsToState);
        }
    }, [projectsWithCache.projects])

    useEffect(() => {
        if (authenticatedUser.user?.admin && usersWithCache.users) {
            const cachedUsersToStateUser: UserModel[] = []
            usersWithCache.users.map((item) => (
                cachedUsersToStateUser.push(item)
            ))
            setUsers(cachedUsersToStateUser);
        }
    }, [authenticatedUser.user?.admin, usersWithCache.users])

    async function deleteFile(file: FileModel) {
        try {
            setFiles(files.filter(existingFile => existingFile._id !== file._id))
            await FileApi.deleteFile(file._id);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    function filterUser(fileUserId: string): UserModel | null {
        const foundUser = users.find(user => {
            return fileUserId === user._id
        })

        if (!foundUser) {
            return null;
        }

        return foundUser
    }

    const navigateToProject = (projectId: string) => {
        navigate(`/projectDetail/${projectId}`);
    }

    const adminHeadingItems: ReactNode[] = [
        <TableRowItem key={t('tables.name')} item={t('tables.name')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.createdByUser')} item={t('tables.createdByUser')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.price')} item={t('tables.price')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.size')} item={t('tables.size')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.project')} item={t('tables.project')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.download')} item={t('tables.download')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.edit')} item={t('tables.edit')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.delete')} item={t('tables.delete')} type={TableTypes.CENTER} />
    ]

    const userHeadingItems: ReactNode[] = [
        <TableRowItem key={t('tables.name')} item={t('tables.name')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.price')} item={t('tables.price')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.size')} item={t('tables.size')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.project')} item={t('tables.project')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.download')} item={t('tables.download')} type={TableTypes.CENTER} />,
    ]

    const handleRowClick = (fileId: string) => { }

    const handleTagModalSubmit = (rowId: string, updatedTags: TagModel[]) => {
        const tagIds = updatedTags.map((tag) => tag._id);
        FileApi.updateTags(rowId, tagIds);
    };

    const handleTagModalAdd = (rowId: string, newTag: TagModel) => {
        FileApi.updateTags(rowId, [newTag._id]);
    };

    const getProjectWithFile = (fileId: string) => {
        const projectWithFile = projects.find((project) =>
            project.files.includes(fileId)
        );

        return projectWithFile;
    };

    const confirmDeleteFile = () => {
        if (fileToDelete) {
            setShowDeleteConfirmation(false);
            deleteFile(fileToDelete);
        }
    };

    const onDeleteProjectClicked = (file: FileModel) => {
        setFileToDelete(file)
        setShowDeleteConfirmation(true);
    }

    const filesAdminGrid =
        <>
            {files && files.length > 0 &&
                <Table>
                    <TableHeadingRow item={adminHeadingItems} />
                    {files.map((file, index) => (
                        <TableRow
                            key={index}
                            item={
                                <FileAdminTableComponent
                                    file={file}
                                    user={filterUser(file.userId)}
                                    onEditFileClicked={setFileToEdit}
                                    onDeleteFileClicked={onDeleteProjectClicked}
                                    onProjectClicked={(projectId) => { navigateToProject(projectId) }}
                                    project={getProjectWithFile(file._id)}
                                />
                            }
                            showAddTagButton={true}
                            tags={file.tags}
                            handleTagModalSubmit={(rowId, tagsFromModal) => handleTagModalSubmit(rowId, tagsFromModal)}
                            handleTagModalAdd={(rowId, newTag) => handleTagModalAdd(rowId, newTag)}
                            className={styles.tableRow}
                            itemRowId={file._id}
                            onRowClick={() => handleRowClick(file._id)}
                        />
                    ))}
                </Table>
            }
        </>

    const filesUserGrid =
        <>
            {files && files.length > 0 &&
                <Table>
                    <TableHeadingRow item={userHeadingItems} />
                    {files.map((file, index) => (
                        <TableRow
                            key={index}
                            item={
                                <FileUserTableComponent
                                    file={file}
                                    onProjectClicked={(projectId) => { navigateToProject(projectId) }}
                                    project={getProjectWithFile(file._id)}
                                />
                            }
                            showAddTagButton={false}
                            tags={file.tags}
                            handleTagModalSubmit={(rowId, tagsFromModal) => handleTagModalSubmit(rowId, tagsFromModal)}
                            handleTagModalAdd={(rowId, newTag) => handleTagModalAdd(rowId, newTag)}
                            className={styles.tableRow}
                            itemRowId={file._id}
                            onRowClick={() => handleRowClick(file._id)}
                        />
                    ))}
                </Table>
            }
        </>

    return (
        <>
            {filesLoading &&
                <Spinner />
            }
            {!filesLoading && authenticatedUser.user?.admin &&
                <Button
                    className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter} ${styleUtils.buttonColor}`}
                    onClick={() => setShowAddFileDialog(true)}
                >
                    <FaPlus className='me-2' />
                    {t('files.addFile')}
                </Button>
            }

            {filesWithCache.files?.length === 0 && files.length < 1 &&
                <p className={styleUtils.center}>{t('files.thereAreNoFiles')}</p>
            }

            {!filesLoading && files.length !== 0 &&
                <>
                    {authenticatedUser.user?.admin &&
                        <div className={styles.contentContainer}>
                            {filesAdminGrid}
                        </div>
                    }

                    {!authenticatedUser.user?.admin &&
                        <div className={styles.contentContainer}>
                            {filesUserGrid}
                        </div>
                    }
                </>
            }

            {showAddFileDialog &&
                <AddEditFileDialog
                    projects={projects}
                    onDismiss={() => setShowAddFileDialog(false)}
                    onFileSaved={(newFile) => {
                        setFiles([...files, newFile])
                        setShowAddFileDialog(false);
                    }}
                    onFileDelete={deleteFile}
                />
            }

            {fileToEdit &&
                <AddEditFileDialog
                    fileToEdit={fileToEdit}
                    projects={projects}
                    onDismiss={() => setFileToEdit(null)}
                    onFileSaved={(newFile) => {
                        setFiles([...files, newFile])
                        setFileToEdit(null);
                    }}
                    onFileDelete={deleteFile}
                />
            }

            {showDeleteConfirmation &&
                <ConfirmDeleteDialog
                    confirmDelete={confirmDeleteFile}
                    setShowDeleteConfirmation={setShowDeleteConfirmation}
                    confirmDeleteTitle={t('files.confirmDeleteTitle')}
                    confirmDeleteMessage={t('files.confirmDeleteMessage')}
                />
            }
        </>
    );
}

export default FilesPageView;