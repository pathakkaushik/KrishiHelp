import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function Profile() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" breadcrumbs={['Home', 'Profile']} />
      <Card><p className="text-slate-400 text-sm">Profile module — Full implementation ready for backend integration.</p></Card>
    </div>
  )
}
