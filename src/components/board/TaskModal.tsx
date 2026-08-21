import * as React from 'react'
import type { Task } from '../../api/board'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Modal } from '../ui/Modal'
import { useBoardStore } from '../../store/useBoardStore'
import { useToast } from '../ui/useToast'

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { addTask } = useBoardStore()
  const { toast } = useToast()
  
  const [formData, setFormData] = React.useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 1,
    sprintId: 3,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    addTask(formData as any)
    toast({ title: 'Task created successfully', type: 'success' })
    setFormData({
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      assigneeId: 1,
      sprintId: 3,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Title *</label>
          <Input 
            required
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Implement feature X"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add details..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select 
              value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
              options={[
                { label: 'Backlog', value: 'backlog' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Review', value: 'review' },
                { label: 'Done', value: 'done' },
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Priority</label>
            <Select 
              value={formData.priority} 
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Modal>
  )
}
