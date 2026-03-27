# Backlog

<!-- ================================================================
     Bu dosya Product Manager agenti tarafindan yonetilir.
     Developer agentlari buradan kendi islerini alir.

     Gorev ID formati : TASK-NNN
     Oncelik          : P0 (kritik) | P1 (onemli) | P2 (nice-to-have)
     Durum            : pending | in_progress | done | cancelled
     Atanan           : Agent A (Backend) | Agent B (Frontend)
     ================================================================ -->

---

## Veri Sozlesmesi (Data Contract)

> **Bu sozlesme Agent A ve Agent B arasindaki tek baglanti noktasidir.**
> Agent A bu tipleri `src/types/index.ts` dosyasina yazar.
> Agent B bu tipleri aynen kullanir — hicbir degisiklik yapmaz.

```typescript
// src/types/index.ts — ORTAK SOZLESME

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

// Dashboard istatistikleri
export type AdminStats = {
  totalOperations: number
  activeOperations: number
  completedOperations: number
  totalWorkers: number
}
```

---


---

## Devam Eden (In Progress)

---

## Tamamlanan (Done)

### TASK-001 — Veri Sozlesmesi + Proje Altyapisi
**Durum**: done | **Atanan**: Agent A

### TASK-002 — Prisma Schema + Veritabani Katmani
**Durum**: done | **Atanan**: Agent A

### TASK-003 — Auth Yapisi + Middleware
**Durum**: done | **Atanan**: Agent A

### TASK-004 — Operations Queries + Server Actions
**Durum**: done | **Atanan**: Agent A

### TASK-005 — Steps + Workers Queries + Server Actions
**Durum**: done | **Atanan**: Agent A

### TASK-006 — Temel UI Bilesenleri
**Durum**: done | **Atanan**: Agent B

### TASK-007 — Layout Bilesenleri + Temel Sayfalar
**Durum**: done | **Atanan**: Agent B

### TASK-008 — Admin Dashboard + Operasyon Sayfalari
**Durum**: done | **Atanan**: Agent B

### TASK-009 — Isci Dashboard + Gecmis Sayfasi
**Durum**: done | **Atanan**: Agent B

### TASK-010 — Isci Yonetim Sayfalari (Admin)
**Durum**: done | **Atanan**: Agent B

### TASK-011 — Entegrasyon Fix: Login Redirect + Tip Guvenligi
**Durum**: done | **Atanan**: Agent A

---

## Iptal Edilen (Cancelled)
