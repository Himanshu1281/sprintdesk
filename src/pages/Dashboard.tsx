import { useAuthStore } from '../store/useAuthStore'
import { useBoardStore } from '../store/useBoardStore'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import type { Task } from '../api/board'

export function Dashboard() {
  const { user } = useAuthStore()
  const { tasks } = useBoardStore()
  const navigate = useNavigate()

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const columns = [
    { header: 'Task ID', cell: (t: Task) => <span className="text-muted-foreground">TASK-{t.id}</span> },
    { header: 'Title', accessorKey: 'title' as keyof Task },
    { header: 'Status', cell: (t: Task) => <span className="capitalize">{t.status.replace('-', ' ')}</span> },
    { header: 'Priority', cell: (t: Task) => <span className="capitalize">{t.priority}</span> },
    { header: 'Due Date', cell: (t: Task) => <span>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}</span> },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-xl border bg-card p-8 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || 'User'}!</h1>
          <p className="text-muted-foreground mt-2">Here's an overview of your workspace.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/board')}>
            Go to Board
          </Button>
          <Button variant="outline" onClick={() => navigate('/analytics')}>
            View Analytics
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Active Sprint</h3>
          <p className="text-sm text-muted-foreground mb-4">Sprint 3 is currently active and ends on August 28, 2026.</p>
          <Link to="/board" className="text-sm font-medium text-primary hover:underline">View sprint board &rarr;</Link>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">My Tasks</h3>
          <p className="text-sm text-muted-foreground mb-4">You have 2 tasks in progress.</p>
          <Link to="/board" className="text-sm font-medium text-primary hover:underline">View my tasks &rarr;</Link>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Recent Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">Sprint velocity is trending up by 15%.</p>
          <Link to="/analytics" className="text-sm font-medium text-primary hover:underline">View full report &rarr;</Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm p-6 overflow-hidden mt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Tasks</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/board')}>
            View All
          </Button>
        </div>
        <DataTable 
          data={recentTasks}
          columns={columns}
          keyExtractor={(t) => t.id}
          emptyMessage="No tasks found."
        />
      </div>
    </div>
  )
}
