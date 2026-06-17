import { CustomerData } from "../customer/types"
import { OrderRequestDTO } from "../orderRequest/types"

export const getOrderRequestPayload = (orderRequest: OrderRequestDTO, customerData: CustomerData): OrderRequestDTO => {
    return {
        ...orderRequest,
        customerName: customerData.name,
        customerPhoneNumber: customerData.phoneNumber,
        customerId: Number(customerData.id),
        customerTitle: customerData.phoneNumber
    }
}