migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    users.listRule = "@request.auth.id != ''"
    users.viewRule = "@request.auth.id != ''"
    users.createRule = "@request.auth.id != ''"
    users.updateRule = "@request.auth.id != ''"
    users.deleteRule = "@request.auth.id != ''"

    if (!users.fields.getByName('cpf')) {
      users.fields.add(new TextField({ name: 'cpf' }))
    }
    if (!users.fields.getByName('phone')) {
      users.fields.add(new TextField({ name: 'phone' }))
    }
    if (!users.fields.getByName('nickname')) {
      users.fields.add(new TextField({ name: 'nickname' }))
    }
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['Administrador', 'Gerente', 'Garçom', 'Caixa', 'Cozinheiro', 'Entregador'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('status')) {
      users.fields.add(
        new SelectField({
          name: 'status',
          values: ['Ativo', 'Inativo', 'Férias', 'Afastado'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('birth_date')) {
      users.fields.add(new DateField({ name: 'birth_date' }))
    }
    if (!users.fields.getByName('admission_date')) {
      users.fields.add(new DateField({ name: 'admission_date' }))
    }
    if (!users.fields.getByName('address')) {
      users.fields.add(new TextField({ name: 'address' }))
    }
    if (!users.fields.getByName('internal_observations')) {
      users.fields.add(new TextField({ name: 'internal_observations' }))
    }
    if (!users.fields.getByName('permissions')) {
      users.fields.add(new JSONField({ name: 'permissions' }))
    }

    app.save(users)

    try {
      const existingUsers = app.findRecordsByFilter(
        '_pb_users_auth_',
        "cpf != ''",
        'created',
        10000,
        0,
      )
      const seenCpf = {}
      for (const record of existingUsers) {
        const cpf = record.getString('cpf')
        if (seenCpf[cpf]) {
          app.delete(record)
        } else {
          seenCpf[cpf] = true
        }
      }
    } catch (err) {
      // skip if no records match
    }

    users.addIndex('idx_users_cpf', true, 'cpf', "cpf != ''")
    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    users.createRule = ''
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'

    users.removeIndex('idx_users_cpf')
    users.fields.removeByName('cpf')
    users.fields.removeByName('phone')
    users.fields.removeByName('nickname')
    users.fields.removeByName('role')
    users.fields.removeByName('status')
    users.fields.removeByName('birth_date')
    users.fields.removeByName('admission_date')
    users.fields.removeByName('address')
    users.fields.removeByName('internal_observations')
    users.fields.removeByName('permissions')

    app.save(users)
  },
)
