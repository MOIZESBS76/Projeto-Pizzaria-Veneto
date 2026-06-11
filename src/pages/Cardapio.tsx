import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const menuItems = [
  {
    id: 1,
    category: 'Pizzas',
    name: 'Calabresa',
    desc: 'Calabresa fatiada, cebola e azeitonas',
    price: 55,
    img: 'https://img.usecurling.com/p/300/200?q=pizza%20calabresa',
  },
  {
    id: 2,
    category: 'Pizzas',
    name: 'Marguerita',
    desc: 'Mussarela, tomate, manjericão fresco',
    price: 62,
    img: 'https://img.usecurling.com/p/300/200?q=margherita%20pizza',
  },
  {
    id: 3,
    category: 'Pizzas',
    name: 'Portuguesa',
    desc: 'Presunto, mussarela, ovos, cebola, ervilha',
    price: 72,
    img: 'https://img.usecurling.com/p/300/200?q=pizza',
  },
  {
    id: 4,
    category: 'Massas',
    name: 'Lasanha Bolonhesa',
    desc: 'Massa caseira, molho bolonhesa, gratinada',
    price: 85,
    img: 'https://img.usecurling.com/p/300/200?q=lasagna',
  },
  {
    id: 5,
    category: 'Massas',
    name: 'Espaguete Carbonara',
    desc: 'Bacon, ovos, parmesão e pimenta',
    price: 48,
    img: 'https://img.usecurling.com/p/300/200?q=carbonara',
  },
  {
    id: 6,
    category: 'Bebidas',
    name: 'Refrigerante 2L',
    desc: 'Coca-cola, Guaraná, Fanta',
    price: 16,
    img: 'https://img.usecurling.com/p/300/200?q=soda%20bottle',
  },
  {
    id: 7,
    category: 'Bebidas',
    name: 'Vinho Tinto da Casa',
    desc: 'Taça de vinho tinto seco 250ml',
    price: 25,
    img: 'https://img.usecurling.com/p/300/200?q=red%20wine%20glass',
  },
  {
    id: 8,
    category: 'Petiscos',
    name: 'Batata Frita',
    desc: 'Porção 500g com molho especial',
    price: 35,
    img: 'https://img.usecurling.com/p/300/200?q=french%20fries',
  },
]

export default function Cardapio() {
  const categories = Array.from(new Set(menuItems.map((item) => item.category)))

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cardápio</h1>
        <p className="text-muted-foreground mt-1">Catálogo visual de produtos.</p>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-base px-6 py-2">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems
                .filter((i) => i.category === cat)
                .map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-md transition-shadow group border-border/60"
                  >
                    <div className="h-48 overflow-hidden bg-muted">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                        <Badge variant="secondary" className="font-bold text-primary bg-primary/10">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="line-clamp-2">{item.desc}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
