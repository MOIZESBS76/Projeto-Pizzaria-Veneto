import { Order, OrderStatus } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Package, Bike, Users } from 'lucide-react'
import { useStore } from '@/store/main'

interface OrderCardProps {
  order: Order
}

const statusFlow: Record<OrderStatus, OrderStatus | null> = {
  recebido: 'em preparo',
  'em preparo': 'pronto',
  pronto: 'entregue',
  entregue: null,
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'salão':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200'
    case 'delivery':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200'
    case 'retirada':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'salão':
      return <Users className="w-3 h-3 mr-1" />
    case 'delivery':
      return <Bike className="w-3 h-3 mr-1" />
    case 'retirada':
      return <Package className="w-3 h-3 mr-1" />
    default:
      return null
  }
}

export function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus } = useStore()
  const nextStatus = statusFlow[order.status]

  const handleAdvance = () => {
    if (nextStatus) {
      updateOrderStatus(order.id, nextStatus)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className="p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-fade-in flex flex-col gap-3 border-border/60">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
            <span className="font-bold text-foreground mr-2">#{order.order_number}</span>
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(order.created)}
          </div>
          <div className="font-semibold text-sm line-clamp-1" title={order.customer_name}>
            {order.customer_name || 'Sem nome'}
          </div>
        </div>
        <Badge
          variant="outline"
          className={`shrink-0 uppercase text-[10px] ${getTypeColor(order.type)}`}
        >
          {getTypeIcon(order.type)}
          {order.type}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
        <ul className="space-y-1">
          {order.items?.map((item, idx) => (
            <li key={idx} className="text-xs flex justify-between gap-2">
              <span className="truncate flex-1">
                {item.quantity}x {item.name}
              </span>
              <span className="shrink-0 font-medium">{formatCurrency(item.price)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="font-bold text-sm text-primary">{formatCurrency(order.total_value)}</div>
        {nextStatus && (
          <Button
            size="sm"
            onClick={handleAdvance}
            className="h-8 px-3 text-xs w-full sm:w-auto mt-2 sm:mt-0"
          >
            Avançar
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Button>
        )}
      </div>
    </Card>
  )
}
