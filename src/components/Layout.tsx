import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { AppHeader } from '@/components/Header'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-background/95">
        <AppHeader />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
