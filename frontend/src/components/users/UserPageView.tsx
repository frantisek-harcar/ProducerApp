import { useState, useEffect, ReactNode } from 'react';
import { Button } from "react-bootstrap";
import AddEditUserDialog from './AddEditUserDialog';
import { FaPlus } from "react-icons/fa";
import styleUtils from "../../styles/css/utils.module.css";
import { User as UserModel } from '../../models/user';
import * as UserApi from "../../network/users/user_api";
import User from './User';
import { useTranslation } from 'react-i18next';
import styles from "../../styles/css/Table.module.css"
import Spinner from '../Spinner';
import Table from '../table/Table';
import TableRow from '../table/TableRow';
import TableHeadingRow from '../table/TableHeadingRow';
import TableRowItem from '../table/TableRowItem';
import { TableTypes } from '../const/tableTypes';
import { useUsers } from "../../network/users/usersWithCache";
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';

const UserPageView = () => {

    const { t } = useTranslation();

    const [users, setUsers] = useState<UserModel[]>([]);

    const [usersLoading, setUsersLoading] = useState(true);

    const [showAddUserDialog, setShowAddUserDialog] = useState(false);

    const [userToEdit, setUserToEdit] = useState<UserModel | null>(null)

    const [userToDelete, setUserToDelete] = useState<UserModel | null>(null)

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const usersWithCache = useUsers();

    useEffect(() => {
        if (usersWithCache.users) {
            const cachedUsersToStateUser: UserModel[] = []
            usersWithCache.users.map((item) => (
                cachedUsersToStateUser.push(item)
            ))
            setUsers(cachedUsersToStateUser);
            setUsersLoading(false)
        }
    }, [usersWithCache.users]);

    async function deleteUser(user: UserModel) {
        try {
            await UserApi.deleteUser(user._id);
            setUsers(users.filter(existingUser => existingUser._id !== user._id))
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const confirmDeleteUser = () => {
        if (userToDelete) {
            setShowDeleteConfirmation(false);
            deleteUser(userToDelete);
        }
    };

    const onDeleteUserClicked = (user: UserModel) => {
        setUserToDelete(user)
        setShowDeleteConfirmation(true);
    }

    const handleRowClick = (userId: string) => {
        // navigate(`/projectDetail/${projectId}`);
    }

    const adminHeadingItems: ReactNode[] = [
        <TableRowItem key={t('tables.nameUser')} item={t('tables.nameUser')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.email')} item={t('tables.email')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.changes')} item={t('tables.changes')} type={TableTypes.HEADING} />,
        <TableRowItem key={t('tables.edit')} item={t('tables.edit')} type={TableTypes.CENTER} />,
        <TableRowItem key={t('tables.delete')} item={t('tables.delete')} type={TableTypes.CENTER} />
    ]

    const usersGrid =
        <>
            <Table >
                <TableHeadingRow item={adminHeadingItems} />
                {users.map((user, index) => (
                    <TableRow
                        key={index}
                        item={
                            <User
                                user={user}
                                onEditUserClicked={setUserToEdit}
                                onDeleteUserClicked={onDeleteUserClicked}
                            />
                        }
                        showAddTagButton={false}
                        className={styles.tableRow}
                        itemRowId={user._id}
                        onRowClick={() => handleRowClick(user._id)}
                    />
                ))}
            </Table>
        </>

    return (
        <div>
            {usersLoading &&
                <Spinner />
            }
            {!usersLoading &&
                <>
                    <Button
                        className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter} ${styleUtils.buttonColor}`}
                        onClick={() => setShowAddUserDialog(true)}
                    >
                        <FaPlus className='me-2' />
                        {t('users.addUser')}
                    </Button>
                    <div className={styles.contentContainer}>
                        {
                            users.length > 0 ? usersGrid : <p>{t('users.thereAreNoUsers')}</p>
                        }
                    </div>
                </>
            }
            {showAddUserDialog &&
                <AddEditUserDialog
                    onDismiss={() => setShowAddUserDialog(false)}
                    onUserSaved={(newUser) => {
                        setUsers([...users, newUser])
                        setShowAddUserDialog(false);
                    }}
                />
            }
            {userToEdit &&
                <AddEditUserDialog
                    userToEdit={userToEdit}
                    onDismiss={() => setUserToEdit(null)}
                    onUserSaved={(updatedUser) => {
                        setUsers(users.map(existingUser => existingUser._id === updatedUser._id ? updatedUser : existingUser));
                        setUserToEdit(null)
                    }}
                />
            }

            {showDeleteConfirmation &&
                <ConfirmDeleteDialog
                    confirmDelete={confirmDeleteUser}
                    setShowDeleteConfirmation={setShowDeleteConfirmation}
                    confirmDeleteTitle={t('users.confirmDeleteTitle')}
                    confirmDeleteMessage={t('users.confirmDeleteMessage')}
                />
            }
        </div>
    );
}

export default UserPageView;