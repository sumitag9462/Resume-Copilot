import Sidebar from './Sidebar'
import Topbar from './Topbar'

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <Topbar title={title} />
        <main className="min-h-[calc(100vh-64px)] overflow-y-auto bg-[#0A0A0F]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout