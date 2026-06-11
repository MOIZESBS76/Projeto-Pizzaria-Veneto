import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const menuItems = [
  // Pizzas
  {
    id: 1,
    category: 'Pizzas',
    name: 'Calabresa',
    desc: 'Calabresa fatiada, cebola e azeitonas',
    price: 45,
    img: 'https://img.usecurling.com/p/300/200?q=pizza%20calabresa',
  },
  {
    id: 2,
    category: 'Pizzas',
    name: 'Marguerita',
    desc: 'Mussarela, tomate, manjericão fresco',
    price: 42,
    img: 'https://img.usecurling.com/p/300/200?q=margherita%20pizza',
  },
  {
    id: 3,
    category: 'Pizzas',
    name: 'Frango com Catupiry',
    desc: 'Frango desfiado com requeijão',
    price: 48,
    img: 'https://img.usecurling.com/p/300/200?q=chicken%20pizza',
  },
  {
    id: 4,
    category: 'Pizzas',
    name: 'Portuguesa',
    desc: 'Presunto, mussarela, ovos, cebola, ervilha',
    price: 46,
    img: 'https://img.usecurling.com/p/300/200?q=pizza',
  },
  {
    id: 5,
    category: 'Pizzas',
    name: 'Quatro Queijos',
    desc: 'Mussarela, provolone, parmesão e gorgonzola',
    price: 48,
    img: 'https://img.usecurling.com/p/300/200?q=cheese%20pizza',
  },

  // Massas
  {
    id: 6,
    category: 'Massas',
    name: 'Espaguete à Bolonhesa',
    desc: 'Massa caseira, molho bolonhesa',
    price: 35,
    img: 'https://img.usecurling.com/p/300/200?q=spaghetti%20bolognese',
  },
  {
    id: 7,
    category: 'Massas',
    name: 'Fettuccine Alfredo',
    desc: 'Massa com molho branco e queijo parmesão',
    price: 38,
    img: 'https://img.usecurling.com/p/300/200?q=fettuccine%20alfredo',
  },
  {
    id: 8,
    category: 'Massas',
    name: 'Lasanha',
    desc: 'Massa gratinada com molho de queijo e carne',
    price: 40,
    img: 'https://img.usecurling.com/p/300/200?q=lasagna',
  },
  {
    id: 9,
    category: 'Massas',
    name: 'Penne ao Sugo',
    desc: 'Penne com molho de tomate fresco e manjericão',
    price: 32,
    img: 'https://img.usecurling.com/p/300/200?q=penne%20pasta',
  },

  // Executivos
  {
    id: 10,
    category: 'Executivos',
    name: 'Contra filé',
    desc: 'Acompanha arroz, feijão, fritas e salada',
    price: 30,
    img: 'https://img.usecurling.com/p/300/200?q=steak%20plate',
  },
  {
    id: 11,
    category: 'Executivos',
    name: 'Frango grelhado',
    desc: 'Acompanha arroz, feijão, fritas e salada',
    price: 25,
    img: 'https://img.usecurling.com/p/300/200?q=grilled%20chicken',
  },
  {
    id: 12,
    category: 'Executivos',
    name: 'Carré',
    desc: 'Acompanha arroz, feijão, farofa e couve',
    price: 25,
    img: 'https://img.usecurling.com/p/300/200?q=pork%20chop%20plate',
  },
  {
    id: 13,
    category: 'Executivos',
    name: 'Parmegianas',
    desc: 'Carne ou frango com arroz e fritas',
    price: 30,
    img: 'https://img.usecurling.com/p/300/200?q=parmigiana',
  },
  {
    id: 14,
    category: 'Executivos',
    name: 'Linguiça mineira',
    desc: 'Acompanha arroz, tutu e couve',
    price: 25,
    img: 'https://img.usecurling.com/p/300/200?q=sausage%20plate',
  },
  {
    id: 15,
    category: 'Executivos',
    name: 'Peixe',
    desc: 'Filé de peixe empanado com purê',
    price: 30,
    img: 'https://img.usecurling.com/p/300/200?q=fried%20fish%20plate',
  },
  {
    id: 16,
    category: 'Executivos',
    name: 'Churrasco misto',
    desc: 'Carnes variadas, arroz, farofa e vinagrete',
    price: 30,
    img: 'https://img.usecurling.com/p/300/200?q=mixed%20bbq',
  },
  {
    id: 17,
    category: 'Executivos',
    name: 'Prato do dia',
    desc: 'Opção econômica do dia',
    price: 25,
    img: 'https://img.usecurling.com/p/300/200?q=lunch%20plate',
  },

  // Petiscos
  {
    id: 18,
    category: 'Petiscos',
    name: 'Calabresa Acebolada',
    desc: 'Acompanha pão fatiado',
    price: 28,
    img: 'https://img.usecurling.com/p/300/200?q=sliced%20sausage',
  },
  {
    id: 19,
    category: 'Petiscos',
    name: 'Batata Frita',
    desc: 'Porção 500g',
    price: 22,
    img: 'https://img.usecurling.com/p/300/200?q=french%20fries',
  },
  {
    id: 20,
    category: 'Petiscos',
    name: 'Frango a Passarinho',
    desc: 'Com alho frito',
    price: 32,
    img: 'https://img.usecurling.com/p/300/200?q=fried%20chicken%20pieces',
  },
  {
    id: 21,
    category: 'Petiscos',
    name: 'Mandioca Frita',
    desc: 'Crocante por fora e macia por dentro',
    price: 20,
    img: 'https://img.usecurling.com/p/300/200?q=fried%20cassava',
  },

  // Bebidas
  {
    id: 22,
    category: 'Bebidas',
    name: 'Coca-Cola',
    desc: 'Lata 350ml',
    price: 8,
    img: 'https://img.usecurling.com/p/300/200?q=coca%20cola',
  },
  {
    id: 23,
    category: 'Bebidas',
    name: 'Guaraná',
    desc: 'Lata 350ml',
    price: 7,
    img: 'https://img.usecurling.com/p/300/200?q=guarana%20soda',
  },
  {
    id: 24,
    category: 'Bebidas',
    name: 'Chopp Pilsen',
    desc: 'Caneca 300ml',
    price: 12,
    img: 'https://img.usecurling.com/p/300/200?q=draft%20beer',
  },
  {
    id: 25,
    category: 'Bebidas',
    name: 'Suco Laranja',
    desc: 'Copo 300ml',
    price: 10,
    img: 'https://img.usecurling.com/p/300/200?q=orange%20juice',
  },
  {
    id: 26,
    category: 'Bebidas',
    name: 'Água',
    desc: 'Garrafa 500ml',
    price: 4,
    img: 'https://img.usecurling.com/p/300/200?q=water%20bottle',
  },
]

export default function Cardapio() {
  const categories = ['Pizzas', 'Massas', 'Executivos', 'Petiscos', 'Bebidas']

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
                        <Badge
                          variant="secondary"
                          className="font-bold text-primary bg-primary/10 whitespace-nowrap"
                        >
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
