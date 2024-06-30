import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";
import styles from "../../../styles/css/ProjectDetail.module.css";
import styleUtils from "../../../styles/css/utils.module.css";
import { Project as ProjectModel } from '../../../models/project';
import { File as FileModel } from "../../../models/file";
import { User as UserModel } from "../../../models/user";
import { PaymentItem as PaymentItemModel } from "../../../models/paymentItem";
import { Reservation as ReservationModel } from "../../../models/reservation";
import { ConflictError, UnauthorizedError } from "../../../errors/http_errors";
import { useAuthenticatedUser, useUsers } from "../../../network/users/usersWithCache";
import { useProjects } from "../../../network/projects/projectsWithCache";
import { useFiles } from "../../../network/files/files_api";
import { usePaymentItems } from "../../../network/paymentItems/paymentItems_api";
import { useReservations } from "../../../network/reservations/reservations_api";
import * as ProjectApi from "../../../network/projects/project_api";
import * as FileApi from "../../../network/files/files_api"
import * as ReservationApi from "../../../network/reservations/reservations_api";
import * as PaymentItemsApi from "../../../network/paymentItems/paymentItems_api";
import AddEditFileDialog from "../../files/AddEditFileDialog";
import PaymentsDialog from "../../payments/PaymentsDialog";
import AddEditPaymentItemDialog from "../../payments/AddEditPaymentItemDialog";
import PaymentItemsDialog from "../../payments/PaymentItemsDialog";
import ReservationsComponent from "./ReservationsComponent";
import PaymentItemsComponent from "./PaymentItemsComponent";
import AddEditReservationDialog from "../../calendar/AddEditReservationDialog";
import Chat from "./Chat";
import Spinner from "../../Spinner";
import FilesComponent from "./FilesComponent";

const ProjectDetailView = () => {

    const [project, setProject] = useState<ProjectModel>();

    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const [paymentItems, setPaymentItems] = useState<PaymentItemModel[]>([]);

    const [reservations, setReservations] = useState<ReservationModel[]>([]);

    const [showAddEditReservationDialog, setShowAddEditReservationDialog] = useState<boolean>(false);

    const [reservationToEdit, setReservationToEdit] = useState<ReservationModel | null>(null);

    const [paymentItemToEdit, setPaymentItemToEdit] = useState<PaymentItemModel | null>(null);

    const [users, setUsers] = useState<UserModel[]>([]);

    const [files, setFiles] = useState<FileModel[]>([]);

    const [fileToEdit, setFileToEdit] = useState<FileModel | null>(null);

    const [projectLoading, setProjectLoading] = useState(true);

    const [errorText, setErrorText] = useState<string | null>(null);

    const [showAddFileDialog, setShowAddFileDialog] = useState(false);

    const [showAddPaymentItemDialog, setShowAddPaymentItemDialog] = useState(false);

    const [showPaymentItemsDialog, setShowPaymentItemsDialog] = useState(false);

    const [showPaymentsDialog, setShowPaymentsDialog] = useState(false);

    const { id } = useParams();

    const authenticatedUser = useAuthenticatedUser();

    const projectsWithCache = useProjects();

    const filesWithCache = useFiles();

    const usersWithCache = useUsers();

    const paymentItemsByProjectWithCache = usePaymentItems();

    const reservationItemsByProjectWithCache = useReservations();

    const navigate = useNavigate();

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
        if (usersWithCache.users) {
            const cachedUsersToStateUser: UserModel[] = []
            usersWithCache.users.map((item) => (
                cachedUsersToStateUser.push(item)
            ))
            setUsers(cachedUsersToStateUser);
        }
    }, [usersWithCache.users])


    useEffect(() => {
        if (filesWithCache.files) {
            const cachedFilesToState: FileModel[] = []
            filesWithCache.files.map((item) => (
                cachedFilesToState.push(item)
            ))

            setFiles(cachedFilesToState);
        }
    }, [filesWithCache.files, project?.files])

    useEffect(() => {
        async function getProject() {
            if (id) {
                try {
                    setErrorText(null);
                    setProjectLoading(true);
                    const project = await ProjectApi.fetchProject(id);
                    setProject(project);
                } catch (error) {
                    if (error instanceof ConflictError || error instanceof UnauthorizedError) {
                        setErrorText(error.message);
                    } else {
                        alert(error);
                    }
                    console.error(error);
                } finally {
                    setProjectLoading(false);
                }
            }
        }
        getProject();
    }, [id]);

    useEffect(() => {
        async function getPaymentItems() {
            if (id) {
                if (paymentItemsByProjectWithCache.paymentItems) {
                    const cachedPaymentItemsToState: PaymentItemModel[] = []
                    paymentItemsByProjectWithCache.paymentItems.map((item) => (
                        cachedPaymentItemsToState.push(item)
                    ))
                    setPaymentItems(cachedPaymentItemsToState);
                }
            }
        }
        getPaymentItems();
    }, [id, paymentItemsByProjectWithCache.paymentItems]);

    useEffect(() => {
        async function getReservations() {
            if (id) {
                if (reservationItemsByProjectWithCache.reservations) {
                    const cachedReservationsToState: ReservationModel[] = []
                    reservationItemsByProjectWithCache.reservations.map((item) => (
                        cachedReservationsToState.push(item)
                    ))
                    setReservations(cachedReservationsToState);
                }
            }
        }
        getReservations();
    }, [id, reservationItemsByProjectWithCache.reservations]);

    function getRecipient(userId: string): UserModel | undefined {
        const recipients = users.filter((user) => (
            user._id === userId
        ))
        if (recipients.length > 0) {
            return recipients[0]
        } else {
            return undefined
        }
    }

    function getAdmin(): UserModel {
        const recipients = users.filter((user) => (
            user.admin === true
        ))
        return recipients[0]
    }

    const handleAddReservationClick = () => {
        if (authenticatedUser.user?.admin) {
            setShowAddEditReservationDialog(true);
        }
    };

    const handleReservationClick = (reservation: ReservationModel) => {
        if (authenticatedUser.user?.admin) {
            if (project) {
                setReservationToEdit(reservation);
                // setReservationProjectId(project?._id)
            }
        }
    };

    const handlePaymentItemClick = (paymentItem: PaymentItemModel) => {
        if (authenticatedUser.user?.admin) {
            if (project) {
                setPaymentItemToEdit(paymentItem);
            }
        }
    };

    async function deleteFile(file: FileModel) {
        try {
            await FileApi.deleteFile(file._id);
            setFiles(files.filter(existingFile => existingFile._id !== file._id));
            setFileToEdit(null);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function deleteReservation(reservation: ReservationModel) {
        try {
            await ReservationApi.deleteReservation(reservation._id);
            setReservations(reservations.filter(existingReservation => existingReservation._id !== reservation._id));
            setReservationToEdit(null);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function deletePaymentItem(paymentItem: PaymentItemModel) {
        try {
            await PaymentItemsApi.deletePaymentItem(paymentItem._id);
            setPaymentItems(paymentItems.filter(existingPaymentItem => existingPaymentItem._id !== paymentItem._id))
            setPaymentItemToEdit(null)
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <>
            {!id &&
                navigate("/")
            }

            {errorText &&
                <Alert variant='danger'>
                    {errorText}
                </Alert>
            }

            {projectLoading &&
                <Spinner />
            }

            {id && !projectLoading && project &&
                <>
                    <h2 className={`${styles.projectName}`}>{project.name ?? ""}</h2>

                    <div className={styles.contentContainer}>
                        <Row className={styleUtils.width100}>
                            <Col xs="12" md="12" lg="2">
                                {project?.reservations.length > 0 && reservations.length > 0 &&
                                    <>
                                        <ReservationsComponent
                                            reservations={reservations}
                                            project={project}
                                            handleReservationClick={(clickedReservation) => { handleReservationClick(clickedReservation) }}
                                            handleAddReservationClick={() => { handleAddReservationClick() }}
                                        />
                                    </>
                                }
                            </Col>

                            <Col xs="12" md="12" lg="7">
                                <div className={styles.chatContainer}>
                                    <Chat
                                        projectId={id}
                                        recipient={project?.userId === authenticatedUser.user?._id ? getAdmin() : getRecipient(project?.userId!)}
                                        projectUserId={project!.userId}
                                    />
                                </div>
                            </Col>

                            <Col xs="12" md="12" lg="3" className={styles.filesContainer}>
                                <PaymentItemsComponent
                                    paymentItems={paymentItems}
                                    files={files}
                                    project={project}
                                    handlePaymentItemCLick={(clickedPaymentItem) => { handlePaymentItemClick(clickedPaymentItem) }}
                                    handleShowPaymentsDialog={() => { setShowPaymentsDialog(true) }}
                                    handleShowPaymentItemsDialog={() => { setShowPaymentItemsDialog(true) }}
                                    handleShowAddPaymentItemsDialog={() => { setShowAddPaymentItemDialog(true) }}
                                />

                                <FilesComponent
                                    files={files}
                                    project={project}
                                    users={users}
                                    handleFileClick={(file) => { setFileToEdit(file) }}
                                    handleShowAddFileDialog={() => { setShowAddFileDialog(true) }}
                                />
                            </Col>
                        </Row>
                    </div>
                </>
            }

            {showAddFileDialog &&
                <AddEditFileDialog
                    projects={projects.filter((project) => (
                        project._id === id
                    ))}
                    onDismiss={() => setShowAddFileDialog(false)}
                    onFileSaved={(newFile) => {
                        setFiles([...files, newFile]);
                        setShowAddFileDialog(false);
                    }}
                    onFileDelete={ deleteFile }
                    fromProjectDetail = { true }
                />
            }

            {fileToEdit &&
                <AddEditFileDialog
                    projects={projects}
                    fileToEdit={fileToEdit}
                    onDismiss={() => setFileToEdit(null)}
                    onFileSaved={(newFile) => {
                        setFiles([...files, newFile])
                        setFileToEdit(null);
                    }}
                    onFileDelete={ deleteFile }
                    fromProjectDetail = { true }
                />
            }

            {showAddPaymentItemDialog &&
                <AddEditPaymentItemDialog
                    projectId={id!}
                    onDismiss={() => setShowAddPaymentItemDialog(false)}
                    onPaymentItemSaved={(newPaymentItem) => {
                        setPaymentItems([...paymentItems, newPaymentItem])
                        paymentItems.sort((a, b) => (a.isPaid === b.isPaid ? 0 : a.isPaid ? 1 : -1))
                        setShowAddPaymentItemDialog(false);
                    }}
                    onPaymentItemDelete={deletePaymentItem}
                />
            }

            {paymentItemToEdit &&
                <AddEditPaymentItemDialog
                    projectId={id!}
                    onDismiss={() => setPaymentItemToEdit(null)}
                    paymentItemToEdit={paymentItemToEdit}
                    onPaymentItemSaved={(updatedPaymentItem) => {
                        setPaymentItems(paymentItems.map(existingPaymentItem => existingPaymentItem._id === updatedPaymentItem._id ? updatedPaymentItem : existingPaymentItem));
                        setPaymentItemToEdit(null)
                        paymentItems.sort((a, b) => (a.isPaid === b.isPaid ? 0 : a.isPaid ? 1 : -1))
                        setPaymentItemToEdit(null);
                    }}
                    onPaymentItemDelete={deletePaymentItem}
                />
            }

            {showPaymentsDialog &&
                <PaymentsDialog
                    paymentItems={paymentItems.filter((paymentItem) => (
                        paymentItem.projectId === project?._id && !paymentItem.isPaid && paymentItem.price > 0
                    ))}
                    files={
                        files.filter((file) => (
                            project?.files.includes(file._id) && !file.isPaid)
                        )}
                    onDismiss={() => setShowPaymentsDialog(false)}
                    onPaymentConfirmed={() => {

                    }}
                />
            }

            {showPaymentItemsDialog &&
                <PaymentItemsDialog
                    paymentItems={paymentItems.filter((paymentItem) => (
                        paymentItem.projectId === project?._id
                    ))}
                    files={
                        files.filter((file) => (
                            project?.files.includes(file._id))
                        )}
                    onDismiss={() => setShowPaymentItemsDialog(false)}
                />
            }

            {reservationToEdit &&
                <>
                    <AddEditReservationDialog
                        onDismiss={() => setReservationToEdit(null)}
                        onReservationSaved={(updatedEvent) => {
                            setReservations(reservations.map(existingReservation => existingReservation._id === updatedEvent._id ? updatedEvent : existingReservation));
                            setReservationToEdit(null)
                        }}
                        projects={projects}
                        reservationToEdit={reservationToEdit}
                        reservationToEditProjectId={project?._id}
                        onReservationDelete={deleteReservation}
                    // setReservationProjectId={setReservationProjectId}
                    />
                </>
            }

            {showAddEditReservationDialog &&
                <>
                    <AddEditReservationDialog
                        onDismiss={() => setShowAddEditReservationDialog(false)}
                        onReservationSaved={(newReservation) => {
                            setReservations([...reservations, newReservation]);
                            setShowAddEditReservationDialog(false);
                        }}
                        projects={projects}
                        currentProjectId={project?._id}
                        onReservationDelete={deleteReservation}
                    // setReservationProjectId={setReservationProjectId}
                    />
                </>
            }
        </>
    );
}

export default ProjectDetailView;