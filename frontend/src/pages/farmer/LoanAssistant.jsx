import { Card, PageHeader } from '../../components/common/UIComponents.jsx'
export default function LoanAssistant() {
  return (
    <div className="space-y-6">
      <PageHeader title="LoanAssistant" breadcrumbs={['Home', 'LoanAssistant']} />
      <Card><p className="text-slate-400 text-sm">LoanAssistant module — Full implementation ready for backend integration.</p></Card>
    </div>
  )
}
