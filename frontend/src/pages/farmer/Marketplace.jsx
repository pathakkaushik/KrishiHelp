import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function Marketplace() {
  return (
    <div className="space-y-6">
      <PageHeader title="Marketplace" breadcrumbs={['Home', 'Marketplace']} />
      <Card><p className="text-slate-400 text-sm">Marketplace module — Full implementation ready for backend integration.</p></Card>
    </div>
  )
}
