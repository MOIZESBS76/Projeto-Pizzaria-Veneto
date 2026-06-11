import { Settings, Bell, Store, Volume2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function Configuracoes() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Preferências do sistema e alertas.</p>
      </div>

      <div className="grid gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="w-5 h-5 text-muted-foreground" />
              Operação da Loja
            </CardTitle>
            <CardDescription>Controle o status de recebimento de pedidos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base">Loja Aberta (Delivery)</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir entrada de novos pedidos online.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              Notificações
            </CardTitle>
            <CardDescription>Gerencie os alertas sonoros do painel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> Som de Novo Pedido
                </Label>
                <p className="text-sm text-muted-foreground">Tocar alerta ao receber pedido.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> Alerta de Conta
                </Label>
                <p className="text-sm text-muted-foreground">
                  Aviso sonoro quando mesa pede conta.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
