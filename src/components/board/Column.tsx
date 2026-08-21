import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task } from '../../api/board'
import { TaskCard } from './TaskCard'
import { cn } from '../../lib/utils'

interface ColumnProps {
  id: Task['status'];
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function Column({ id, title, tasks, onTaskClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'Column', column: id }
  })

  return (
    <div className="flex w-80 min-w-[320px] flex-col gap-4 rounded-xl bg-muted/50 p-4">
      <div className="flex items-center justify-between font-semibold">
        <h3 className="text-sm uppercase tracking-wider text-muted-foreground">{title}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={cn(
          "flex min-h-[200px] flex-1 flex-col gap-3 rounded-md transition-colors",
          isOver && "bg-muted"
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
