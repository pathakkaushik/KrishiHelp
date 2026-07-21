import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" breadcrumbs={['Admin', 'Analytics']} />
      <Card><p className="text-slate-400 text-sm">Analytics — Full implementation ready.</p></Card>
    </div>
  )
}
