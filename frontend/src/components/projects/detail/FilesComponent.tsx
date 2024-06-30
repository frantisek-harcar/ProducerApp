import { useTranslation } from "react-i18next";
import styles from "../../../styles/css/ProjectDetail.module.css";
import styleUtils from "../../../styles/css/utils.module.css";
import { User as UserModel } from "../../../models/user";
import { Project as ProjectModel } from '../../../models/project';
import { File as FileModel } from '../../../models/file';
import { Button } from "react-bootstrap";
import { useAuthenticatedUser } from "../../../network/users/usersWithCache";
import { FaPlus } from "react-icons/fa";
import FileSingleComponent from "../../files/FileSingleComponent";
import { filterUser } from "../../../utils/filterUser";

interface FilesComponentProps {
    files: FileModel[],
    project: ProjectModel,
    users: UserModel[],
    handleFileClick: (file: FileModel) => void,
    handleShowAddFileDialog: () => void,
}

const FilesComponent = ({ project, files, users, handleFileClick, handleShowAddFileDialog }: FilesComponentProps) => {
    const { t } = useTranslation();
    const authenticatedUser = useAuthenticatedUser();
    return (
        <>
            <div className={`${styles.fileSidebar}`}>
                <>
                    {
                        files.filter((file) => (
                            project?.files.includes(file._id))
                        ).map((file, index) => (
                            <div key={index}>
                                <FileSingleComponent
                                    file={file}
                                    user={filterUser(file.userId, users)}
                                    onEditFileClicked={(file)=>{handleFileClick(file)}}
                                />
                            </div>
                        ))
                    }
                    {authenticatedUser.user?.admin &&
                        <Button
                            className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter} ${styleUtils.buttonColor} ${styleUtils.width75}`}
                            onClick={handleShowAddFileDialog}
                        >
                            <FaPlus className='me-2' />
                            {t('files.addFile')}
                        </Button>
                    }
                </>
            </div>
        </>
    );
}

export default FilesComponent;