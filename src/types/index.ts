export type OrderStatus = 'recebido' | 'em preparo' | 'pronto' | 'entregue'
export type OrderType = 'salão' | 'delivery' | 'retirada'
export type TableStatus = 'livre' | 'ocupada' | 'conta solicitada'

export interface OrderItem {
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  order_number: string
  type: OrderType
  customer_name?: string
  phone?: string
  items: OrderItem[]
  status: OrderStatus
  total_value: number
  table?: string
  address?: string
  created: string
  updated: string
}

export interface Table {
  id: string
  table_number: number
  status: TableStatus
  responsible_name?: string
  occupancy_time?: string
  bill_total?: number
  created: string
  updated: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description?: string
  status: 'active' | 'inactive'
  created: string
  updated: string
}
