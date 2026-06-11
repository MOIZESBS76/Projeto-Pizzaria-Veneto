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

export type UserRole =
  | 'Administrador'
  | 'Gerente'
  | 'Garçom'
  | 'Caixa'
  | 'Cozinheiro'
  | 'Entregador'
export type UserStatus = 'Ativo' | 'Inativo' | 'Férias' | 'Afastado'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  cpf?: string
  phone?: string
  nickname?: string
  role?: UserRole
  status?: UserStatus
  birth_date?: string
  admission_date?: string
  address?: string
  internal_observations?: string
  permissions?: Record<string, boolean>
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
