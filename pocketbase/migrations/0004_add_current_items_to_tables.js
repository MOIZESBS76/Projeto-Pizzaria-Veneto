migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('tables')
    if (!col.fields.getByName('current_items')) {
      col.fields.add(new JSONField({ name: 'current_items' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('tables')
    if (col.fields.getByName('current_items')) {
      col.fields.removeByName('current_items')
    }
    app.save(col)
  },
)
