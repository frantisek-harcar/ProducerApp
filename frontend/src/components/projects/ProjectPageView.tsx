import { useState, useEffect, ReactNode } from 'react';
import { Button } from "react-bootstrap";
import AddEditProjectDialog from './AddEditProjectDialog';
import { FaPlus } from "react-icons/fa";
import Spinner from '../Spinner';
import styleUtils from "../../styles/css/utils.module.css";
import { Project as ProjectModel } from '../../models/project';
import { Tag as TagModel } from '../../models/tag';
import { User as UserModel } from '../../models/user';
import * as ProjectApi from "../../network/projects/project_api";
import ProjectAdmin from './ProjectAdmin';
import ProjectUser from './ProjectUser';
import { useTranslation } from 'react-i18next';
import styles from "../../styles/css/Table.module.css"
import { useAuthenticatedUser } from "../../network/users/usersWithCache";
import { useNavigate } from 'react-router-dom';
import Table from '../table/Table';
import TableRow from '../table/TableRow';
import TableRowItem from '../table/TableRowItem';
import { TableTypes } from '../const/tableTypes';
import TableHeadingRow from '../table/TableHeadingRow';
import { useProjects } from "../../network/projects/projectsWithCache";
import { useUsers } from "../../network/users/usersWithCache";
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import { OrderProjects } from '../const/orderProjects';
import ProjectToolbarComponent from './ProjectToolbarComponent';

const ProjectPageView = () => {
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const [archivedProjects, setArchivedProjects] = useState<ProjectModel[]>([]);

    const [nonArchivedProjects, setNonArchivedProjects] = useState<ProjectModel[]>([]);

    const [showArchivedProjects, setShowArchivedProjects] = useState(false);

    const [users, setUsers] = useState<UserModel[]>([]);

    const [projectsLoading, setProjectsLoading] = useState(true);

    const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);

    const [projectToEdit, setProjectToEdit] = useState<ProjectModel | null>(null);

    const [projectToDelete, setProjectToDelete] = useState<ProjectModel | null>(null);

    const authenticatedUser = useAuthenticatedUser();

    const projectsWithCache = useProjects();

    const usersWithCache = useUsers();

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [orderProjects, setOrderProjects] = useState(OrderProjects.CREATEDUPDATED);

    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        if (authenticatedUser.user?.admin && usersWithCache.users) {
            const cachedUsersToStateUser: UserModel[] = []
            usersWithCache.users.map((item) => (
                cachedUsersToStateUser.push(item)
            ))
            setUsers(cachedUsersToStateUser);
        }
    }, [authenticatedUser.user?.admin, usersWithCache.users])

    useEffect(() => {
        if (projectsWithCache.projects && users) {
            const nonArchivedProjects = projectsWithCache.projects.filter(item => !item.archived);
            const archivedProjects = projectsWithCache.projects.filter(item => item.archived);

            setProjects(sortProjectsByCreatedUpdated(nonArchivedProjects));
            setArchivedProjects(archivedProjects);
            setNonArchivedProjects(nonArchivedProjects);
            setProjectsLoading(false);
        }
    }, [projectsWithCache.projects, users])

    useEffect(() => {
        if (showArchivedProjects) {
            setProjects(archivedProjects);
        } else {
            setProjects(nonArchivedProjects);
        }
    }, [archivedProjects, nonArchivedProjects, showArchivedProjects])

    useEffect(() => {
        if (showArchivedProjects) {
            setProjects(archivedProjects);
        } else {
            setProjects(nonArchivedProjects);
        }
    }, [archivedProjects, nonArchivedProjects, showArchivedProjects])

    async function deleteProject(project: ProjectModel) {
        try {
            await ProjectApi.deleteProject(project._id);
            setProjects(projects.filter(existingProject => existingProject._id !== project._id))
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    function filterUser(projectUserId: string): UserModel | null {
        const foundUser = users.find(user => {
            return projectUserId === user._id
        })

        if (!foundUser) {
            return null;
        }

        return foundUser
    }

    function sortProjectsByUser(projects: ProjectModel[]): ProjectModel[] {
        projects.sort((a, b) => {
            const userIdA = typeof a.userId === 'string' ? parseInt(a.userId, 10) : a.userId;
            const userIdB = typeof b.userId === 'string' ? parseInt(b.userId, 10) : b.userId;
            return userIdA - userIdB;
        });
        return projects;
    }

    function sortProjectsByCreatedUpdated(projects: ProjectModel[]): ProjectModel[] {
        projects.sort((a, b) => {
            const timestampsA = [
                a.chatId ? +(new Date(a.chatId.updatedAt)) : 0,
                +(new Date(a.updatedAt)),
                +(new Date(a.createdAt))
            ];

            const timestampsB = [
                b.chatId ? +(new Date(b.chatId.updatedAt)) : 0,
                +(new Date(b.updatedAt)),
                +(new Date(b.createdAt))
            ];

            const mostRecentTimestampA = Math.max(...timestampsA);
            const mostRecentTimestampB = Math.max(...timestampsB);

            return mostRecentTimestampB - mostRecentTimestampA;
        });

        return projects;
    }

    const confirmDeleteProject = () => {
        if (projectToDelete) {
            setShowDeleteConfirmation(false);
            deleteProject(projectToDelete);
        }
    };

    const onDeleteProjectClicked = (project: ProjectModel) => {
        setProjectToDelete(project)
        setShowDeleteConfirmation(true);
    }

    const confirmArchiveProject = () => {
        if (projectToDelete) {
            setShowDeleteConfirmation(false)
            archiveProject(projectToDelete)
        }
    }

    async function archiveProject(project: ProjectModel) {
        try {
            await ProjectApi.archiveProject(project._id);
            setProjects(projects.filter(existingProject => existingProject._id !== project._id))
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const handleArchivedClick = () => {
        setShowArchivedProjects(!showArchivedProjects);
    };

    const onSortByUserClicked = () => {
        setOrderProjects(OrderProjects.USER);
        setProjects(sortProjectsByUser(projects));
    }

    const onSortByCreatedUpdatedClicked = () => {
        setOrderProjects(OrderProjects.CREATEDUPDATED);
        setProjects(sortProjectsByCreatedUpdated(projects));
    }

    const handleRowClick = (projectId: string) => {
        navigate(`/projectDetail/${projectId}`);
    }

    const handleTagModalSubmit = (rowId: string, updatedTags: TagModel[]) => {
        const tagIds = updatedTags.map((tag) => tag._id);
        ProjectApi.updateTags(rowId, tagIds);
    };

    const handleTagModalAdd = (rowId: string, newTag: TagModel) => {
        ProjectApi.updateTags(rowId, [newTag._id]);
    };


    const adminHeadingItems: ReactNode[] = [
        <TableRowItem key={t('tables.name')} item={t('tables.name')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.user')} item={t('tables.user')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.done')} item={t('tables.done')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.changes')} item={t('tables.changes')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.newMessages')} item={t('tables.newMessages')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.edit')} item={t('tables.edit')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.delete')} item={t('tables.delete')} type={TableTypes.CENTER} />
    ]

    const userHeadingItems: ReactNode[] = [
        <TableRowItem key={t('tables.name')} item={t('tables.name')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.done')} item={t('tables.done')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.newMessages')} item={t('tables.newMessages')} type={TableTypes.HEADING} />,
    ]

    const projectsGridAdmin =
        <>
            {projects &&
                <Table>
                    <TableHeadingRow item={adminHeadingItems} />
                    {projects.map((project) => (
                        <TableRow
                            key={project._id}
                            item={
                                <ProjectAdmin
                                    project={project}
                                    user={filterUser(project.userId)}
                                    onEditProjectClicked={setProjectToEdit}
                                    onDeleteProjectClicked={onDeleteProjectClicked}
                                />
                            }
                            showAddTagButton={true}
                            tags={project.tags}
                            itemRowId={project._id}
                            handleTagModalSubmit={(rowId, tagsFromModal) => handleTagModalSubmit(rowId, tagsFromModal)}
                            handleTagModalAdd={(rowId, newTag) => handleTagModalAdd(rowId, newTag)}
                            onRowClick={() => handleRowClick(project._id)}
                        />
                    ))}
                </Table>
            }
        </>
    const projectsGridUser =
        <>
            {projectsWithCache.projects &&
                <Table>
                    <TableHeadingRow item={userHeadingItems} />
                    {projectsWithCache.projects.map((project) => (
                        <TableRow
                            key={project._id}
                            item={
                                <ProjectUser
                                    project={project}
                                />
                            }
                            showAddTagButton={false}
                            tags={project.tags}
                            itemRowId={project._id}
                            handleTagModalSubmit={(rowId, tagsFromModal) => handleTagModalSubmit(rowId, tagsFromModal)}
                            handleTagModalAdd={(rowId, newTag) => handleTagModalAdd(rowId, newTag)}
                            onRowClick={() => handleRowClick(project._id)}

                        />
                    ))}
                </Table>
            }
        </>

    return (
        <>
            {projectsLoading &&
                <Spinner />
            }

            {projectsWithCache.projects?.length === 0 &&
                <p className={styleUtils.center}>{t('projects.thereAreNoProjects')}</p>
            }

            {!projectsLoading && projectsWithCache.projects?.length !== 0 &&
                <>
                    {authenticatedUser.user?.admin &&
                        <>
                            <Button
                                className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter} ${styleUtils.buttonColor}`}
                                onClick={() => setShowAddProjectDialog(true)}
                            >
                                <FaPlus className='me-2' />
                                {t('projects.addProject')}
                            </Button>

                            <ProjectToolbarComponent
                                handleArchivedClick={handleArchivedClick}
                                handleSortByCreatedUpdatedClick={onSortByCreatedUpdatedClicked}
                                handleSortByUserClick={onSortByUserClicked}
                                showArchivedProjects={showArchivedProjects}
                                orderProjects={orderProjects}
                            />
                            <>
                                <div className={styles.contentContainer}>
                                    {projectsGridAdmin}
                                </div>
                            </>
                        </>
                    }
                    {!authenticatedUser.user?.admin &&
                        <>
                            <div className={styles.contentContainer}>
                                {projectsGridUser}
                            </div>
                        </>
                    }
                </>
            }

            {showAddProjectDialog &&
                <AddEditProjectDialog
                    users={users}
                    onDismiss={() => setShowAddProjectDialog(false)}
                    onProjectSaved={(newProject) => {
                        setProjects([...projects, newProject])
                        setShowAddProjectDialog(false);
                    }}
                    onProjectDelete={ deleteProject }
                />
            }

            {projectToEdit &&
                <AddEditProjectDialog
                    projectToEdit={projectToEdit}
                    users={users}
                    onDismiss={() => setProjectToEdit(null)}
                    onProjectSaved={(updatedProject) => {
                        setProjects(projects.map(existingProject => existingProject._id === updatedProject._id ? updatedProject : existingProject));
                        setProjectToEdit(null)
                    }}
                    onProjectDelete={ deleteProject }
                />
            }

            {showDeleteConfirmation &&
                <ConfirmDeleteDialog
                    confirmDelete={confirmDeleteProject}
                    setShowDeleteConfirmation={setShowDeleteConfirmation}
                    confirmDeleteTitle={t('projects.confirmDeleteTitle')}
                    confirmDeleteMessage={t('projects.confirmDeleteMessage')}
                    archive={true}
                    confirmArchive={confirmArchiveProject}
                    alreadyArchived={projectToDelete?.archived}
                />
            }
        </>
    );
}

export default ProjectPageView;