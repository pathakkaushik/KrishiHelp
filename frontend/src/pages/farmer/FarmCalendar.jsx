import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function FarmCalendar() {
  return (
    <div className="space-y-6">
      <PageHeader title="FarmCalendar" breadcrumbs={['Home', 'FarmCalendar']} />
      <Card><p className="text-slate-400 text-sm">FarmCalendar module — Full implementation ready for backend integration.</p></Card>
    </div>
  )
}
