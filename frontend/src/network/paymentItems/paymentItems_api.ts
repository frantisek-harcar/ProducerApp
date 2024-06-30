import { fetchData } from "../general";
import { PaymentItem as PaymentItemModel } from "../../models/paymentItem"
import { UnauthorizedError } from "../../errors/http_errors";
import useSWR from 'swr';
import API_BASE_URL from '../config';

export interface PaymentItemInput {
    name: string,
    price: Number,
    isPaid?: Date,
    projectId: string,
}

export interface UpdatePaymentItemInput {
    isPaid: Date,
    price: Number
}

export async function createPaymentItem(paymentItem: PaymentItemInput): Promise<PaymentItemModel> {
    const response = await fetchData(`${API_BASE_URL}/api/paymentItems`,
        // const response = await fetchData(`/api/paymentItems`, {
        {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentItem),
        });

    return response.json();
}

export async function getPaymentItems(): Promise<PaymentItemModel[]> {
    const response = await fetchData(`${API_BASE_URL}/api/paymentItems`,
        // const response = await fetchData(`/api/paymentItems`,
        {
            method: "GET",
            credentials: 'include'
        });

    return await response.json();
}

export async function getPaymentItemsByProject(projectId: string): Promise<PaymentItemModel[]> {
    const response = await fetchData(`${API_BASE_URL}/api/paymentItems/project/` + projectId,
        // const response = await fetchData(`/api/paymentItems/project/` + projectId,
        {
            method: "GET",
            credentials: 'include'
        });

    return await response.json();
}

export async function updatePaymentItem(paymentItemId: string, paymentItem: PaymentItemInput): Promise<PaymentItemModel> {
    const response = await fetchData(`${API_BASE_URL}/api/paymentItems/` + paymentItemId,
        // const response = await fetchData(`/api/paymentItems/` + paymentItemId,
        {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentItem),
        });
    return response.json();
}

export async function deletePaymentItem(paymentItemId: string) {
    await fetchData(`${API_BASE_URL}/api/paymentItems/` + paymentItemId,
        {
            method: "DELETE",
            credentials: 'include'
        });
    // await fetchData(`/api/paymentItems/` + paymentItemId, { method: "DELETE" });
}

export function usePaymentItems() {
    const { data, error, isLoading, mutate } = useSWR("paymentItems",
        async () => {
            try {
                return await getPaymentItems();
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
        paymentItems: data,
        paymentItemsLoading: isLoading,
        paymentItemsError: error,
        mutatePaymentItem: mutate,
    }
}

export function usePaymentItemsByProject(projectId: string) {
    const { data, error, isLoading, mutate } = useSWR("paymentItems",
        async () => {
            try {
                return await getPaymentItemsByProject(projectId);
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
        paymentItems: data,
        paymentItemsLoading: isLoading,
        paymentItemsError: error,
        mutatePaymentItem: mutate,
    }
}