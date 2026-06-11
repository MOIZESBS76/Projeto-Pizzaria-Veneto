import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from '@/components/dashboard/KanbanBoard'
import { TableGrid } from '@/components/dashboard/TableGrid'
import { LayoutDashboard, Users } from 'lucide-react'
import { useStore } from '@/store/main'

export default function Index() {
  const { tables } = useStore()
  const occupiedCount = tables.filter((t) => t.status !== 'Livre').length

  return (
    <div className="flex flex-col h-full gap-4 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
            Dashboard Operacional
          </h1>
          <p className="text-muted-foreground mt-1">Gestão de pedidos e mesas em tempo real.</p>
        </div>
      </div>

      <Tabs defaultValue="pedidos" className="flex-1 flex flex-col w-full mt-2">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="pedidos" className="flex items-center gap-2 font-medium">
            <LayoutDashboard className="w-4 h-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="mesas" className="flex items-center gap-2 font-medium relative">
            <Users className="w-4 h-4" />
            Mesas
            {occupiedCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-primary" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="pedidos"
          className="flex-1 m-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <KanbanBoard />
        </TabsContent>

        <TabsContent
          value="mesas"
          className="flex-1 m-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="bg-card border rounded-xl p-4 md:p-6 shadow-sm min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">Visão do Salão</h2>
              <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Livre
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Ocupada
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block animate-pulse"></span>{' '}
                  Conta
                </div>
              </div>
            </div>
            <TableGrid />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
