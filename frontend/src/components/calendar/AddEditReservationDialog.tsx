import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { Reservation as ReservationModel } from "../../models/reservation";
import TextInputField from "../form/TextInputField";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReservationsInput } from "../../network/reservations/reservations_api";
import DatePicker from "react-datepicker";
import cs from 'date-fns/locale/cs';
import en from 'date-fns/locale/en-GB';
import "react-datepicker/dist/react-datepicker.css";
import Select from "../form/Select";
import { Project as ProjectModel } from '../../models/project';
import * as ReservationApi from "../../network/reservations/reservations_api";
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import { StyleWrapperDatePicker } from "../../utils/calendarUtils";
import i18n from "../../i18n";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

interface AddEditReservationDialogProps {
    projects: ProjectModel[],
    currentProjectId?: string,
    reservationToEdit?: ReservationModel,
    reservationToEditProjectId?: string,
    onDismiss: () => void,
    onReservationSaved: (reservation: ReservationModel) => void,
    onReservationDelete?: (reservation: ReservationModel) => void,
    setReservationProjectId?: (projectId: string) => void
}

const AddEditReservationDialog = ({ projects, reservationToEdit, reservationToEditProjectId, currentProjectId, setReservationProjectId, onReservationDelete, onDismiss, onReservationSaved }: AddEditReservationDialogProps) => {

    const [errorText, setErrorText] = useState<string | null>(null)

    const [dateFrom, setDateFrom] = useState(new Date(Date.now()));
    const [dateTo, setDateTo] = useState(new Date(Date.now()));

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


    const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue } = useForm<ReservationsInput>({
        defaultValues: {
            title: reservationToEdit?.title || "",
            dateFrom: new Date(reservationToEdit?.dateFrom || new Date()),
            dateTo: new Date(reservationToEdit?.dateTo || new Date()),
            projectId: reservationToEditProjectId || currentProjectId || "",
        }
    });

    const { t } = useTranslation();

    useEffect(() => {
        if (reservationToEdit) {
            setDateFrom(new Date(reservationToEdit.dateFrom))
            setDateTo(new Date(reservationToEdit.dateTo))
        }
    }, [reservationToEdit])


    const handleChangeDateFrom = (dateChangeFrom: Date) => {
        setValue("dateFrom", dateChangeFrom, {
            shouldDirty: true
        });
        setDateFrom(dateChangeFrom);
    };

    const handleChangeDateTo = (dateChangeTo: Date) => {
        setValue("dateTo", dateChangeTo, {
            shouldDirty: true
        });
        setDateTo(dateChangeTo);
    };

    const handleDeleteReservation = () => {
        // if (onReservationDelete && reservationToEdit) {
        // setShowDeleteConfirmation(false);
        // onReservationDelete(reservationToEdit);
        // }
        setShowDeleteConfirmation(true);
    }

    const confirmDeleteReservation = () => {
        if (onReservationDelete && reservationToEdit) {
            setShowDeleteConfirmation(false);
            onReservationDelete(reservationToEdit);
        }
    };

    async function onSubmit(input: ReservationsInput) {
        try {
            let reservationResponse: ReservationModel;

            if (input.dateFrom && input.dateTo) {
                if (input.dateFrom < input.dateTo) {
                    const project: ProjectModel | null | undefined = projects.find((project) =>
                        project._id === input.projectId
                    );
                    if (project) {
                        if (setReservationProjectId) {
                            setReservationProjectId(project._id)
                        }
                        input.userId = project.userId;
                        if (reservationToEdit) {
                            reservationResponse = await ReservationApi.updateReservation(reservationToEdit._id, input);
                        } else {
                            reservationResponse = await ReservationApi.createReservation(input);
                        }
                        onReservationSaved(reservationResponse);
                    }
                } else {
                    throw new Error(`${t('error.invalidInput')}`);
                }

            } else {
                throw new Error(`${t('error.noDate')}`);
            }
        } catch (error) {
            if (error instanceof ConflictError || error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return (
        <>


            <Modal className={styles.modalContent} show onHide={onDismiss}>
                <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                    <Modal.Title>
                        {reservationToEdit ? t('reservations.editReservation') : t('reservations.addReservation')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className={styles.modalBody}>
                    {errorText &&
                        <Alert variant='danger'>
                            {errorText}
                        </Alert>
                    }
                    <Form id="addEditReservationForm" onSubmit={handleSubmit(onSubmit)}>
                        <TextInputField
                            name="title"
                            label={t('form.nameLabel')}
                            type="text"
                            placeholder={t('form.namePlaceholder')}
                            register={register}
                            registerOptions={{ required: "Required" }}
                            rules={{ required: "This field is required" }}
                            error={errors.title}
                        />
                        <label className="mb-3" htmlFor="dateTo">{t("form.selectDateFrom")}
                            <Controller
                                name="dateTo"
                                control={control}
                                defaultValue={dateFrom}
                                render={() => (
                                    <StyleWrapperDatePicker>
                                        <DatePicker
                                            className={styles.modalDatePicker}
                                            selected={dateFrom}
                                            placeholderText={`${t("form.selectDateFrom")}`}
                                            showTimeSelect
                                            timeCaption={`${t("form.timeCaption")}`}
                                            timeIntervals={30}
                                            timeFormat="HH:mm"
                                            dateFormat="dd.MM. HH:mm yyyy"
                                            onChange={handleChangeDateFrom}
                                            locale={i18n.language === "cs" ? cs : en}
                                        />
                                    </StyleWrapperDatePicker>
                                )}
                            />
                        </label>

                        <label className="mb-3" htmlFor="dateFrom">{t("form.selectDateTo")}
                            <Controller
                                name="dateFrom"
                                control={control}
                                defaultValue={dateTo}
                                render={() => (
                                    <StyleWrapperDatePicker>
                                        <DatePicker
                                            selected={dateTo}
                                            placeholderText={`${t("form.selectDateTo")}`}
                                            showTimeSelect
                                            timeCaption={`${t("form.timeCaption")}`}
                                            timeIntervals={30}
                                            timeFormat="HH:mm"
                                            dateFormat="dd.MM. HH:mm yyyy"
                                            onChange={handleChangeDateTo}
                                            locale={i18n.language === "cs" ? cs : en}
                                        />
                                    </StyleWrapperDatePicker>
                                )}
                            />
                        </label>

                        <Select
                            name="projectId"
                            label={t('form.projectLabel')}
                            items={
                                projects.map((project) => (
                                    { "id": project._id, "name": project.name }
                                ))
                            }
                            placeholder={t('form.projectPlaceholder')}
                            register={register}
                            registerOptions={{ required: "Required" }}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${styleUtils.width100} ${styleUtils.buttonColor}`}
                        >
                            {t('form.submit')}
                        </Button>
                    </Form>
                </Modal.Body>
                {reservationToEdit &&
                    <Modal.Footer className={styles.modalFooter}>
                        <Button
                            variant="danger"
                            className="mt-3"
                            onClick={handleDeleteReservation}
                        >
                            {t('form.delete')}
                        </Button>
                    </Modal.Footer>
                }
            </Modal>

            {showDeleteConfirmation &&
                <ConfirmDeleteDialog
                    confirmDelete={confirmDeleteReservation}
                    setShowDeleteConfirmation={setShowDeleteConfirmation}
                    confirmDeleteTitle={t('form.confirmDeleteTitle')}
                    confirmDeleteMessage={t('reservations.confirmDeleteMessage')}
                />
            }
        </>
    );
}

export default AddEditReservationDialog;