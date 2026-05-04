import { Observable } from "rxjs";

export interface IOrderApi {
  getOrders(): Observable<OrderResponse[]>;
  addOrder(payload: CreateOrder): Observable<OrderResponse>;
}

export interface OrderItemBase {
    pizzaId: number,
    size: string,
    count: number,
}

export interface OrderItem extends OrderItemBase {
    pizzaName: string,
    price: number
}

export interface OrderHistoryItem {
    status: string,
    label: string,
    time: string,
    updatedBy: string
}

export interface OrderBase {
    deliveryType: DeliveryType,
    address: string,
}

export interface OrderResponse extends OrderBase {
    id: number,
    createdAt: Date,
    customerName: string,
    customerPhone: string,
    courierName: string | null,
    status: string,
    totalPrice: number,
    items: OrderItem[],
    history: OrderHistoryItem[]
}

export interface CreateOrder extends OrderBase {
    customerId: number,
    items: OrderItemBase[]
}

export type DeliveryType = 'delivery' | 'pickup';