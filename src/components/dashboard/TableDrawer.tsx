import { useEffect, useState } from 'react'
import { MenuItem, Table as TableType } from '@/types'
import { useStore } from '@/store/main'
import pb from '@/lib/pocketbase/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface TableDrawerProps {
  table: TableType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TableDrawer({ table, open, onOpenChange }: TableDrawerProps) {
  const { orders, updateTableStatus } = useStore()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) setCustomerName('')
  }, [open])

  useEffect(() => {
    if (open && table && table.status !== 'livre') {
      pb.collection('menu_items')
        .getFullList<MenuItem>({ filter: 'status = "active"', sort: 'category,name' })
        .then(setMenuItems)
    }
  }, [open, table])

  if (!table) return null

  const order = orders.find((o) => o.table === table.id && o.status !== 'entregue')

  const handleOpenTable = async () => {
    if (!customerName.trim()) return
    setLoading(true)
    try {
      const orderData = {
        order_number: Math.floor(Math.random() * 10000).toString(),
        type: 'salão',
        customer_name: customerName,
        status: 'recebido',
        table: table.id,
        items: [],
        total_value: 0,
      }
      await pb.collection('orders').create(orderData)
      await updateTableStatus(table.id, 'ocupada', customerName)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId)
    if (!item || !order) return
    const newItems = [...(order.items || [])]
    const existing = newItems.find((i) => i.name === item.name)
    if (existing) {
      existing.quantity += 1
    } else {
      newItems.push({ name: item.name, price: item.price, quantity: 1 })
    }
    const newTotal = newItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
    await pb.collection('orders').update(order.id, {
      items: newItems,
      total_value: newTotal,
    })
    await pb.collection('tables').update(table.id, {
      bill_total: newTotal,
    })
  }

  const handleCloseTable = async () => {
    if (order) {
      await pb.collection('orders').update(order.id, { status: 'entregue' })
    }
    await updateTableStatus(table.id, 'livre')
    onOpenChange(false)
  }

  const handleRequestBill = async () => {
    await updateTableStatus(table.id, 'conta solicitada')
  }

  const getStatusBadge = () => {
    switch (table.status) {
      case 'livre':
        return <Badge className="bg-green-500 hover:bg-green-600">Livre</Badge>
      case 'ocupada':
        return <Badge variant="destructive">Ocupada</Badge>
      case 'conta solicitada':
        return (
          <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-600 animate-pulse">
            Conta Solicitada
          </Badge>
        )
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-md w-full">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Mesa {table.table_number}</SheetTitle>
            {getStatusBadge()}
          </div>
          <SheetDescription>Detalhes de consumo e ações da mesa.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
          {table.status !== 'livre' ? (
            <>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Ocupada desde{' '}
                  {table.occupancy_time
                    ? new Date(table.occupancy_time).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--:--'}
                </div>
                {order && (
                  <div className="text-sm font-medium mt-2">Cliente: {order.customer_name}</div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-primary" />
                    Consumo Atual
                  </h4>
                  {table.status === 'ocupada' && (
                    <Select onValueChange={handleAddItem} value="">
                      <SelectTrigger className="w-[180px] h-8 text-xs">
                        <SelectValue placeholder="Adicionar item..." />
                      </SelectTrigger>
                      <SelectContent>
                        {menuItems.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name} - R$ {m.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {order ? (
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <div className="text-xs text-muted-foreground mb-2 uppercase">
                      Pedido #{order.order_number} - Status: {order.status}
                    </div>
                    <ul className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-muted-foreground">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 mt-3 border-t flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(order.total_value)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    Nenhum pedido vinculado.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 px-4">
              <CheckCircle2 className="w-16 h-16 text-green-500/50" />
              <p className="text-center mb-4">
                Mesa está livre. Para iniciar o atendimento, informe o nome do responsável.
              </p>
              <Input
                placeholder="Nome do cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="max-w-[250px]"
              />
            </div>
          )}
        </div>

        <SheetFooter className="border-t pt-4 shrink-0 flex-col sm:flex-row gap-2">
          {table.status === 'livre' ? (
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleOpenTable}
              disabled={!customerName.trim() || loading}
            >
              Abrir Mesa
            </Button>
          ) : (
            <>
              {table.status !== 'conta solicitada' && (
                <Button
                  variant="outline"
                  className="w-full sm:w-1/2 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border-yellow-200"
                  onClick={handleRequestBill}
                >
                  Solicitar Conta
                </Button>
              )}
              <Button
                variant="default"
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700"
                onClick={handleCloseTable}
              >
                Fechar Mesa
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
