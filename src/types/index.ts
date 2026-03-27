// Ortak tip tanimlari — Agent A ve Agent B arasindaki Veri Sozlesmesi
// Bu dosya yalnizca Agent A tarafindan guncellenir; Agent B sadece okur.

export type Role = 'admin' | 'worker'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type OperationStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled'
export type StepStatus = 'pending' | 'active' | 'completed'

export type UserDTO = {
  id: string
  name: string
  email: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export type StepDTO = {
  id: string
  operationId: string
  title: string
  description: string | null
  order: number
  status: StepStatus
  assignedTo: string
  assignee: Pick<UserDTO, 'id' | 'name' | 'email'>
  operation: Pick<OperationDTO, 'id' | 'title' | 'priority' | 'status' | 'description'>
  completedAt: Date | null
  completedBy: string | null
  createdAt: Date
  updatedAt: Date
}

export type OperationDTO = {
  id: string
  title: string
  description: string | null
  priority: Priority
  status: OperationStatus
  createdBy: string
  creator: Pick<UserDTO, 'id' | 'name' | 'email'>
  steps: StepDTO[]
  createdAt: Date
  updatedAt: Date
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
}

/** Admin dashboard istatistikleri */
export type AdminStats = {
  totalOperations: number
  activeOperations: number
  completedOperations: number
  totalWorkers: number
}
