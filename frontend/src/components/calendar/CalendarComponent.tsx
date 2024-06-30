import FullCalendar from "@fullcalendar/react"
import timeGridWeek from "@fullcalendar/timegrid"
import timeGridDay from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import csLocale from "@fullcalendar/core/locales/cs";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/css/Calendar.module.css";
import CalendarToolbarComponent from "./CalendarToolbarComponent";
import { CalendarViews } from '../const/calendarViews';
import { DatesSetArg, ViewMountArg } from "@fullcalendar/core";
import AddEditReservationDialog from "./AddEditReservationDialog";
import { useProjects } from "../../network/projects/projectsWithCache";
import { Project as ProjectModel } from '../../models/project';
import { Reservation as ReservationModel } from '../../models/reservation';
import Spinner from "../Spinner";
import { reservationsToEvents } from "../../utils/calendarUtils";
import { useReservations } from "../../network/reservations/reservations_api";
import * as ReservationApi from "../../network/reservations/reservations_api";
import i18n from "../../i18n";
import { t } from "i18next";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";
import InfoReservationDialog from "./InfoReservationDialog";

const CalendarComponent = () => {

    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const [reservations, setReservations] = useState<ReservationModel[]>([]);

    const [projectsLoading, setProjectsLoading] = useState(true);

    const [reservationsLoading, setReservationsLoading] = useState(true);

    const calendar = useRef<FullCalendar | null>(null);

    const [currentView, setCurrentView] = useState<String>(CalendarViews.WEEK);

    const [showAddEditReservationDialog, setShowAddEditReservationDialog] = useState<boolean>(false);

    const [reservationToEdit, setReservationToEdit] = useState<ReservationModel | null | undefined>(null);

    const [reservationToDisplay, setReservationToDisplay] = useState<ReservationModel | null | undefined>(null);

    const [reservationProjectId, setReservationProjectId] = useState<string>("");

    const projectsWithCache = useProjects();

    const reservationsWithCache = useReservations();

    const authenticatedUser = useAuthenticatedUser();

    useEffect(() => {
        if (projectsWithCache.projects) {
            const cachedProjectsToStateProjects: ProjectModel[] = []
            projectsWithCache.projects.map((item) => (
                cachedProjectsToStateProjects.push(item)
            ))
            setProjects(cachedProjectsToStateProjects);
            setProjectsLoading(false);
        }
    }, [projectsWithCache.projects])

    useEffect(() => {
        if (reservationsWithCache.reservations) {
            const cachedReservationsToStateReservations: ReservationModel[] = []
            reservationsWithCache.reservations.map((item) => (
                cachedReservationsToStateReservations.push(item)
            ))
            setReservations(cachedReservationsToStateReservations);
            setReservationsLoading(false);
        }
    }, [reservationsWithCache.reservations])

    useEffect(() => {
        if (calendar.current) {
            const currentView = calendar.current.getApi().view;
            setCurrentView(currentView.type);
        }
    }, []);

    const handleViewChange = (viewInfo: ViewMountArg) => {
        setCurrentView(viewInfo.view.type);
    };
    const handleViewChangeDate = (viewInfo: DatesSetArg) => {
        setCurrentView(viewInfo.view.type);
    };

    const handleNextClick = () => {
        if (calendar.current) {
            calendar.current.getApi().next();
        }
    };

    const handlePrevClick = () => {
        if (calendar.current) {
            calendar.current.getApi().prev();
        }
    };

    const handleDayViewClick = () => {
        if (calendar.current) {
            calendar.current.getApi().changeView(CalendarViews.DAY);
        }
    };

    const handleWeekViewClick = () => {
        if (calendar.current) {
            calendar.current.getApi().changeView(CalendarViews.WEEK);
        }
    };

    const handleMonthViewClick = () => {
        if (calendar.current) {
            calendar.current.getApi().changeView(CalendarViews.MONTH);
        }
    };

    const handleAddClick = () => {
        if (authenticatedUser.user?.admin) {
            setShowAddEditReservationDialog(true);
        }
    };

    async function handleDeleteClick(reservation: ReservationModel) {
        if (authenticatedUser.user?.admin) {
            try {
                await ReservationApi.deleteReservation(reservation._id);
                setReservations(reservations.filter(existingReservation => existingReservation._id !== reservation._id))
                setReservationToEdit(null)
            } catch (error) {
                console.error(error);
                alert(error);
            }
        }
    }



    const handleEventClick = (reservationId: string) => {

        const reservation = reservations.find((item) => item._id === reservationId);

        const projectContainingReservation = projects.find((project) =>
            project.reservations.some((reservation) => reservation._id === reservationId)
        );
        if (authenticatedUser.user?.admin) {
            if (reservation) {
                if (projectContainingReservation) {
                    setReservationProjectId(projectContainingReservation._id);
                }
                setReservationToEdit(reservation);
            } else {
                throw new Error(`${t('error.itemNull')}`);
            }
        } else {
            if (projectContainingReservation) {
                setReservationProjectId(projectContainingReservation._id);
                setReservationToDisplay(reservation);
            } else {
                throw new Error(`${t('error.itemNull')}`);
            }
        }
    };

    return (
        <>
            <div className={styles.calendar}>

                <div className={styles.toolbar}>
                    <CalendarToolbarComponent
                        currentView={currentView}
                        handleAddClick={handleAddClick}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        handleDayViewClick={handleDayViewClick}
                        handleWeekViewClick={handleWeekViewClick}
                        handleMonthViewClick={handleMonthViewClick}
                    />
                </div>
                {reservationsLoading &&
                    <Spinner />
                }
                {!reservationsLoading &&
                    <>
                        <div className={styles.fullCalendar}>
                            <FullCalendar
                                ref={calendar}
                                plugins={[timeGridWeek, timeGridDay, listPlugin, interactionPlugin]}
                                locale={i18n.language === "cs" ? csLocale : "en-gb"}
                                initialView={`${currentView}`}
                                events={reservationsToEvents(reservations, projects)}
                                headerToolbar={false}
                                slotLabelFormat={{
                                    hour: "numeric",
                                    minute: "2-digit",
                                    meridiem: "short"
                                }}
                                allDaySlot={false}
                                viewDidMount={(viewInfo) => handleViewChange(viewInfo)}
                                datesSet={(dateInfo) => handleViewChangeDate(dateInfo)}
                                eventClick={
                                    function (info) {
                                        handleEventClick(info.event.id);
                                    }
                                }
                            // eventContent={(eventInfo) => {
                            //     const { event } = eventInfo;
                            //     const { duration, title, projectTitle } = event.extendedProps;

                            //     return (
                            //         <div>
                            //             <div>{duration}</div>
                            //             <div>{title}</div>
                            //             <div>{projectTitle}</div>
                            //         </div>
                            //     );
                            // }}
                            />
                        </div>
                    </>
                }
            </div>

            {showAddEditReservationDialog &&
                <>
                    {projectsLoading &&
                        <Spinner />
                    }
                    {!projectsLoading &&
                        <AddEditReservationDialog
                            onDismiss={() => setShowAddEditReservationDialog(false)}
                            onReservationSaved={(newEvent) => {
                                setReservations([...reservations, newEvent])
                                setShowAddEditReservationDialog(false);
                            }}
                            projects={projects}
                            setReservationProjectId={setReservationProjectId}
                        />
                    }
                </>
            }

            {reservationToEdit &&
                <>
                    {projectsLoading &&
                        <Spinner />
                    }
                    {!projectsLoading &&
                        <AddEditReservationDialog
                            onDismiss={() => setReservationToEdit(null)}
                            onReservationSaved={(updatedEvent) => {
                                setReservations(reservations.map(existingReservation => existingReservation._id === updatedEvent._id ? updatedEvent : existingReservation));
                                setReservationToEdit(null);
                            }}
                            projects={projects}
                            reservationToEdit={reservationToEdit}
                            reservationToEditProjectId={reservationProjectId}
                            onReservationDelete={handleDeleteClick}
                            setReservationProjectId={setReservationProjectId}
                        />
                    }
                </>
            }

            {reservationToDisplay &&
                <>
                    {projectsLoading &&
                        <Spinner />
                    }
                    {!projectsLoading &&
                        <InfoReservationDialog
                            onDismiss={() => setReservationToDisplay(null)}
                            projects={projects}
                            reservationToDisplay={reservationToDisplay}
                            reservationToDisplayProjectId={reservationProjectId}
                        />
                    }
                </>
            }
        </>
    );
}

export default CalendarComponent;