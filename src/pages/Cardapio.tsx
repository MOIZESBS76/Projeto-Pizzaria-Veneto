import { useState, useEffect } from 'react'
import { Plus, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MenuItem } from '@/types'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

const FILTERS = ['Todas', 'Pizzas', 'Massas', 'Almoço', 'Petiscos', 'Bebidas']

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case 'Pizzas':
      return 'text-orange-700 border-orange-200 bg-orange-100 dark:bg-orange-900/30'
    case 'Massas':
      return 'text-yellow-700 border-yellow-200 bg-yellow-100 dark:bg-yellow-900/30'
    case 'Almoço':
      return 'text-red-700 border-red-200 bg-red-100 dark:bg-red-900/30'
    case 'Petiscos':
      return 'text-amber-700 border-amber-200 bg-amber-100 dark:bg-amber-900/30'
    case 'Bebidas':
      return 'text-rose-700 border-rose-200 bg-rose-100 dark:bg-rose-900/30'
    default:
      return 'text-primary border-primary/20 bg-primary/10'
  }
}

export default function Cardapio() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [filter, setFilter] = useState<string>('Todas')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Pizzas',
    price: '',
    description: '',
    status: 'active',
  })

  const loadItems = async () => {
    try {
      const res = await pb.collection('menu_items').getFullList<MenuItem>({ sort: 'category,name' })
      setItems(res)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])
  useRealtime('menu_items', () => {
    loadItems()
  })

  const filteredItems = items.filter((i) => filter === 'Todas' || i.category === filter)

  const openNewItemModal = () => {
    setFormData({ name: '', category: 'Pizzas', price: '', description: '', status: 'active' })
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: MenuItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || '',
      status: item.status,
    })
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) return

    const parsedPrice =
      typeof formData.price === 'string'
        ? parseFloat(formData.price.replace(',', '.'))
        : Number(formData.price)
    if (isNaN(parsedPrice)) return

    const data = {
      name: formData.name,
      category: formData.category,
      price: parsedPrice,
      description: formData.description,
      status: formData.status,
    }

    try {
      if (editingItem) {
        await pb.collection('menu_items').update(editingItem.id, data)
      } else {
        await pb.collection('menu_items').create(data)
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cardápio</h1>
          <p className="text-muted-foreground mt-1">Gerencie os itens do menu da pizzaria.</p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white shrink-0 shadow-sm"
          onClick={openNewItemModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full whitespace-nowrap',
              filter === f
                ? 'bg-orange-600 hover:bg-orange-700 text-white border-transparent'
                : 'bg-background',
            )}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            Nenhum item encontrado para esta categoria.
          </div>
        )}
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={cn(
              'p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md border-border/60',
              item.status === 'inactive' && 'opacity-60 bg-muted/50',
            )}
          >
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-lg leading-tight">{item.name}</span>
                <Badge
                  variant="outline"
                  className={cn('font-medium', getCategoryColor(item.category))}
                >
                  {item.category}
                </Badge>
              </div>
              {item.description && (
                <span className="text-sm text-muted-foreground line-clamp-1">
                  {item.description}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-[300px]">
              <div className="flex flex-col sm:items-end gap-1">
                <div className="font-bold text-lg whitespace-nowrap">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </div>
                <Badge
                  className={cn(
                    'text-[10px] uppercase tracking-wider',
                    item.status === 'active'
                      ? 'bg-green-500 hover:bg-green-600 text-white border-transparent'
                      : 'bg-gray-400 hover:bg-gray-500 text-white border-transparent',
                  )}
                >
                  {item.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 bg-background"
                onClick={() => openEditModal(item)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do item</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Pizza Marguerita"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pizzas">Pizzas</SelectItem>
                    <SelectItem value="Massas">Massas</SelectItem>
                    <SelectItem value="Almoço">Almoço</SelectItem>
                    <SelectItem value="Petiscos">Petiscos</SelectItem>
                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ingredientes ou detalhes do produto..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Status do item</Label>
                <p className="text-sm text-muted-foreground">Oculta ou exibe o item no cardápio.</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'text-sm font-bold uppercase',
                    formData.status === 'active' ? 'text-green-600' : 'text-gray-500',
                  )}
                >
                  {formData.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, status: c ? 'active' : 'inactive' })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSave}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
