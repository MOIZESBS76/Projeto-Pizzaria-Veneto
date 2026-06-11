import { useState } from 'react'
import { Plus, Edit, AlertCircle } from 'lucide-react'
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

type MenuItem = {
  id: string
  name: string
  category: string
  price: number
  description?: string
  status: 'Ativo' | 'Inativo'
}

const INITIAL_ITEMS: MenuItem[] = [
  // Pizzas
  { id: '1', name: 'Pizza Calabresa', category: 'Pizzas', price: 45, status: 'Ativo' },
  { id: '2', name: 'Pizza Marguerita', category: 'Pizzas', price: 42, status: 'Ativo' },
  { id: '3', name: 'Pizza Frango com Catupiry', category: 'Pizzas', price: 48, status: 'Ativo' },
  { id: '4', name: 'Pizza Portuguesa', category: 'Pizzas', price: 46, status: 'Ativo' },
  { id: '5', name: 'Pizza Quatro Queijos', category: 'Pizzas', price: 48, status: 'Ativo' },
  // Massas
  { id: '6', name: 'Espaguete à Bolonhesa', category: 'Massas', price: 35, status: 'Ativo' },
  { id: '7', name: 'Fettuccine Alfredo', category: 'Massas', price: 38, status: 'Ativo' },
  { id: '8', name: 'Lasanha', category: 'Massas', price: 40, status: 'Ativo' },
  { id: '9', name: 'Penne ao Sugo', category: 'Massas', price: 32, status: 'Ativo' },
  // Almoço
  { id: '10', name: 'Contra filé com fritas', category: 'Almoço', price: 30, status: 'Ativo' },
  { id: '11', name: 'Frango grelhado ou empanado', category: 'Almoço', price: 25, status: 'Ativo' },
  { id: '12', name: 'Carré', category: 'Almoço', price: 25, status: 'Ativo' },
  { id: '13', name: 'Filé de frango à parmegiana', category: 'Almoço', price: 30, status: 'Ativo' },
  { id: '14', name: 'Bife à parmegiana', category: 'Almoço', price: 30, status: 'Ativo' },
  { id: '15', name: 'Linguiça mineira', category: 'Almoço', price: 25, status: 'Ativo' },
  { id: '16', name: 'Filé de peixe', category: 'Almoço', price: 30, status: 'Ativo' },
  { id: '17', name: 'Churrasco misto', category: 'Almoço', price: 30, status: 'Ativo' },
  { id: '18', name: 'Prato do dia', category: 'Almoço', price: 25, status: 'Ativo' },
  // Petiscos
  { id: '19', name: 'Calabresa Acebolada', category: 'Petiscos', price: 28, status: 'Ativo' },
  { id: '20', name: 'Batata Frita', category: 'Petiscos', price: 22, status: 'Ativo' },
  { id: '21', name: 'Frango a Passarinho', category: 'Petiscos', price: 32, status: 'Ativo' },
  { id: '22', name: 'Mandioca Frita', category: 'Petiscos', price: 20, status: 'Ativo' },
  // Bebidas
  { id: '23', name: 'Coca-Cola', category: 'Bebidas', price: 8, status: 'Ativo' },
  { id: '24', name: 'Guaraná', category: 'Bebidas', price: 7, status: 'Ativo' },
  { id: '25', name: 'Chopp Pilsen', category: 'Bebidas', price: 12, status: 'Ativo' },
  { id: '26', name: 'Suco de Laranja', category: 'Bebidas', price: 10, status: 'Ativo' },
  { id: '27', name: 'Água', category: 'Bebidas', price: 4, status: 'Ativo' },
]

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
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS)
  const [filter, setFilter] = useState<string>('Todas')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Pizzas',
    price: '',
    description: '',
    status: 'Ativo',
  })

  const filteredItems = items.filter((i) => filter === 'Todas' || i.category === filter)

  const openNewItemModal = () => {
    setFormData({ name: '', category: 'Pizzas', price: '', description: '', status: 'Ativo' })
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

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) return

    const parsedPrice =
      typeof formData.price === 'string'
        ? parseFloat(formData.price.replace(',', '.'))
        : Number(formData.price)
    if (isNaN(parsedPrice)) return

    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : String(Date.now()),
      name: formData.name,
      category: formData.category,
      price: parsedPrice,
      description: formData.description,
      status: formData.status as 'Ativo' | 'Inativo',
    }

    if (editingItem) {
      setItems(items.map((i) => (i.id === editingItem.id ? newItem : i)))
    } else {
      setItems([newItem, ...items])
    }
    setIsModalOpen(false)
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

      <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-orange-300">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>Aviso de Persistência:</strong> As alterações feitas nesta sessão são locais. Os
          dados serão restaurados ao recarregar a página até que um banco de dados seja integrado.
        </p>
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
              item.status === 'Inativo' && 'opacity-60 bg-muted/50',
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
                    item.status === 'Ativo'
                      ? 'bg-green-500 hover:bg-green-600 text-white border-transparent'
                      : 'bg-gray-400 hover:bg-gray-500 text-white border-transparent',
                  )}
                >
                  {item.status}
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
                    formData.status === 'Ativo' ? 'text-green-600' : 'text-gray-500',
                  )}
                >
                  {formData.status}
                </span>
                <Switch
                  checked={formData.status === 'Ativo'}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, status: c ? 'Ativo' : 'Inativo' })
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
