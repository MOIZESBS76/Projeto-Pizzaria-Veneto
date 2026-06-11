migrate(
  (app) => {
    const menuItems = new Collection({
      name: 'menu_items',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'category', type: 'text', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['active', 'inactive'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_menu_items_category ON menu_items (category)',
        'CREATE INDEX idx_menu_items_status ON menu_items (status)',
      ],
    })
    app.save(menuItems)

    const tables = new Collection({
      name: 'tables',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'table_number', type: 'number', required: true, onlyInt: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['livre', 'ocupada', 'conta solicitada'],
          maxSelect: 1,
        },
        { name: 'responsible_name', type: 'text' },
        { name: 'occupancy_time', type: 'date' },
        { name: 'bill_total', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_tables_number ON tables (table_number)'],
    })
    app.save(tables)

    const orders = new Collection({
      name: 'orders',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'order_number', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['salão', 'delivery', 'retirada'],
          maxSelect: 1,
        },
        { name: 'customer_name', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'items', type: 'json', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['recebido', 'em preparo', 'pronto', 'entregue'],
          maxSelect: 1,
        },
        { name: 'total_value', type: 'number', required: true },
        {
          name: 'table',
          type: 'relation',
          collectionId: tables.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'address', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(orders)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('orders'))
    app.delete(app.findCollectionByNameOrId('tables'))
    app.delete(app.findCollectionByNameOrId('menu_items'))
  },
)
