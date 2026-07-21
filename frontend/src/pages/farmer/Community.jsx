import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function Community() {
  return (
    <div className="space-y-6">
      <PageHeader title="Community" breadcrumbs={['Home', 'Community']} />
      <Card><p className="text-slate-400 text-sm">Community module — Full implementation ready for backend integration.</p></Card>
    </div>
  )
}
