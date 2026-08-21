import { describe, it, expect, beforeEach } from 'vitest'
import { useBoardStore } from './useBoardStore'

describe('useBoardStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useBoardStore.setState({
      tasks: [],
      hasLoaded: false,
    })
  })

  it('should add a task', () => {
    const store = useBoardStore.getState()
    store.addTask({
      title: 'Test Task',
      description: 'Test Description',
      status: 'backlog',
      priority: 'low',
      assigneeId: 1,
      sprintId: 1,
      dueDate: '',
    })

    const tasks = useBoardStore.getState().tasks
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Test Task')
    expect(tasks[0].status).toBe('backlog')
  })

  it('should update a task', () => {
    const store = useBoardStore.getState()
    store.addTask({
      title: 'Task to update',
      description: '',
      status: 'backlog',
      priority: 'low',
      assigneeId: 1,
      sprintId: 1,
      dueDate: '',
    })

    const taskId = useBoardStore.getState().tasks[0].id
    useBoardStore.getState().updateTask(taskId, { title: 'Updated Title' })

    const updatedTask = useBoardStore.getState().tasks.find(t => t.id === taskId)
    expect(updatedTask?.title).toBe('Updated Title')
  })

  it('should move a task', () => {
    const store = useBoardStore.getState()
    store.addTask({
      title: 'Task 1',
      description: '',
      status: 'backlog',
      priority: 'low',
      assigneeId: 1,
      sprintId: 1,
      dueDate: '',
    })
    
    const taskId = useBoardStore.getState().tasks[0].id
    useBoardStore.getState().moveTask(taskId, 'done', 0)

    const movedTask = useBoardStore.getState().tasks.find(t => t.id === taskId)
    expect(movedTask?.status).toBe('done')
  })

  it('should delete a task', () => {
    const store = useBoardStore.getState()
    store.addTask({
      title: 'Task to delete',
      description: '',
      status: 'backlog',
      priority: 'low',
      assigneeId: 1,
      sprintId: 1,
      dueDate: '',
    })

    const taskId = useBoardStore.getState().tasks[0].id
    useBoardStore.getState().deleteTask(taskId)

    const tasks = useBoardStore.getState().tasks
    expect(tasks).toHaveLength(0)
  })
})
