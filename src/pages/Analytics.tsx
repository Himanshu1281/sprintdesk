import * as React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import html2canvas from 'html2canvas'
import { useBoardStore } from '../store/useBoardStore'
import { fetchTasks } from '../api/board'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function Analytics() {
  const { tasks, hasLoaded, setTasks } = useBoardStore()
  const dashboardRef = React.useRef<HTMLDivElement>(null)
  
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')

  React.useEffect(() => {
    if (!hasLoaded) {
      fetchTasks().then(setTasks)
    }
  }, [hasLoaded, setTasks])

  const filteredTasks = React.useMemo(() => {
    return tasks.filter(t => {
      const taskDate = new Date(t.createdAt).getTime()
      if (startDate && taskDate < new Date(startDate).getTime()) return false
      // Add a day to end date to make it inclusive
      if (endDate && taskDate > new Date(endDate).getTime() + 86400000) return false
      return true
    })
  }, [tasks, startDate, endDate])

  // Data processing for Task Status
  const statusCounts = filteredTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace('-', ' ').toUpperCase(),
    value: count,
  }))

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444']

  // Data processing for Priority Breakdown
  const priorityCounts = filteredTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const priorityData = Object.entries(priorityCounts).map(([priority, count]) => ({
    name: priority.toUpperCase(),
    value: count,
  }))

  const PRIORITY_COLORS = {
    LOW: '#3b82f6',
    MEDIUM: '#f59e0b',
    HIGH: '#ef4444',
  }

  // Sprint Velocity (mock data per sprint since tasks have sprintId)
  const sprintData = [1, 2, 3].map((sprintId) => {
    const completed = filteredTasks.filter((t) => t.sprintId === sprintId && t.status === 'done').length
    const total = filteredTasks.filter((t) => t.sprintId === sprintId).length
    return {
      name: `Sprint ${sprintId}`,
      Completed: completed,
      Total: total,
    }
  })

  // Completion Trend over time
  const dates = [...new Set(filteredTasks.map(t => new Date(t.createdAt).toLocaleDateString()))].sort()
  const trendData = dates.map(date => {
    const created = filteredTasks.filter(t => new Date(t.createdAt).toLocaleDateString() === date).length
    const completed = filteredTasks.filter(t => t.completedAt && new Date(t.completedAt).toLocaleDateString() === date).length
    return {
      date,
      Created: created,
      Completed: completed
    }
  })

  const handleExport = async () => {
    if (!dashboardRef.current) return
    const canvas = await html2canvas(dashboardRef.current)
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'sprintdesk-analytics.png'
    link.href = url
    link.click()
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6 overflow-y-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Gain insights into your team's sprint performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input 
            type="date" 
            className="w-auto h-9 text-sm" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input 
            type="date" 
            className="w-auto h-9 text-sm" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export PNG
          </Button>
        </div>
      </div>

      <div ref={dashboardRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-background p-2 rounded-xl">
        {/* Sprint Velocity */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sprint Velocity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Total" fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Task Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Priority Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || COLORS[0]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Trend */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Completion Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Created" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
