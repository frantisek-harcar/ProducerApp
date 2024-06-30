import { useTranslation } from "react-i18next";
import { File as FileModel } from "../../models/file";
import { Project as ProjectModel } from "../../models/project";
import TableRowItem from "../table/TableRowItem";
import { MdDownload } from "react-icons/md";
import styleUtils from "../../styles/css/utils.module.css";
import { TableTypes } from "../const/tableTypes";
import { formatFileSize } from "../../utils/formatFileSize";

interface FileProps {
    file: FileModel,
    project: ProjectModel | undefined,
    onProjectClicked: (projectId: string) => void,
    className?: string,
}

const FileTableComponent = ({ file, onProjectClicked, project, className }: FileProps) => {

    const { t } = useTranslation();

    const {
        originalName,
        price,
        size,
    } = file

    return (
        <>
            <TableRowItem item={originalName} />
            <TableRowItem item={`${price.toLocaleString(navigator.language) + " " + t('general.currency')}`} />
            <TableRowItem item={`${formatFileSize(size)}`} type={TableTypes.CENTER} />
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
                </>
            {/* } */}
        </>
    );
}

export default FileTableComponent;