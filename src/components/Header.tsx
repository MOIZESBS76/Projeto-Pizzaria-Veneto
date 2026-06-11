import { useEffect, useState } from 'react'
import { Clock, ShoppingBag, Receipt, User, LogOut } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/main'
import { useAuth } from '@/hooks/use-auth'
import logoImg from '@/assets/image-45948.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppHeader() {
  const [time, setTime] = useState(new Date())
  const { orders } = useStore()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const ordersToday = orders.length
  const openOrders = orders.filter((o) => o.status !== 'Entregue').length

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="md:hidden flex items-center h-10">
          <img src={logoImg} alt="VENETO" className="h-full w-auto object-contain drop-shadow-md" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-muted rounded-full text-muted-foreground font-mono text-sm font-medium">
          <Clock className="w-4 h-4" />
          {time.toLocaleTimeString('pt-BR', { hour12: false })}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md border">
          <ShoppingBag className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider hidden sm:inline">
              Hoje
            </span>
            <Badge
              variant="secondary"
              className="font-bold tabular-nums px-2 bg-background border-muted-foreground/20"
            >
              {ordersToday}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-md border border-orange-200 dark:border-orange-900">
          <Receipt className="w-4 h-4 text-orange-600 dark:text-orange-400 hidden sm:block" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wider hidden sm:inline">
              Em Aberto
            </span>
            <Badge className="font-bold tabular-nums px-2 bg-orange-500 hover:bg-orange-600 text-white border-transparent">
              {openOrders}
            </Badge>
          </div>
        </div>

        <div className="pl-2 border-l border-border hidden sm:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none hover:bg-accent rounded-full py-1 pr-3 pl-1 transition-colors">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    src={
                      user?.avatar
                        ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/_pb_users_auth_/${user.id}/${user.avatar}`
                        : undefined
                    }
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium leading-none">
                    {user?.nickname || user?.name || 'Usuário'}
                  </span>
                  {user?.role && (
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mt-1">
                      {user.role}
                    </span>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={signOut}
                className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair da conta</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
