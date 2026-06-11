import { FileBarChart, Construction } from 'lucide-react'

export default function Relatorios() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] animate-fade-in text-center p-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <FileBarChart className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Relatórios Gerenciais</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Módulo de relatórios avançados, métricas de vendas e performance em desenvolvimento.
      </p>
      <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-full border border-amber-200">
        <Construction className="w-4 h-4 mr-2" />
        Em Breve
      </div>
    </div>
  )
}
