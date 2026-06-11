import { LayoutDashboard, UtensilsCrossed, FileBarChart, Settings, Pizza } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: UtensilsCrossed, label: 'Cardápio', path: '/cardapio' },
  { icon: FileBarChart, label: 'Relatórios', path: '/relatorios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex h-16 items-center justify-center border-b border-border/50">
        <div className="flex items-center gap-3 font-bold text-2xl text-primary tracking-tight px-4 w-full">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <Pizza className="w-6 h-6" />
          </div>
          <span className="truncate">VENETO</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className="font-medium text-base py-5 transition-colors data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold"
                >
                  <Link to={item.path}>
                    <item.icon
                      className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground text-center">VENETO Pizzaria v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}
