import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function OfficerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Officer Dashboard" breadcrumbs={['Officer', 'Dashboard']} />
      <Card><p className="text-slate-400 text-sm">Officer Dashboard — Full implementation ready.</p></Card>
    </div>
  )
}
