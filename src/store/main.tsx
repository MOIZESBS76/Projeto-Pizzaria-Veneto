import React, { createContext, useContext, useState, useEffect } from 'react'
import { Order, Table, OrderStatus, TableStatus } from '@/types'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

interface StoreContextType {
  orders: Order[]
  tables: Table[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  updateTableStatus: (tableId: string, status: TableStatus, customerName?: string) => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [tables, setTables] = useState<Table[]>([])

  const loadTables = async () => {
    try {
      const records = await pb.collection('tables').getFullList<Table>({ sort: 'table_number' })
      setTables(records)
    } catch (err) {
      console.error(err)
    }
  }

  const loadOrders = async () => {
    try {
      const records = await pb.collection('orders').getFullList<Order>({ sort: '-created' })
      setOrders(records)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadTables()
    loadOrders()
  }, [])

  useRealtime('tables', (e) => {
    if (e.action === 'create')
      setTables((prev) =>
        [...prev, e.record as unknown as Table].sort((a, b) => a.table_number - b.table_number),
      )
    else if (e.action === 'update')
      setTables((prev) =>
        prev.map((t) => (t.id === e.record.id ? (e.record as unknown as Table) : t)),
      )
    else if (e.action === 'delete') setTables((prev) => prev.filter((t) => t.id !== e.record.id))
  })

  useRealtime('orders', (e) => {
    if (e.action === 'create') setOrders((prev) => [e.record as unknown as Order, ...prev])
    else if (e.action === 'update')
      setOrders((prev) =>
        prev.map((o) => (o.id === e.record.id ? (e.record as unknown as Order) : o)),
      )
    else if (e.action === 'delete') setOrders((prev) => prev.filter((o) => o.id !== e.record.id))
  })

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await pb.collection('orders').update(orderId, { status })
  }

  const updateTableStatus = async (tableId: string, status: TableStatus, customerName?: string) => {
    const data: any = { status }
    if (status === 'livre') {
      data.responsible_name = ''
      data.occupancy_time = null
      data.bill_total = 0
    } else if (status === 'ocupada' && customerName) {
      data.responsible_name = customerName
      data.occupancy_time = new Date().toISOString()
    }
    await pb.collection('tables').update(tableId, data)
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
