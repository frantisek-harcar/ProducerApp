import { fetchData } from "../general";
import { Reservation as ReservationModel } from "../../models/reservation"
import { UnauthorizedError } from "../../errors/http_errors";
import useSWR from 'swr';
import API_BASE_URL from '../config';

export interface ReservationsInput {
    title: string,
    dateFrom: Date | null,
    dateTo: Date | null,
    userId: string,
    projectId: string,
}

export async function createReservation(reservation: ReservationsInput): Promise<ReservationModel> {
    const response = await fetchData(`${API_BASE_URL}/api/reservations`,
        // const response = await fetchData(`/api/reservations`, {
        {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservation),
        });

    return response.json();
}

export async function getReservations(): Promise<ReservationModel[]> {
    const response = await fetchData(`${API_BASE_URL}/api/reservations`,
        // const response = await fetchData(`/api/reservations`,
        {
            method: "GET",
            credentials: 'include'
        });

    return await response.json();
}

export async function getReservation(reservationId: string): Promise<ReservationModel> {
    const response = await fetchData(`${API_BASE_URL}/api/reservations/` + reservationId,
        // const response = await fetchData(`/api/reservations/` + reservationId,
        {
            method: "GET",
            credentials: 'include'
        });
    return response.json();
}

export async function updateReservation(reservationId: string, reservation: ReservationsInput): Promise<ReservationModel> {
    const response = await fetchData(`${API_BASE_URL}/api/reservations/` + reservationId,
    // const response = await fetchData(`/api/reservations/` + reservationId,
        {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservation),
        });
    return response.json();
}

export async function deleteReservation(reservationId: string) {
    await fetchData(`${API_BASE_URL}/api/reservations/` + reservationId, {
    // await fetchData(`/api/reservations/` + reservationId, {
        method: "DELETE",
        credentials: 'include'
    });
}

export function useReservations() {
    const { data, error, isLoading, mutate } = useSWR("reservations",
        async () => {
            try {
                return await getReservations();
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    return null;
                } else {
                    throw error;
                }
            }
        }
    );

    return {
        reservations: data,
        reservationsLoading: isLoading,
        reservationsLoadingError: error,
        mutateReservations: mutate,
    }
}