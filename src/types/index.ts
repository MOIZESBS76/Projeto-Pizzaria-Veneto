export type OrderStatus = 'Recebido' | 'Em Preparo' | 'Pronto' | 'Entregue'
export type OrderType = 'Salão' | 'Delivery' | 'Retirada'
export type TableStatus = 'Livre' | 'Ocupada' | 'Conta Solicitada'

export interface Order {
  id: string
  type: OrderType
  customerName: string
  items: string[]
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
