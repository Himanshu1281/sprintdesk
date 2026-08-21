import * as React from 'react'
import type { Task } from '../../api/board'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { X, Trash } from '../ui/Icons'
import { useBoardStore } from '../../store/useBoardStore'
import { useToast } from '../ui/useToast'
import { Modal } from '../ui/Modal'
import mockData from '../../data/mock-data.json'

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDrawer({ task, onClose }: TaskDrawerProps) {
  const { updateTask, deleteTask } = useBoardStore()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<Task>>({})
  const [isConfirmDelete, setIsConfirmDelete] = React.useState(false)

  React.useEffect(() => {
    if (task) {
      setFormData(task)
      setIsEditing(false)
    }
  }, [task])

  if (!task) return null

  const handleSave = () => {
    updateTask(task.id, formData)
    setIsEditing(false)
    toast({ title: 'Task updated', type: 'success' })
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setIsConfirmDelete(false)
    onClose()
    toast({ title: 'Task deleted', type: 'success' })
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background p-6 shadow-xl animate-in slide-in-from-right sm:max-w-lg overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">TASK-{task.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsConfirmDelete(true)}>
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input 
                  value={formData.title || ''} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Assignee</label>
                  <Select 
                    value={formData.assigneeId?.toString()} 
                    onChange={(e) => setFormData({ ...formData, assigneeId: parseInt(e.target.value) })}
                    options={mockData.users.map(u => ({ label: `${u.name} (${u.id})`, value: u.id.toString() }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Due Date</label>
                  <Input 
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{task.title}</h2>
              </div>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium capitalize">{task.status.replace('-', ' ')}</div>
                
                <div className="text-muted-foreground">Priority</div>
                <div className="font-medium capitalize">{task.priority}</div>
                
                <div className="text-muted-foreground">Assignee</div>
                <div className="font-medium">
                  {mockData.users.find(u => u.id === task.assigneeId)?.name} ({task.assigneeId})
                </div>
                
                <div className="text-muted-foreground">Due Date</div>
                <div className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                  Edit Task
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isConfirmDelete} onClose={() => setIsConfirmDelete(false)} title="Delete Task">
        <p className="mb-6">Are you sure you want to permanently delete this task? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsConfirmDelete(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete Task</Button>
        </div>
      </Modal>
    </>
  )
}
