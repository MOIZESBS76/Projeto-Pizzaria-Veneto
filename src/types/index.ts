export type OrderStatus = 'Recebido' | 'Em Preparo' | 'Pronto' | 'Entregue'
export type OrderType = 'Salão' | 'Delivery' | 'Retirada'
export type TableStatus = 'Livre' | 'Ocupada' | 'Conta Solicitada'

export interface OrderItem {
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  type: OrderType
  customerName: string
  items: OrderItem[]
  value: number
  status: OrderStatus
  createdAt: Date
  tableId?: string
}

export interface Table {
  id: string
  number: number
  status: TableStatus
  occupiedAt?: Date
  customerName?: string
  currentOrderId?: string
}
