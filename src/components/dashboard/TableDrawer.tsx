import { useState, useEffect, useMemo } from 'react'
import { MenuItem, Table as TableType, TableItem } from '@/types'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Clock, CheckCircle2, Plus, Trash2, Search, Receipt } from 'lucide-react'
import { toast } from 'sonner'

interface TableDrawerProps {
  table: TableType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  tables: TableType[]
}

export function TableDrawer({ table: initialTable, open, onOpenChange, tables }: TableDrawerProps) {
  const table = useMemo(() => {
    if (!initialTable) return null
    return tables.find((t) => t.id === initialTable.id) || initialTable
  }, [initialTable, tables])

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)

  const [addItemOpen, setAddItemOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState('')

  const [closeAccountOpen, setCloseAccountOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setCustomerName('')
      setAddItemOpen(false)
      setCloseAccountOpen(false)
      setSelectedMenuItem(null)
      setQuantity(1)
      setObservation('')
      setSearchQuery('')
    }
  }, [open])

  useEffect(() => {
    if (open && table && table.status !== 'livre') {
      pb.collection('menu_items')
        .getFullList<MenuItem>({ filter: 'status = "active"', sort: 'category,name' })
        .then(setMenuItems)
        .catch(console.error)
    }
  }, [open, table?.status])

  const filteredMenuItems = useMemo(() => {
    if (!searchQuery) return menuItems
    const lower = searchQuery.toLowerCase()
    return menuItems.filter(
      (m) => m.name.toLowerCase().includes(lower) || m.category.toLowerCase().includes(lower),
    )
  }, [menuItems, searchQuery])

  if (!table) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const handleOpenTable = async () => {
    if (!customerName.trim()) return
    setLoading(true)
    try {
      await pb.collection('tables').update(table.id, {
        status: 'ocupada',
        responsible_name: customerName,
        occupancy_time: new Date().toISOString(),
        bill_total: 0,
        current_items: [],
      })
      toast.success('Mesa aberta com sucesso!')
    } catch (err) {
      toast.error('Erro ao abrir a mesa.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAddItem = async () => {
    if (!selectedMenuItem || quantity < 1) return
    setLoading(true)
    try {
      const newItem: TableItem = {
        id: Math.random().toString(36).substring(2, 9),
        menu_item_id: selectedMenuItem.id,
        name: selectedMenuItem.name,
        price: selectedMenuItem.price,
        quantity: quantity,
        observation: observation.trim(),
      }

      const currentItems = table.current_items || []
      const newItems = [...currentItems, newItem]
      const newTotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

      await pb.collection('tables').update(table.id, {
        current_items: newItems,
        bill_total: newTotal,
      })

      toast.success('Item adicionado!')
      setAddItemOpen(false)
      setSelectedMenuItem(null)
      setQuantity(1)
      setObservation('')
    } catch (err) {
      toast.error('Erro ao adicionar item.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemIdToRemove: string) => {
    if (!confirm('Deseja realmente remover este item?')) return
    setLoading(true)
    try {
      const currentItems = table.current_items || []
      const newItems = currentItems.filter((i) => i.id !== itemIdToRemove)
      const newTotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

      await pb.collection('tables').update(table.id, {
        current_items: newItems,
        bill_total: newTotal,
      })
      toast.success('Item removido!')
    } catch (err) {
      toast.error('Erro ao remover item.')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestBill = async () => {
    setLoading(true)
    try {
      await pb.collection('tables').update(table.id, {
        status: 'conta solicitada',
      })
      toast.success('Conta solicitada!')
    } catch (err) {
      toast.error('Erro ao solicitar conta.')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseTable = async () => {
    setLoading(true)
    try {
      const orderData = {
        order_number: Math.floor(100000 + Math.random() * 900000).toString(),
        type: 'salão',
        customer_name: table.responsible_name,
        items: table.current_items || [],
        status: 'entregue',
        total_value: table.bill_total || 0,
        table: table.id,
      }
      await pb.collection('orders').create(orderData)

      await pb.collection('tables').update(table.id, {
        status: 'livre',
        responsible_name: null,
        occupancy_time: null,
        bill_total: 0,
        current_items: null,
      })

      toast.success('Conta fechada com sucesso!')
      setCloseAccountOpen(false)
      onOpenChange(false)
    } catch (err) {
      toast.error('Erro ao fechar a conta.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (table.status) {
      case 'livre':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">Livre</Badge>
      case 'ocupada':
        return (
          <Badge variant="destructive" className="border-0">
            Ocupada
          </Badge>
        )
      case 'conta solicitada':
        return (
          <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-600 animate-pulse border-0">
            Conta Solicitada
          </Badge>
        )
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col sm:max-w-md w-full p-0">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl">Mesa {table.table_number}</SheetTitle>
              {getStatusBadge()}
            </div>
            <SheetDescription>Detalhes de consumo e ações da mesa.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {table.status !== 'livre' ? (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Ocupada desde{' '}
                    {table.occupancy_time
                      ? new Date(table.occupancy_time.replace(' ', 'T')).toLocaleTimeString(
                          'pt-BR',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )
                      : '--:--'}
                  </div>
                  <div className="text-sm font-medium flex items-center bg-muted/50 p-2 rounded-md">
                    <span className="text-muted-foreground mr-2">Responsável:</span>
                    {table.responsible_name}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Receipt className="w-4 h-4 mr-2 text-primary" />
                      Comanda Atual
                    </h4>
                    {table.status === 'ocupada' && (
                      <Button size="sm" onClick={() => setAddItemOpen(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Item
                      </Button>
                    )}
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg flex-1 flex flex-col min-h-0">
                    <ScrollArea className="flex-1 -mx-4 px-4">
                      {table.current_items && table.current_items.length > 0 ? (
                        <ul className="space-y-3">
                          {table.current_items.map((item) => (
                            <li
                              key={item.id}
                              className="text-sm flex flex-col border-b border-border/50 pb-3 last:border-0 last:pb-0"
                            >
                              <div className="flex justify-between items-start">
                                <div className="font-medium flex-1">
                                  {item.quantity}x {item.name}
                                </div>
                                <div className="text-right ml-4 flex flex-col items-end gap-1">
                                  <span>{formatCurrency(item.price * item.quantity)}</span>
                                  {table.status === 'ocupada' && (
                                    <button
                                      onClick={() => handleRemoveItem(item.id)}
                                      className="text-destructive hover:text-red-700 p-1"
                                      title="Remover item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              {item.observation && (
                                <div className="text-xs text-muted-foreground mt-1 bg-background/50 p-1.5 rounded inline-block w-fit">
                                  Obs: {item.observation}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground italic text-center py-8">
                          Comanda vazia.
                        </div>
                      )}
                    </ScrollArea>
                    <div className="pt-4 mt-4 border-t flex justify-between items-center font-bold text-lg shrink-0">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(table.bill_total || 0)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 px-4">
                <CheckCircle2 className="w-16 h-16 text-green-500/50" />
                <p className="text-center mb-4">
                  Mesa está livre. Para iniciar o atendimento, informe o nome do responsável.
                </p>
                <div className="w-full max-w-[250px] space-y-2">
                  <Label htmlFor="customerName">Nome do Cliente</Label>
                  <Input
                    id="customerName"
                    placeholder="Ex: João Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="border-t p-6 shrink-0 flex-col sm:flex-row gap-2 bg-background">
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
                    className="w-full sm:w-1/2 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border-yellow-300"
                    onClick={handleRequestBill}
                    disabled={loading || !table.current_items?.length}
                  >
                    Solicitar Conta
                  </Button>
                )}
                <Button
                  variant="default"
                  className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setCloseAccountOpen(true)}
                  disabled={loading}
                >
                  Fechar Conta
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!selectedMenuItem ? (
              <>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar no cardápio..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  {filteredMenuItems.length > 0 ? (
                    <div className="space-y-1">
                      {filteredMenuItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer group"
                          onClick={() => setSelectedMenuItem(item)}
                        >
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.category}</div>
                          </div>
                          <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {formatCurrency(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhum item encontrado.
                    </div>
                  )}
                </ScrollArea>
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between bg-muted/50 p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{selectedMenuItem.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedMenuItem.category}</div>
                  </div>
                  <div className="font-bold">{formatCurrency(selectedMenuItem.price)}</div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantidade
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    className="col-span-3"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="observation" className="text-right mt-2">
                    Observação
                  </Label>
                  <Input
                    id="observation"
                    className="col-span-3"
                    placeholder="Ex: Sem cebola, bem passado..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-medium text-sm text-muted-foreground">Subtotal:</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(selectedMenuItem.price * quantity)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {selectedMenuItem ? (
              <div className="flex justify-between w-full">
                <Button variant="ghost" onClick={() => setSelectedMenuItem(null)}>
                  Voltar
                </Button>
                <Button onClick={handleConfirmAddItem} disabled={loading}>
                  Confirmar
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                Cancelar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeAccountOpen} onOpenChange={setCloseAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fechar Conta - Mesa {table.table_number}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-muted p-4 rounded-md flex justify-between items-center">
              <span className="font-medium">Valor Total da Comanda:</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(table.bill_total || 0)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Ao confirmar, um pedido será gerado e a mesa ficará livre novamente.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseAccountOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleCloseTable}
              disabled={loading}
            >
              Confirmar Recebimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
