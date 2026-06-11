import { Table as TableType } from '@/types'
import { useStore } from '@/store/main'
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
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface TableDrawerProps {
  table: TableType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TableDrawer({ table, open, onOpenChange }: TableDrawerProps) {
  const { orders, updateTableStatus } = useStore()

  if (!table) return null

  const order = table.currentOrderId ? orders.find((o) => o.id === table.currentOrderId) : null

  const getStatusBadge = () => {
    switch (table.status) {
      case 'Livre':
        return <Badge className="bg-green-500 hover:bg-green-600">Livre</Badge>
      case 'Ocupada':
        return <Badge variant="destructive">Ocupada</Badge>
      case 'Conta Solicitada':
        return (
          <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-600 animate-pulse">
            Conta Solicitada
          </Badge>
        )
    }
  }

  const handleAction = (status: 'Livre' | 'Conta Solicitada') => {
    updateTableStatus(table.id, status)
    if (status === 'Livre') onOpenChange(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-md w-full">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Mesa {table.number}</SheetTitle>
            {getStatusBadge()}
          </div>
          <SheetDescription>Detalhes de consumo e ações da mesa.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
          {table.status !== 'Livre' ? (
            <>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Ocupada desde{' '}
                  {table.occupiedAt?.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                {order && (
                  <div className="text-sm font-medium mt-2">Cliente: {order.customerName}</div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-primary" />
                  Consumo Atual
                </h4>

                {order ? (
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <div className="text-xs text-muted-foreground mb-2">
                      Pedido #{order.id} - Status: {order.status}
                    </div>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
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
                      <span className="text-primary">{formatCurrency(order.value)}</span>
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
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60 gap-4">
              <CheckCircle2 className="w-16 h-16" />
              <p>Mesa está livre e pronta para novos clientes.</p>
            </div>
          )}
        </div>

        <SheetFooter className="border-t pt-4 shrink-0 flex-col sm:flex-row gap-2">
          {table.status !== 'Livre' && (
            <>
              {table.status !== 'Conta Solicitada' && (
                <Button
                  variant="outline"
                  className="w-full sm:w-1/2 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border-yellow-200"
                  onClick={() => handleAction('Conta Solicitada')}
                >
                  Solicitar Conta
                </Button>
              )}
              <Button
                variant="default"
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700"
                onClick={() => handleAction('Livre')}
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
