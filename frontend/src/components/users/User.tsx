import styleUtils from "../../styles/css/utils.module.css";
import { User as UserModel } from "../../models/user";
import { formatDate } from "../../utils/formatDate";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TableRowItem from "../table/TableRowItem";
import { TableTypes } from "../const/tableTypes";

interface UserProps {
    user: UserModel,
    onEditUserClicked: (user: UserModel) => void,
    onDeleteUserClicked: (user: UserModel) => void,
}

const User = ({ user, onEditUserClicked, onDeleteUserClicked }: UserProps) => {
    const {
        name,
        email,
        createdAt,
        updatedAt,
    } = user

    const { t } = useTranslation();

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = t('general.updated') + ": " + formatDate(updatedAt);
    } else {
        createdUpdatedText = t('general.created') + ": " + formatDate(createdAt);
    }

    return (
        <>
            <TableRowItem item={name} />
            <TableRowItem item={email} />
            <TableRowItem item={createdUpdatedText} />
            <TableRowItem
                item={
                    <MdModeEdit
                        className={`ms-auto ${styleUtils.clickable}`}
                        onClick={(e) => {
                            onEditUserClicked(user);
                            e.stopPropagation();
                        }}
                    />
                }
                type={TableTypes.CENTER}
            />
            {!user.admin &&
                <TableRowItem
                    item={
                        <MdDelete
                            className={`ms-auto ${styleUtils.clickable}`}
                            onClick={(e) => {
                                onDeleteUserClicked(user);
                                e.stopPropagation();
                            }}
                        />
                    }
                    type={TableTypes.CENTER}
                />
            }

        </>
    )
}

export default User;