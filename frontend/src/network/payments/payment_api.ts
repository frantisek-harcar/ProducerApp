import { fetchData } from "../general";
import API_BASE_URL from '../config';

export interface CheckoutBody {
    paymentItems: [
        {
            id: string,
            name: string,
            price: number,
        }
    ]
}

export interface CheckoutItem {
    id: string,
    name: string,
    price: number,
    type: string,
}

export interface CheckoutResponse {
    url: string,
}

export async function checkout(items: CheckoutItem[]): Promise<CheckoutResponse> {
    const response = await fetchData(`${API_BASE_URL}/api/payments`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({paymentItems: items}),
    });

    return response.json();
}