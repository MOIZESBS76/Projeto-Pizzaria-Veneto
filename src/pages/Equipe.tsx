import { useEffect, useState, useRef } from 'react'
import { User as UserIcon, Plus, Search, Edit2, Shield, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { useRealtime } from '@/hooks/use-realtime'
import { User, UserRole, UserStatus } from '@/types'
import { getUsers, createUser, updateUser } from '@/services/users'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'

const ROLES: UserRole[] = [
  'Administrador',
  'Gerente',
  'Garçom',
  'Caixa',
  'Cozinheiro',
  'Entregador',
]

const STATUSES: UserStatus[] = ['Ativo', 'Inativo', 'Férias', 'Afastado']

const PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'manage_users', label: 'Gerenciar Usuários' },
  { id: 'tables', label: 'Mesas' },
  { id: 'create_orders', label: 'Lançar Pedidos' },
  { id: 'close_bills', label: 'Fechar Contas' },
  { id: 'payments', label: 'Pagamentos' },
  { id: 'prep_orders', label: 'Pedidos em Preparo' },
  { id: 'ready_orders', label: 'Pedidos Prontos' },
  { id: 'menu', label: 'Cardápio' },
  { id: 'reports', label: 'Relatórios' },
  { id: 'settings', label: 'Configurações' },
]

const phoneMask = (v: string) => {
  const val = v.replace(/\D/g, '')
  if (val.length <= 2) return val
  return `${val.slice(0, 2)}-${val.slice(2, 11)}`
}

const cpfMask = (v: string) => {
  const val = v.replace(/\D/g, '')
  if (val.length <= 3) return val
  if (val.length <= 6) return `${val.slice(0, 3)}.${val.slice(3, 6)}`
  if (val.length <= 9) return `${val.slice(0, 3)}.${val.slice(3, 6)}.${val.slice(6, 9)}`
  return `${val.slice(0, 3)}.${val.slice(3, 6)}.${val.slice(6, 9)}-${val.slice(9, 11)}`
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Ativo':
      return 'bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20'
    case 'Inativo':
      return 'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 border-gray-500/20'
    case 'Férias':
      return 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-500/20'
    case 'Afastado':
      return 'bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-500/20'
    default:
      return 'bg-gray-500/10 text-gray-700'
  }
}

interface UserFormData {
  id?: string
  name: string
  cpf: string
  phone: string
  email: string
  password?: string
  nickname: string
  role: UserRole | ''
  status: UserStatus | ''
  birth_date: string
  admission_date: string
  address: string
  internal_observations: string
  permissions: Record<string, boolean>
  avatar?: File | null
  avatarUrl?: string
}

const initialFormState: UserFormData = {
  name: '',
  cpf: '',
  phone: '',
  email: '',
  password: '',
  nickname: '',
  role: '',
  status: 'Ativo',
  birth_date: '',
  admission_date: '',
  address: '',
  internal_observations: '',
  permissions: {},
}

export default function Equipe() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<UserFormData>(initialFormState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao carregar equipe')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useRealtime('users', () => {
    loadUsers()
  })

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.nickname?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => {
      let perms: Record<string, boolean> = { ...prev.permissions }
      if (role === 'Administrador') {
        PERMISSIONS.forEach((p) => (perms[p.id] = true))
      } else if (role === 'Gerente') {
        PERMISSIONS.forEach((p) => (perms[p.id] = p.id !== 'manage_users'))
      } else if (role === 'Garçom') {
        perms = { dashboard: true, tables: true, create_orders: true }
      } else if (role === 'Caixa') {
        perms = { dashboard: true, close_bills: true, payments: true }
      } else if (role === 'Cozinheiro') {
        perms = { prep_orders: true }
      } else if (role === 'Entregador') {
        perms = { ready_orders: true }
      }
      return { ...prev, role, permissions: perms }
    })
  }

  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      cpf: user.cpf || '',
      phone: user.phone || '',
      email: user.email,
      password: '',
      nickname: user.nickname || '',
      role: user.role || '',
      status: user.status || 'Ativo',
      birth_date: user.birth_date ? user.birth_date.split('T')[0] : '',
      admission_date: user.admission_date ? user.admission_date.split('T')[0] : '',
      address: user.address || '',
      internal_observations: user.internal_observations || '',
      permissions: user.permissions || {},
      avatarUrl: user.avatar
        ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}`
        : '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setFormData(initialFormState)
    setErrors({})
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      if (formData.cpf) data.append('cpf', formData.cpf)
      if (formData.phone) data.append('phone', formData.phone)
      data.append('email', formData.email)

      if (formData.password) {
        data.append('password', formData.password)
        data.append('passwordConfirm', formData.password)
      } else if (!formData.id) {
        setErrors({ password: 'A senha é obrigatória para novos usuários.' })
        setIsSubmitting(false)
        return
      }

      if (formData.nickname) data.append('nickname', formData.nickname)
      if (formData.role) data.append('role', formData.role)
      if (formData.status) data.append('status', formData.status)

      if (formData.birth_date) {
        data.append('birth_date', new Date(formData.birth_date + 'T12:00:00Z').toISOString())
      } else {
        data.append('birth_date', '')
      }

      if (formData.admission_date) {
        data.append(
          'admission_date',
          new Date(formData.admission_date + 'T12:00:00Z').toISOString(),
        )
      } else {
        data.append('admission_date', '')
      }

      if (formData.address) data.append('address', formData.address)
      if (formData.internal_observations)
        data.append('internal_observations', formData.internal_observations)

      data.append('permissions', JSON.stringify(formData.permissions))

      if (formData.avatar) {
        data.append('avatar', formData.avatar)
      }

      if (formData.id) {
        await updateUser(formData.id, data)
        toast.success('Usuário atualizado com sucesso!')
      } else {
        await createUser(data)
        toast.success('Usuário criado com sucesso!')
      }
      setIsModalOpen(false)
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Erro ao salvar usuário. Verifique os campos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os funcionários e acessos do sistema.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="bg-card border rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, apelido ou cargo..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Funcionário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-[100px] text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum funcionário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={
                          user.avatar
                            ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}`
                            : undefined
                        }
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm leading-none">{user.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {user.nickname ? `"${user.nickname}"` : user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.role || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {user.status || 'Desconhecido'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{user.phone || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-muted/30">
            <DialogTitle>{formData.id ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
                      <AvatarImage
                        src={
                          formData.avatar
                            ? URL.createObjectURL(formData.avatar)
                            : formData.avatarUrl
                        }
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-4xl">
                        <UserIcon className="w-12 h-12 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData({ ...formData, avatar: e.target.files[0] })
                      }
                    }}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium">Foto do Perfil</p>
                    <p className="text-xs text-muted-foreground mt-1">Clique para alterar</p>
                  </div>
                </div>

                {/* Form Fields Section */}
                <div className="flex flex-col gap-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nickname">Como quer ser chamado</Label>
                      <Input
                        id="nickname"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: cpfMask(e.target.value) })}
                        required
                        maxLength={14}
                        placeholder="000.000.000-00"
                      />
                      {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: phoneMask(e.target.value) })
                        }
                        required
                        maxLength={12}
                        placeholder="21-988559703"
                      />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {formData.id ? 'Nova Senha (opcional)' : 'Senha *'}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!formData.id}
                      />
                      {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(val) => handleRoleChange(val as UserRole)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(val) =>
                          setFormData({ ...formData, status: val as UserStatus })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birth_date">Data de Nascimento</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admission_date">Data de Admissão</Label>
                      <Input
                        id="admission_date"
                        type="date"
                        value={formData.admission_date}
                        onChange={(e) =>
                          setFormData({ ...formData, admission_date: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Permissions Section */}
                  <div className="pt-4 border-t space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Permissões do Sistema</h3>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {PERMISSIONS.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`perm-${perm.id}`}
                            checked={!!formData.permissions[perm.id]}
                            onCheckedChange={(checked) => {
                              setFormData((prev) => ({
                                ...prev,
                                permissions: { ...prev.permissions, [perm.id]: !!checked },
                              }))
                            }}
                          />
                          <Label
                            htmlFor={`perm-${perm.id}`}
                            className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {perm.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço Completo</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Rua, Número, Complemento, Bairro, Cidade - Estado"
                        className="resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internal_observations">Observações Internas</Label>
                      <Textarea
                        id="internal_observations"
                        value={formData.internal_observations}
                        onChange={(e) =>
                          setFormData({ ...formData, internal_observations: e.target.value })
                        }
                        placeholder="Anotações gerenciais (não visível para o funcionário)"
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-muted/20 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
