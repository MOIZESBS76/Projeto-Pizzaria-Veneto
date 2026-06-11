migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'moizesbs76@gmail.com')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('moizesbs76@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }

    const tables = app.findCollectionByNameOrId('tables')
    for (let i = 1; i <= 12; i++) {
      try {
        app.findFirstRecordByData('tables', 'table_number', i)
      } catch (_) {
        const record = new Record(tables)
        record.set('table_number', i)
        record.set('status', 'livre')
        record.set('bill_total', 0)
        app.save(record)
      }
    }

    const menuCol = app.findCollectionByNameOrId('menu_items')
    const initialItems = [
      { name: 'Pizza Calabresa', category: 'Pizzas', price: 45 },
      { name: 'Pizza Marguerita', category: 'Pizzas', price: 42 },
      { name: 'Pizza Frango com Catupiry', category: 'Pizzas', price: 48 },
      { name: 'Pizza Portuguesa', category: 'Pizzas', price: 46 },
      { name: 'Pizza Quatro Queijos', category: 'Pizzas', price: 48 },
      { name: 'Espaguete à Bolonhesa', category: 'Massas', price: 35 },
      { name: 'Fettuccine Alfredo', category: 'Massas', price: 38 },
      { name: 'Lasanha', category: 'Massas', price: 40 },
      { name: 'Penne ao Sugo', category: 'Massas', price: 32 },
      { name: 'Contra filé com fritas', category: 'Almoço', price: 30 },
      { name: 'Frango grelhado ou empanado', category: 'Almoço', price: 25 },
      { name: 'Carré', category: 'Almoço', price: 25 },
      { name: 'Filé de frango à parmegiana', category: 'Almoço', price: 30 },
      { name: 'Bife à parmegiana', category: 'Almoço', price: 30 },
      { name: 'Linguiça mineira', category: 'Almoço', price: 25 },
      { name: 'Filé de peixe', category: 'Almoço', price: 30 },
      { name: 'Churrasco misto', category: 'Almoço', price: 30 },
      { name: 'Prato do dia', category: 'Almoço', price: 25 },
      { name: 'Calabresa Acebolada', category: 'Petiscos', price: 28 },
      { name: 'Batata Frita', category: 'Petiscos', price: 22 },
      { name: 'Frango a Passarinho', category: 'Petiscos', price: 32 },
      { name: 'Mandioca Frita', category: 'Petiscos', price: 20 },
      { name: 'Coca-Cola', category: 'Bebidas', price: 8 },
      { name: 'Guaraná', category: 'Bebidas', price: 7 },
      { name: 'Chopp Pilsen', category: 'Bebidas', price: 12 },
      { name: 'Suco de Laranja', category: 'Bebidas', price: 10 },
      { name: 'Água', category: 'Bebidas', price: 4 },
    ]

    for (const item of initialItems) {
      try {
        app.findFirstRecordByData('menu_items', 'name', item.name)
      } catch (_) {
        const record = new Record(menuCol)
        record.set('name', item.name)
        record.set('category', item.category)
        record.set('price', item.price)
        record.set('status', 'active')
        app.save(record)
      }
    }
  },
  (app) => {},
)
