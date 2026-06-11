import { useState, useEffect } from 'react'
import { Table as TableType } from '@/types'
import { Card } from '@/components/ui/card'
import { TableDrawer } from './TableDrawer'
import { Users, AlertTriangle } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import useRealtime from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'

export function TableGrid() {
  const { user } = useAuth()
  const [tables, setTables] = useState<TableType[]>([])
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [now, setNow] = useState(Date.now())

  const hasAccess = user?.role === 'Administrador' || user?.permissions?.mesas === true

  useEffect(() => {
    if (!hasAccess) return
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [hasAccess])

  const loadTables = async () => {
    if (!hasAccess) return
    try {
      const data = await pb.collection('tables').getFullList<TableType>({ sort: 'table_number' })
      setTables(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadTables()
  }, [hasAccess])

  useRealtime<TableType>(
    'tables',
    () => {
      loadTables()
    },
    hasAccess,
  )

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed rounded-lg">
        <AlertTriangle className="w-12 h-12 mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">Acesso Negado</p>
        <p className="text-sm">Você não tem permissão para gerenciar mesas.</p>
      </div>
    )
  }

  const handleTableClick = (table: TableType) => {
    setSelectedTable(table)
    setDrawerOpen(true)
  }

  const getTableStyle = (status: TableType['status']) => {
    switch (status) {
      case 'livre':
        return 'bg-green-100 hover:bg-green-200 border-green-300 dark:bg-green-950/40 dark:border-green-900 text-green-800 dark:text-green-300'
      case 'ocupada':
        return 'bg-red-100 hover:bg-red-200 border-red-300 dark:bg-red-950/40 dark:border-red-900 text-red-800 dark:text-red-300'
      case 'conta solicitada':
        return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-400 dark:bg-yellow-950/40 dark:border-yellow-700 text-yellow-800 dark:text-yellow-400'
    }
  }

  const getOccupiedTime = (occupancyTime?: string) => {
    if (!occupancyTime) return null
    const occTime = new Date(occupancyTime.replace(' ', 'T')).getTime()
    const diffMins = Math.floor((now - occTime) / 60000)
    if (diffMins < 0) return '0m'
    if (diffMins < 60) return `${diffMins}m`
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (value?: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in pb-4">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 border-2 ${getTableStyle(table.status)}`}
            onClick={() => handleTableClick(table)}
          >
            <div className="p-3 flex flex-col items-center justify-center min-h-[140px] text-center gap-1">
              <span className="text-4xl font-bold font-mono">{table.table_number}</span>
              <span className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">
                {table.status}
              </span>

              {table.status !== 'livre' && (
                <div className="flex flex-col items-center w-full gap-1 mt-1">
                  {table.responsible_name && (
                    <div className="text-sm font-semibold truncate w-full px-1 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 shrink-0" />
                      <span className="truncate">{table.responsible_name}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center w-full px-2 text-xs font-medium bg-background/30 rounded py-1 mt-1">
                    <span className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1 opacity-70" />
                      {getOccupiedTime(table.occupancy_time)}
                    </span>
                    <span className="font-bold">{formatCurrency(table.bill_total)}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <TableDrawer
        table={selectedTable}
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open)
          if (!open) loadTables()
        }}
        tables={tables}
      />
    </>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
