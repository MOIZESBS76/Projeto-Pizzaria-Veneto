import React, { createContext, useContext, useState } from 'react'
import { Order, Table, OrderStatus, TableStatus } from '@/types'

interface StoreContextType {
  orders: Order[]
  tables: Table[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  updateTableStatus: (tableId: string, status: TableStatus) => void
}

const mockOrders: Order[] = [
  {
    id: '1024',
    type: 'Delivery',
    customerName: 'João Silva',
    items: [
      { name: 'Calabresa', price: 45, quantity: 1 },
      { name: 'Coca-Cola', price: 8, quantity: 1 },
    ],
    value: 53,
    status: 'Recebido',
    createdAt: new Date(),
  },
  {
    id: '1025',
    type: 'Salão',
    customerName: 'Mesa 2 - Maria',
    items: [
      { name: 'Marguerita', price: 42, quantity: 1 },
      { name: 'Chopp Pilsen', price: 12, quantity: 1 },
    ],
    value: 54,
    status: 'Em Preparo',
    createdAt: new Date(Date.now() - 15 * 60000),
    tableId: 't2',
  },
  {
    id: '1026',
    type: 'Retirada',
    customerName: 'Carlos Santos',
    items: [
      { name: 'Frango com Catupiry', price: 48, quantity: 1 },
      { name: 'Guaraná', price: 7, quantity: 1 },
    ],
    value: 55,
    status: 'Pronto',
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: '1027',
    type: 'Delivery',
    customerName: 'Ana Souza',
    items: [
      { name: 'Espaguete à Bolonhesa', price: 35, quantity: 1 },
      { name: 'Suco Laranja', price: 10, quantity: 1 },
    ],
    value: 45,
    status: 'Recebido',
    createdAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '1028',
    type: 'Salão',
    customerName: 'Mesa 4 - Roberto',
    items: [
      { name: 'Lasanha', price: 40, quantity: 1 },
      { name: 'Água', price: 4, quantity: 1 },
    ],
    value: 44,
    status: 'Entregue',
    createdAt: new Date(Date.now() - 40 * 60000),
    tableId: 't4',
  },
  {
    id: '1029',
    type: 'Delivery',
    customerName: 'Marcos Almeida',
    items: [
      { name: 'Portuguesa', price: 46, quantity: 1 },
      { name: 'Batata Frita', price: 22, quantity: 1 },
    ],
    value: 68,
    status: 'Em Preparo',
    createdAt: new Date(Date.now() - 20 * 60000),
  },
  {
    id: '1030',
    type: 'Salão',
    customerName: 'Mesa 7 - Lucia',
    items: [
      { name: 'Contra filé', price: 30, quantity: 1 },
      { name: 'Coca-Cola', price: 8, quantity: 1 },
    ],
    value: 38,
    status: 'Em Preparo',
    createdAt: new Date(Date.now() - 10 * 60000),
    tableId: 't7',
  },
  {
    id: '1031',
    type: 'Retirada',
    customerName: 'Fernanda Lima',
    items: [{ name: 'Quatro Queijos', price: 48, quantity: 1 }],
    value: 48,
    status: 'Recebido',
    createdAt: new Date(),
  },
  {
    id: '1032',
    type: 'Delivery',
    customerName: 'Paulo Roberto',
    items: [
      { name: 'Frango a Passarinho', price: 32, quantity: 1 },
      { name: 'Chopp Pilsen', price: 12, quantity: 2 },
    ],
    value: 56,
    status: 'Pronto',
    createdAt: new Date(Date.now() - 25 * 60000),
  },
  {
    id: '1033',
    type: 'Salão',
    customerName: 'Mesa 10 - José',
    items: [
      { name: 'Parmegianas', price: 30, quantity: 1 },
      { name: 'Guaraná', price: 7, quantity: 1 },
    ],
    value: 37,
    status: 'Entregue',
    createdAt: new Date(Date.now() - 60 * 60000),
    tableId: 't10',
  },
  {
    id: '1034',
    type: 'Salão',
    customerName: 'Mesa 12 - Julia',
    items: [
      { name: 'Penne ao Sugo', price: 32, quantity: 1 },
      { name: 'Suco Laranja', price: 10, quantity: 1 },
    ],
    value: 42,
    status: 'Pronto',
    createdAt: new Date(Date.now() - 35 * 60000),
    tableId: 't12',
  },
  {
    id: '1035',
    type: 'Delivery',
    customerName: 'Ricardo Alves',
    items: [
      { name: 'Calabresa', price: 45, quantity: 1 },
      { name: 'Calabresa Acebolada', price: 28, quantity: 1 },
    ],
    value: 73,
    status: 'Entregue',
    createdAt: new Date(Date.now() - 80 * 60000),
  },
]

const generateTables = (): Table[] => {
  const tables: Table[] = []

  const occupiedMapping: Record<
    number,
    { status: TableStatus; occupiedAt: Date; orderId: string; customer: string }
  > = {
    2: {
      status: 'Ocupada',
      occupiedAt: new Date(Date.now() - 15 * 60000),
      orderId: '1025',
      customer: 'Maria',
    },
    4: {
      status: 'Conta Solicitada',
      occupiedAt: new Date(Date.now() - 45 * 60000),
      orderId: '1028',
      customer: 'Roberto',
    },
    7: {
      status: 'Ocupada',
      occupiedAt: new Date(Date.now() - 10 * 60000),
      orderId: '1030',
      customer: 'Lucia',
    },
    10: {
      status: 'Conta Solicitada',
      occupiedAt: new Date(Date.now() - 65 * 60000),
      orderId: '1033',
      customer: 'José',
    },
    12: {
      status: 'Ocupada',
      occupiedAt: new Date(Date.now() - 35 * 60000),
      orderId: '1034',
      customer: 'Julia',
    },
  }

  for (let i = 1; i <= 12; i++) {
    const mapping = occupiedMapping[i]
    if (mapping) {
      tables.push({
        id: `t${i}`,
        number: i,
        status: mapping.status,
        occupiedAt: mapping.occupiedAt,
        currentOrderId: mapping.orderId,
        customerName: mapping.customer,
      })
    } else {
      tables.push({
        id: `t${i}`,
        number: i,
        status: 'Livre',
      })
    }
  }
  return tables
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [tables, setTables] = useState<Table[]>(generateTables())

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status,
            occupiedAt: status === 'Livre' ? undefined : t.occupiedAt || new Date(),
            currentOrderId: status === 'Livre' ? undefined : t.currentOrderId,
            customerName: status === 'Livre' ? undefined : t.customerName,
          }
        }
        return t
      }),
    )
  }

  return React.createElement(
    StoreContext.Provider,
    {
      value: { orders, tables, updateOrderStatus, updateTableStatus },
    },
    children,
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}
