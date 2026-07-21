import { Outlet } from 'react-router-dom'
export default function Layout() {
  return <div className="min-h-screen bg-slate-900"><main className="p-8 max-w-7xl mx-auto"><Outlet /></main></div>
}
