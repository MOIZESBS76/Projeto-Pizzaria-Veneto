import { useState, useEffect } from 'react'
import { useStore } from '@/store/main'
import { Table as TableType } from '@/types'
import { Card } from '@/components/ui/card'
import { TableDrawer } from './TableDrawer'
import { Users } from 'lucide-react'

export function TableGrid() {
  const { tables } = useStore()
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [now, setNow] = useState(Date.now())

  // Force re-render every minute to update occupied times
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleTableClick = (table: TableType) => {
    setSelectedTable(table)
    setDrawerOpen(true)
  }

  const getTableStyle = (status: TableType['status']) => {
    switch (status) {
      case 'Livre':
        return 'bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-950/20 dark:border-green-900 text-green-800 dark:text-green-400'
      case 'Ocupada':
        return 'bg-red-50 hover:bg-red-100 border-red-200 dark:bg-red-950/30 dark:border-red-900 text-red-800 dark:text-red-400'
      case 'Conta Solicitada':
        return 'bg-yellow-400 hover:bg-yellow-500 border-yellow-500 text-yellow-950 animate-pulse shadow-yellow-400/50 shadow-lg'
    }
  }

  const getOccupiedTime = (occupiedAt?: Date) => {
    if (!occupiedAt) return null
    const diffMins = Math.floor((now - occupiedAt.getTime()) / 60000)
    if (diffMins < 60) return `${diffMins}m`
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in pb-4">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 border-2 ${getTableStyle(table.status)}`}
            onClick={() => handleTableClick(table)}
          >
            <div className="p-4 flex flex-col items-center justify-center h-32 text-center">
              <span className="text-3xl font-bold mb-2 font-mono">{table.number}</span>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                {table.status}
              </span>

              {table.status !== 'Livre' && (
                <div className="absolute bottom-2 right-2 flex items-center text-xs font-medium opacity-80 bg-background/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {getOccupiedTime(table.occupiedAt)}
                </div>
              )}

              {table.status !== 'Livre' && (
                <div className="absolute top-2 left-2 opacity-50">
                  <Users className="w-4 h-4" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <TableDrawer table={selectedTable} open={drawerOpen} onOpenChange={setDrawerOpen} />
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
