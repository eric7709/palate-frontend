import { Customer} from "../../customers/types"
import { OrderRequestDTO } from "../types"

export const getOrderRequestPayload = (orderRequest: OrderRequestDTO, customer: Customer): OrderRequestDTO => {
    return {
        ...orderRequest,
        customerName: customer.name,
        customerPhoneNumber: customer.phoneNumber,
        customerId: Number(customer.id),
        customerTitle: customer.title
    }
}