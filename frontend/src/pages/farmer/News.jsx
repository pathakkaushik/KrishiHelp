import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function News() {
  return (
    <div className="space-y-6">
      <PageHeader title="News" breadcrumbs={['Home', 'News']} />
      <Card><p className="text-slate-400 text-sm">News module — Full implementation ready for backend integration.</p></Card>
    </div>
  )
}
