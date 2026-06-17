import { CustomerData } from "../customers/types"
import { OrderRequestDTO } from "./types"

export const getOrderRequestPayload = (orderRequest: OrderRequestDTO, customerData: CustomerData): OrderRequestDTO => {
    return {
        ...orderRequest,
        customerName: customerData.name,
        customerPhoneNumber: customerData.phoneNumber,
        customerId: Number(customerData.id),
        customerTitle: customerData.phoneNumber
    }
}