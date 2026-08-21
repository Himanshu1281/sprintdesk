import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../api/board'
import { cn } from '../../lib/utils'
import { GripVertical } from '../ui/Icons'

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground shadow-sm hover:border-primary/50 transition-colors",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
      onClick={() => onClick(task)}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute right-2 top-2 cursor-grab text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <div className="flex flex-col gap-1 pr-6">
        <h4 className="text-sm font-medium leading-none">{task.title}</h4>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", priorityColors[task.priority])}>
          {task.priority}
        </span>
        <div className="text-xs text-muted-foreground">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
        </div>
      </div>
    </div>
  )
}
