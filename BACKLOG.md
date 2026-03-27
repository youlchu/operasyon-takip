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

## Bekleyen (Pending)

### TASK-001 — Veri Sozlesmesi + Proje Altyapisi

**Aciklama**: Agent A, tum projenin kullanacagi paylasilan tipleri `src/types/index.ts` dosyasina yazar. Ayrica `src/constants/index.ts` icinde renk map'leri ve label sabitleri tanimlar. Bu dosyalar Agent B'nin frontend islerini baslatabilmesi icin zorunludur.
**Kabul Kriterleri**:
- [ ] `src/types/index.ts` yukardaki Data Contract'daki tum tipleri icerir
- [ ] `src/constants/index.ts` icinde `PRIORITY_COLORS`, `PRIORITY_LABELS`, `OPERATION_STATUS_COLORS`, `OPERATION_STATUS_LABELS`, `STEP_STATUS_COLORS`, `STEP_STATUS_LABELS` sabitleri tanimli
- [ ] `src/lib/utils.ts` icinde `cn()` (clsx + tailwind-merge), `formatDate()`, `formatDateTime()` fonksiyonlari var
- [ ] TypeScript strict mode hata vermiyor
**Oncelik**: P0
**Atanan**: Agent A
**Durum**: pending

---

### TASK-002 — Prisma Schema + Veritabani Katmani

**Aciklama**: Agent A, CLAUDE.md'deki veri modellerine gore Prisma schema'yi olusturur, migration calistirir ve gelistirme icin seed data yazar. Bu gorev tamamlanmadan hicbir server action calismaz.
**Kabul Kriterleri**:
- [ ] `prisma/schema.prisma` icinde `User`, `Operation`, `Step` modelleri tanimli (CLAUDE.md'deki alanlarin tamami mevcut)
- [ ] `npx prisma migrate dev --name init` basariyla calisiyor
- [ ] `prisma/seed.ts` en az 1 admin, 3 worker, 2 operasyon, 6 adim icerecek sekilde yazili
- [ ] `npx prisma db seed` basariyla calisiyor
- [ ] `src/lib/db.ts` icinde Prisma Client singleton instance var
**Oncelik**: P0
**Atanan**: Agent A
**Durum**: pending

---

### TASK-003 — Auth Yapisi + Middleware

**Aciklama**: Agent A, NextAuth.js v5 ile kimlik dogrulama sistemini kurar. JWT strategy kullanilir. Middleware ile route korumalari eklenir.
**Kabul Kriterleri**:
- [ ] `src/lib/auth.ts` icinde NextAuth yapilandirmasi (Credentials provider, bcrypt parola dogrulama, session callback'leri — user.id ve user.role JWT'ye eklenir)
- [ ] `src/lib/auth.config.ts` edge-uyumlu config (DB bagimsiz, middleware icin)
- [ ] `src/app/api/auth/[...nextauth]/route.ts` catch-all handler
- [ ] `src/middleware.ts` `/dashboard/*` rotalarini korur; admin/worker rol ayrimini yapar; giris yapmisin kullanicilari dashboard'a yonlendirir
- [ ] `src/actions/auth.ts` icinde `login` ve `logout` server action'lari (ActionResult donuyor)
- [ ] `src/providers/SessionProvider.tsx` ve `src/providers/Providers.tsx` bilesenler hazir
- [ ] `src/hooks/useCurrentUser.ts` hook'u `SessionUser` tipi donduruyor
- [ ] `.env.example` dosyasi `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` anahtarlariyla guncel
**Oncelik**: P0
**Atanan**: Agent A
**Durum**: pending

---

### TASK-004 — Operations Queries + Server Actions

**Aciklama**: Agent A, operasyon CRUD islemleri icin query fonksiyonlarini ve server action'larini yazar. Tum donusler `ActionResult<T>` veya `OperationDTO` kullanir.
**Kabul Kriterleri**:
- [ ] `src/lib/queries/operations.ts` icinde: `getOperations()`, `getOperationById(id)`, `getAdminStats()` fonksiyonlari
- [ ] `getOperations()` donusu: `OperationDTO[]` (steps ve creator iliskileriyle)
- [ ] `getOperationById(id)` donusu: `OperationDTO | null` (steps.assignee iliskileriyle, steps order'a gore sirali)
- [ ] `getAdminStats()` donusu: `AdminStats`
- [ ] `src/lib/validations/operation.ts` icinde Zod semalari: `createOperationSchema`, `updateOperationSchema`
- [ ] `src/actions/operations.ts` icinde: `createOperation`, `updateOperation`, `deleteOperation`, `startOperation`, `cancelOperation` server action'lari
- [ ] Her action basinda auth + admin rol kontrolu yapiliyor
- [ ] Her action Zod validasyonu yapiyor
- [ ] Her action `revalidatePath` ile ilgili sayfalari guncellliyor
**Oncelik**: P0
**Atanan**: Agent A
**Durum**: pending

---

### TASK-005 — Steps + Workers Queries + Server Actions

**Aciklama**: Agent A, adim tamamlama is akisini ve isci yonetimi islemlerini yazar. `completeStep` action'i kritik is akisini yonetiyor: adim tamamlandiginda bir sonraki adimu aktiflestirir, son adimsa operasyonu "completed" yapar.
**Kabul Kriterleri**:
- [ ] `src/lib/queries/steps.ts` icinde: `getActiveStepsByWorker(userId)`, `getCompletedStepsByWorker(userId)` fonksiyonlari
- [ ] `getActiveStepsByWorker` IDOR korumali sorgu yapiyor (assignedTo: userId, status: 'active')
- [ ] `src/lib/validations/step.ts` Zod semalari: `createStepSchema`, `updateStepSchema`
- [ ] `src/actions/steps.ts` icinde: `createStep`, `updateStep`, `deleteStep`, `completeStep` action'lari
- [ ] `completeStep`: mevcut adimi 'completed' yapar, siradaki adimi 'active' yapar, son adimsa operasyonu 'completed' yapar — tek bir transaction icinde
- [ ] `src/lib/queries/workers.ts` icinde: `getWorkers()`, `getWorkerById(id)` fonksiyonlari (`UserDTO` donduruyor)
- [ ] `src/lib/validations/worker.ts` Zod semalari: `createWorkerSchema`, `updateWorkerSchema`
- [ ] `src/actions/workers.ts` icinde: `createWorker`, `updateWorker`, `deleteWorker` action'lari (parola bcrypt ile hashleniyor)
**Oncelik**: P0
**Atanan**: Agent A
**Durum**: pending

---

### TASK-006 — Temel UI Bilesenleri

**Aciklama**: Agent B, tum sayfalar tarafindan kullanilacak genel UI bilesenleri yazar. Bu bilesenler Data Contract'taki tipleri kullanir. Hicbir backend baglantisi yoktur; salt UI'dir.
**Kabul Kriterleri**:
- [ ] `src/components/ui/Button.tsx` — variant: `primary | secondary | danger | ghost`, size: `sm | md | lg`, loading state destegi
- [ ] `src/components/ui/Card.tsx` — `header`, `body`, `footer` slot'lari, className prop'u
- [ ] `src/components/ui/Badge.tsx` — `Priority` ve `OperationStatus` ve `StepStatus` icin renk varyantlari (Data Contract'taki tipler kullanilir)
- [ ] `src/components/ui/Input.tsx` — label, error mesaji, id-htmlFor eslesmesi
- [ ] `src/components/ui/Select.tsx` — label, error mesaji destegi
- [ ] `src/components/ui/Textarea.tsx` — label, error mesaji destegi
- [ ] `src/components/ui/Modal.tsx` — `role="dialog"`, `aria-modal`, ESC ile kapanma, focus trap
- [ ] `src/components/ui/Spinner.tsx` — boyut varyantlari
- [ ] `src/components/ui/EmptyState.tsx` — ikon, baslik, aciklama, aksiyon butonu slot'lari
- [ ] `src/components/ui/ConfirmDialog.tsx` — onay dialogu (Modal uzerine kurulu)
- [ ] Tum bilesenler `"use client"` directive kullanir
- [ ] `cn()` utility her kosullu class birlestirmesinde kullanilir
**Oncelik**: P0
**Atanan**: Agent B
**Durum**: pending

---

### TASK-007 — Layout Bilesenleri + Temel Sayfalar

**Aciklama**: Agent B, dashboard shell'ini ve temel sayfalari olusturur. Sidebar ve Header, `SessionUser` tipini kullanarak admin/worker ayrimi yapar. Bu gorev layout altyapisini tamamlar.
**Kabul Kriterleri**:
- [ ] `src/components/layout/Sidebar.tsx` — admin icin: "Dashboard", "Operasyonlar", "Isciler" linkleri; worker icin: "Gorevlerim", "Gecmis" linkleri
- [ ] `src/components/layout/Header.tsx` — kullanici adi, rol rozeti, cikis butonu
- [ ] `src/components/layout/DashboardShell.tsx` — sidebar + header + icerik alani wrapper
- [ ] `src/app/dashboard/layout.tsx` — DashboardShell kullanan layout
- [ ] `src/app/page.tsx` — `/login`'e server-side redirect
- [ ] `src/app/login/page.tsx` — `LoginForm` bileseni iceren sayfa
- [ ] `src/components/auth/LoginForm.tsx` — email + password formu, `login` server action'i cagirir, hata mesaji gosterir
- [ ] `src/app/not-found.tsx` — ozel 404 sayfasi
- [ ] `src/app/layout.tsx` — root layout (Providers wrapper, font)
- [ ] `src/providers/Providers.tsx` — SessionProvider + Toaster sariyor
**Oncelik**: P0
**Atanan**: Agent B
**Durum**: pending

---

### TASK-008 — Admin Dashboard + Operasyon Sayfaları

**Aciklama**: Agent B, admin tarafindaki tum sayfalari ve bilesenleri olusturur. `OperationDTO` tipini kullanir. Server action'lari cagirir ama dogrudan Prisma kullanmaz.
**Kabul Kriterleri**:
- [ ] `src/app/dashboard/admin/page.tsx` — `getAdminStats()` ile istatistik kartlari (toplam/aktif/tamamlanan operasyon, isci sayisi)
- [ ] `src/app/dashboard/admin/loading.tsx` — skeleton loader
- [ ] `src/app/dashboard/admin/operations/page.tsx` — `getOperations()` ile operasyon listesi, durum/oncelik filtresi
- [ ] `src/components/operations/OperationCard.tsx` — baslik, durum rozeti, oncelik rozeti, ilerleme bilgisi
- [ ] `src/components/operations/OperationStatusBadge.tsx` — `OperationStatus` tipini kullanir
- [ ] `src/components/operations/PriorityBadge.tsx` — `Priority` tipini kullanir
- [ ] `src/app/dashboard/admin/operations/new/page.tsx` — `OperationForm` bileseni
- [ ] `src/components/operations/OperationForm.tsx` — React Hook Form + Zod, `createOperation` action'ini cagirir, adim ekleme destegi
- [ ] `src/components/operations/StepForm.tsx` — adim basligi, aciklamasi, isci secimi (worker listesi prop olarak gelir)
- [ ] `src/app/dashboard/admin/operations/[id]/page.tsx` — `getOperationById()` ile detay, timeline gorunumu, baslatma/iptal butonlari
- [ ] `src/components/operations/OperationTimeline.tsx` — sirali adim listesi (`StepDTO[]` kullanir)
- [ ] `src/components/operations/StepCard.tsx` — timeline icindeki tekil adim karti
- [ ] `src/app/dashboard/admin/operations/[id]/edit/page.tsx` — duzenleme formu
- [ ] Her sayfa icin `loading.tsx` ve `error.tsx` dosyalari
**Oncelik**: P1
**Atanan**: Agent B
**Durum**: pending

---

### TASK-009 — Isci Dashboard + Gecmis Sayfasi

**Aciklama**: Agent B, isci tarafindaki sayfalari olusturur. `StepDTO` tipini kullanir. `WorkerDashboardRefresher` bileseni 30 saniyede bir `router.refresh()` cagirir (polling stratejisi).
**Kabul Kriterleri**:
- [ ] `src/app/dashboard/worker/page.tsx` — `getActiveStepsByWorker(userId)` ile aktif adim kartlari
- [ ] `src/components/worker/ActiveStepCard.tsx` — buyuk kart: operasyon adi, adim adi, aciklama, oncelik rozeti, "Adimi Tamamla" butonu (`completeStep` action'ini cagirir)
- [ ] `src/components/worker/WorkerDashboardRefresher.tsx` — `"use client"`, 30sn interval + visibilitychange event ile `router.refresh()`
- [ ] `src/app/dashboard/worker/history/page.tsx` — `getCompletedStepsByWorker(userId)` ile tamamlanan adimlar listesi
- [ ] `src/components/worker/CompletedStepCard.tsx` — tamamlanma tarihi, operasyon adi, adim adi
- [ ] Worker sayfalarinda `loading.tsx` ve `error.tsx` dosyalari
- [ ] Aktif adim yoksa anlamli EmptyState gosteriliyor
**Oncelik**: P1
**Atanan**: Agent B
**Durum**: pending

---

### TASK-010 — Isci Yonetim Sayfaları (Admin)

**Aciklama**: Agent B, admin'in isci ekleyip duzenliyebilecegi sayfalari olusturur. `UserDTO` tipini kullanir.
**Kabul Kriterleri**:
- [ ] `src/app/dashboard/admin/workers/page.tsx` — `getWorkers()` ile isci listesi (tablo gorunumu: isim, email, olusturma tarihi, duzenle butonu)
- [ ] `src/app/dashboard/admin/workers/new/page.tsx` — yeni isci formu (isim, email, sifre), `createWorker` action'ini cagirir
- [ ] `src/app/dashboard/admin/workers/[id]/edit/page.tsx` — isci duzenleme formu, `updateWorker` action'ini cagirir
- [ ] Her sayfa icin `loading.tsx` ve `error.tsx` dosyalari
- [ ] Isci listesi bos ise EmptyState gosteriliyor
**Oncelik**: P1
**Atanan**: Agent B
**Durum**: pending

---

## Devam Eden (In Progress)

---

## Tamamlanan (Done)

---

## Iptal Edilen (Cancelled)
