import * as React from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Column } from '../components/board/Column'
import { TaskCard } from '../components/board/TaskCard'
import { TaskDrawer } from '../components/board/TaskDrawer'
import { TaskModal } from '../components/board/TaskModal'
import { useBoardStore } from '../store/useBoardStore'
import { fetchTasks } from '../api/board'
import type { Task } from '../api/board'
import { Button } from '../components/ui/Button'
import { Plus } from '../components/ui/Icons'
import { useToast } from '../components/ui/useToast'
import { Select } from '../components/ui/Select'
import mockData from '../data/mock-data.json'

const COLUMNS: { id: Task['status']; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]

export function Board() {
  const { tasks, setTasks, hasLoaded, moveTask, undoMove } = useBoardStore()
  const { toast } = useToast()
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [priorityFilter, setPriorityFilter] = React.useState('all')
  const [assigneeFilter, setAssigneeFilter] = React.useState('all')
  
  React.useEffect(() => {
    if (!hasLoaded) {
      fetchTasks().then(setTasks)
    }
  }, [hasLoaded, setTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)
    const overColumnId = COLUMNS.find(c => c.id === overId)?.id

    if (!activeTask) return

    if (overTask) {
      // Dropped over another task
      const newStatus = overTask.status
      const newOrder = over.data.current?.sortable?.index ?? 0
      moveTask(activeTask.id, newStatus, newOrder)
    } else if (overColumnId) {
      // Dropped over an empty column
      moveTask(activeTask.id, overColumnId, 0)
    }

    toast({
      title: "Task moved",
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => undoMove()}
        >
          Undo
        </Button>
      )
    })
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sprint Board</h1>
          <p className="text-muted-foreground">Manage your sprint tasks and workflow.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { label: 'All Priorities', value: 'all' },
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' }
            ]}
          />
          <Select 
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            options={[
              { label: 'All Assignees', value: 'all' },
              ...mockData.users.map(u => ({
                label: `${u.name} (${u.id})`,
                value: u.id.toString()
              }))
            ]}
          />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-6">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter(t => {
                if (t.status !== col.id) return false
                if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
                if (assigneeFilter !== 'all' && t.assigneeId.toString() !== assigneeFilter) return false
                return true
              }).sort((a, b) => a.order - b.order)
              
              return (
                <Column
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={colTasks}
                  onTaskClick={handleTaskClick}
                />
              )
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 scale-105 opacity-80 transition-transform">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
