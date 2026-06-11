import { useStore } from '@/store/main'
import { OrderStatus } from '@/types'
import { OrderCard } from './OrderCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

const columns: { id: OrderStatus; label: string; color: string }[] = [
  { id: 'Recebido', label: 'Recebido', color: 'bg-blue-500' },
  { id: 'Em Preparo', label: 'Em Preparo', color: 'bg-orange-500' },
  { id: 'Pronto', label: 'Pronto', color: 'bg-green-500' },
  { id: 'Entregue', label: 'Entregue', color: 'bg-gray-500' },
]

export function KanbanBoard() {
  const { orders } = useStore()

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[500px] gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {columns.map((column) => {
        const columnOrders = orders.filter((o) => o.status === column.id)

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-full sm:w-80 flex flex-col bg-slate-100/50 dark:bg-slate-800/20 rounded-xl border border-border/50"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-white/50 dark:bg-background/50 rounded-t-xl backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-sm">{column.label}</h3>
              </div>
              <Badge variant="secondary" className="font-mono">
                {columnOrders.length}
              </Badge>
            </div>

            <ScrollArea className="flex-1 p-3">
              <div className="flex flex-col gap-3">
                {columnOrders.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg text-muted-foreground text-sm">
                    Nenhum pedido
                  </div>
                ) : (
                  columnOrders.map((order) => <OrderCard key={order.id} order={order} />)
                )}
              </div>
            </ScrollArea>
          </div>
        )
      })}
    </div>
  )
}
