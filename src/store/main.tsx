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
    items: ['1 Pizza Calabresa'],
    value: 55,
    status: 'Recebido',
    createdAt: new Date(),
  },
  {
    id: '1025',
    type: 'Salão',
    customerName: 'Mesa 4',
    items: ['1 Pizza Marguerita', '1 Suco'],
    value: 62,
    status: 'Em Preparo',
    createdAt: new Date(Date.now() - 15 * 60000),
    tableId: 't4',
  },
  {
    id: '1026',
    type: 'Retirada',
    customerName: 'Maria Oliveira',
    items: ['2 Pizzas Frango c/ Catupiry'],
    value: 110,
    status: 'Pronto',
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: '1027',
    type: 'Salão',
    customerName: 'Mesa 2',
    items: ['1 Lasanha Bolonhesa', '1 Vinho'],
    value: 85,
    status: 'Recebido',
    createdAt: new Date(Date.now() - 5 * 60000),
    tableId: 't2',
  },
  {
    id: '1028',
    type: 'Delivery',
    customerName: 'Carlos Souza',
    items: ['1 Pizza Portuguesa', '1 Coca-Cola 2L'],
    value: 72,
    status: 'Em Preparo',
    createdAt: new Date(Date.now() - 20 * 60000),
  },
  {
    id: '1029',
    type: 'Retirada',
    customerName: 'Ana Costa',
    items: ['1 Porção de Batata Frita'],
    value: 35,
    status: 'Recebido',
    createdAt: new Date(),
  },
  {
    id: '1030',
    type: 'Salão',
    customerName: 'Mesa 10',
    items: ['1 Pizza Doce Prestígio'],
    value: 50,
    status: 'Pronto',
    createdAt: new Date(Date.now() - 40 * 60000),
    tableId: 't10',
  },
  {
    id: '1031',
    type: 'Delivery',
    customerName: 'Roberto Lima',
    items: ['1 Espaguete Carbonara'],
    value: 48,
    status: 'Entregue',
    createdAt: new Date(Date.now() - 60 * 60000),
  },
]

const generateTables = (): Table[] => {
  const tables: Table[] = []
  for (let i = 1; i <= 12; i++) {
    let status: TableStatus = 'Livre'
    let occupiedAt = undefined

    if (i === 4 || i === 2) {
      status = 'Ocupada'
      occupiedAt = new Date(Date.now() - (Math.random() * 60 + 10) * 60000)
    } else if (i === 10 || i === 7) {
      status = 'Conta Solicitada'
      occupiedAt = new Date(Date.now() - (Math.random() * 90 + 30) * 60000)
    }

    tables.push({
      id: `t${i}`,
      number: i,
      status,
      occupiedAt,
      currentOrderId: [4, 2, 10].includes(i) ? `102${i === 10 ? 0 : i === 4 ? 5 : 7}` : undefined,
    })
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
