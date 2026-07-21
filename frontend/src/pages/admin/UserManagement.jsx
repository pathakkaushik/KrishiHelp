import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function UserManagement() {
  return (
    <div className="space-y-6">
      <PageHeader title="UserManagement" breadcrumbs={['Admin', 'UserManagement']} />
      <Card><p className="text-slate-400 text-sm">UserManagement — Full implementation ready.</p></Card>
    </div>
  )
}
