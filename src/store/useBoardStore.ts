import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '../api/board'

interface BoardState {
  tasks: Task[];
  lastTasksState: Task[] | null;
  hasLoaded: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'completedAt'>) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  moveTask: (taskId: number, newStatus: Task['status'], newOrder: number) => void;
  deleteTask: (taskId: number) => void;
  undoMove: () => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],
      lastTasksState: null,
      hasLoaded: false,
      setTasks: (tasks) => set({ tasks, hasLoaded: true }),
      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          ...taskData,
          id: Math.max(0, ...state.tasks.map(t => t.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: taskData.status === 'done' ? new Date().toISOString() : null,
          // put it at the bottom of the column
          order: state.tasks.filter(t => t.status === taskData.status).length,
        }
        return { tasks: [...state.tasks, newTask] }
      }),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === taskId) {
            const updated = { ...task, ...updates, updatedAt: new Date().toISOString() }
            if (updates.status === 'done' && task.status !== 'done') {
              updated.completedAt = new Date().toISOString()
            }
            return updated
          }
          return task
        })
      })),
      moveTask: (taskId, newStatus, newOrder) => set((state) => {
        const taskIndex = state.tasks.findIndex(t => t.id === taskId)
        if (taskIndex === -1) return state

        const task = state.tasks[taskIndex]
        const oldStatus = task.status
        
        // Update task status
        const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        if (newStatus === 'done' && oldStatus !== 'done') {
          updatedTask.completedAt = new Date().toISOString()
        }
        
        const otherTasks = state.tasks.filter(t => t.id !== taskId && t.status !== newStatus && t.status !== oldStatus)
        const oldCol = state.tasks.filter(t => t.id !== taskId && t.status === oldStatus).sort((a, b) => a.order - b.order)
        const newCol = state.tasks.filter(t => t.id !== taskId && t.status === newStatus).sort((a, b) => a.order - b.order)
        
        if (oldStatus === newStatus) {
          oldCol.splice(newOrder, 0, updatedTask)
          oldCol.forEach((t, i) => t.order = i)
          return { tasks: [...otherTasks, ...oldCol], lastTasksState: state.tasks }
        } else {
          oldCol.forEach((t, i) => t.order = i)
          newCol.splice(newOrder, 0, updatedTask)
          newCol.forEach((t, i) => t.order = i)
          return { tasks: [...otherTasks, ...oldCol, ...newCol], lastTasksState: state.tasks }
        }
      }),
      undoMove: () => set((state) => {
        if (!state.lastTasksState) return state
        return { tasks: state.lastTasksState, lastTasksState: null }
      }),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId)
      })),
    }),
    {
      name: 'board-storage',
    }
  )
)
