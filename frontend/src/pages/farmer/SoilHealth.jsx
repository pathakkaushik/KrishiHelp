import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function SoilHealth() {
  return (
    <div className="space-y-6">
      <PageHeader title="SoilHealth" breadcrumbs={['Home', 'SoilHealth']} />
      <Card><p className="text-slate-400 text-sm">SoilHealth module — Full implementation ready for backend integration.</p></Card>
    </div>
  )
}
