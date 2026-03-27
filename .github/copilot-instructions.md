# Copilot Instructions

## Project Overview

Bu proje **operasyon-takip** (Operasyon Takip Sistemi) adinda bir **dashboard** uygulamasidir.
Next.js (App Router), TypeScript ve Tailwind CSS ile gelistirilmektedir.

Uygulama, bir organizasyondaki **operasyonlarin adim adim tanimlanmasini, iscilere atanmasini ve iscilerin bu adimlari sirayla ilerletmesini** saglayan bir is takip platformudur.

---

## Uygulama Ne Is Yapar?

### Temel Amac
Yoneticiler, bir operasyonu (ornegin bir uretim sureci, bir proje, bir siparis akisi) **birden fazla sirali adima** boler. Her adimi bir **isciye** atar. Isciler kendi panellerinde yalnizca kendilerine atanan ve **sirasi gelen** adimi gorur. Adimi tamamladiklarinda bir sonraki adim, o adima atanan iscinin ekranina duser. Boylece operasyon bastan sona sirali bir sekilde ilerler.

### Gercek Hayat Ornegi
Bir uretim hatti dusunun:
1. **Adim 1** - Hammadde Kesim -> Isci A'ya atandi
2. **Adim 2** - Montaj -> Isci B'ye atandi
3. **Adim 3** - Kalite Kontrol -> Isci C'ye atandi
4. **Adim 4** - Paketleme -> Isci A'ya atandi

Operasyon basladiginda **yalnizca Isci A** ekraninda "Hammadde Kesim" kartini gorur. Isci A bu adimi tamamladiginda, Isci B'nin ekranina "Montaj" karti duser. Bu sekilde operasyon son adima kadar ilerler.

---

## Kullanici Rolleri

### 1. Yonetici (Admin)
- Sisteme giris yapar ve **yonetici dashboard**'unu gorur.
- **Operasyon olusturabilir**: Operasyona isim, aciklama ve oncelik seviyesi verir.
- **Adim tanimlayabilir**: Her operasyona sirali adimlar ekler. Her adimin bir adi, aciklamasi ve sirasi vardir.
- **Adimlara isci atayabilir**: Her adimi bir isciye atar.
- **Operasyonu baslatabilir**: Operasyonu baslattiginda ilk adim aktif hale gelir ve atanan iscinin ekranina duser.
- **Tum operasyonlari izleyebilir**: Hangi operasyon hangi adimda, hangi iscide bekliyor - tum durumu canli gorebilir.
- **Isci yonetimi yapabilir**: Sisteme yeni isci ekleyebilir, mevcut iscileri duzenleyebilir.

### 2. Isci (Worker)
- Sisteme giris yapar ve **isci dashboard**'unu gorur.
- Ekraninda yalnizca **kendisine atanmis ve sirasi gelmis aktif adimlari** kart olarak gorur.
- Her kartta adimin adi, aciklamasi, ait oldugu operasyon bilgisi ve oncelik seviyesi yer alir.
- Kartin uzerindeki **"Adimi Tamamla"** butonuna basarak adimi ilerletir.
- Tamamlanan adim karttan kaybolur ve bir sonraki adim ilgili isciye duser.
- Gecmis tamamladigi adimlarin listesini gorebilir.

---

## Veri Modelleri

### User (Kullanici)
- id: string (cuid) - Benzersiz kullanici ID'si
- name: string - Kullanici adi soyadi
- email: string (unique) - E-posta adresi
- role: enum (admin, worker) - Kullanici rolu
- password: string - Hashlenmis parola (bcrypt)
- createdAt: datetime - Olusturulma tarihi
- updatedAt: datetime - Son guncellenme tarihi

### Operation (Operasyon)
- id: string (cuid) - Benzersiz operasyon ID'si
- title: string - Operasyon basligi
- description: string (opsiyonel) - Operasyon aciklamasi
- priority: enum (low, medium, high, critical) - Oncelik seviyesi
- status: enum (draft, in_progress, completed, cancelled) - Operasyon durumu
- createdBy: string - Olusturan yoneticinin user ID'si (foreign key -> User)
- createdAt: datetime - Olusturulma tarihi
- updatedAt: datetime - Son guncellenme tarihi
- Iliskiler: steps (Step[]), creator (User)

### Step (Adim)
- id: string (cuid) - Benzersiz adim ID'si
- operationId: string - Ait oldugu operasyonun ID'si (foreign key -> Operation)
- title: string - Adim basligi
- description: string (opsiyonel) - Adim aciklamasi
- order: number - Sira numarasi (1'den baslar)
- status: enum (pending, active, completed) - Adim durumu
- assignedTo: string - Atanan iscinin user ID'si (foreign key -> User)
- completedAt: datetime (nullable) - Tamamlanma tarihi
- completedBy: string (nullable) - Tamamlayan iscinin user ID'si
- createdAt: datetime - Olusturulma tarihi
- updatedAt: datetime - Son guncellenme tarihi
- Iliskiler: operation (Operation), assignee (User)

---

## Is Akisi (Workflow)

1. Yonetici operasyon olusturur (status: "draft").
2. Yonetici adimlari tanimlar (sirali, her biri status: "pending").
3. Yonetici her adima isci atar.
4. Yonetici operasyonu baslatir (startOperation server action).
5. Operasyon status "in_progress" olur, Adim 1 status "active" olur.
6. Atanan iscinin dashboard'unda kart gorunur.
7. Isci "Tamamla" der (completeStep server action) -> Adim 1 "completed" olur, Adim 2 "active" olur.
8. Adim 2'ye atanan iscinin dashboard'unda kart gorunur.
9. Bu dongu son adima kadar devam eder.
10. Son adim tamamlandiginda operasyon status "completed" olur.

---

## Proje Dosya Yapisi (File Structure)

```
operasyon-takip/
├── .github/
│   └── copilot-instructions.md          # Bu dosya - Copilot talimatlari
│
├── prisma/
│   ├── schema.prisma                     # Veritabani sema tanimlari (User, Operation, Step modelleri)
│   ├── seed.ts                           # Gelistirme icin ornek veri (seed data)
│   └── migrations/                       # Prisma migration dosyalari (otomatik olusur)
│
├── public/                               # Statik dosyalar (favicon, logo vb.)
│
├── src/
│   ├── app/
│   │   ├── globals.css                   # Tailwind CSS import ve global stiller
│   │   ├── layout.tsx                    # Root layout (html, body, font, Providers wrapper)
│   │   ├── page.tsx                      # Ana sayfa - login sayfasina yonlendirme (redirect)
│   │   ├── not-found.tsx                 # Ozel 404 sayfasi
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                  # Giris sayfasi (LoginForm bileseni)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                # Dashboard ortak layout (Sidebar + Header + icerik alani)
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx              # Yonetici ana dashboard (istatistikler, ozet kartlar)
│   │   │   │   ├── loading.tsx           # Admin dashboard loading state
│   │   │   │   ├── error.tsx             # Admin bolumu hata siniri (Error Boundary)
│   │   │   │   │
│   │   │   │   ├── operations/
│   │   │   │   │   ├── page.tsx          # Operasyon listesi (tablo/kart gorunumu, filtreleme)
│   │   │   │   │   ├── loading.tsx       # Operasyon listesi loading state
│   │   │   │   │   ├── error.tsx         # Operasyon listesi hata siniri
│   │   │   │   │   │
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx      # Yeni operasyon olusturma (form + adim ekleme)
│   │   │   │   │   │
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx      # Operasyon detayi (adim timeline, durum takibi, baslatma)
│   │   │   │   │       ├── loading.tsx   # Operasyon detay loading state
│   │   │   │   │       ├── error.tsx     # Operasyon detay hata siniri (not-found dahil)
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx  # Operasyon duzenleme (bilgi guncelleme, adim ekleme/cikarma)
│   │   │   │   │
│   │   │   │   └── workers/
│   │   │   │       ├── page.tsx          # Isci listesi (tablo gorunumu)
│   │   │   │       ├── loading.tsx       # Isci listesi loading state
│   │   │   │       ├── error.tsx         # Isci listesi hata siniri
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx      # Yeni isci ekleme formu
│   │   │   │       └── [id]/
│   │   │   │           └── edit/
│   │   │   │               └── page.tsx  # Isci duzenleme formu
│   │   │   │
│   │   │   └── worker/
│   │   │       ├── page.tsx              # Isci dashboard (aktif adim kartlari)
│   │   │       ├── loading.tsx           # Isci dashboard loading state
│   │   │       ├── error.tsx             # Isci dashboard hata siniri
│   │   │       └── history/
│   │   │           ├── page.tsx          # Tamamlanan adimlar gecmisi (liste/tablo)
│   │   │           └── loading.tsx       # Gecmis loading state
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts          # NextAuth.js catch-all route handler
│   │
│   ├── actions/
│   │   ├── auth.ts                       # Login/logout server actions
│   │   ├── operations.ts                 # Operasyon CRUD server actions (create, update, delete, start, cancel)
│   │   ├── steps.ts                      # Adim CRUD + tamamlama server actions (create, update, delete, complete)
│   │   └── workers.ts                    # Isci CRUD server actions (create, update, delete)
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx                # Genel buton (variant: primary, secondary, danger, ghost)
│   │   │   ├── Card.tsx                  # Genel kart (header, body, footer slotlari)
│   │   │   ├── Badge.tsx                 # Durum/oncelik rozet bileseni (renk varyantlari)
│   │   │   ├── Modal.tsx                 # Modal/dialog bileseni
│   │   │   ├── Input.tsx                 # Form input (label, error destegiyle)
│   │   │   ├── Select.tsx                # Form select bileseni
│   │   │   ├── Textarea.tsx              # Form textarea bileseni
│   │   │   ├── Spinner.tsx               # Yukleniyor animasyonu
│   │   │   ├── EmptyState.tsx            # Bos durum bileseni (ikon + mesaj + aksiyon)
│   │   │   └── ConfirmDialog.tsx         # Onay dialogu (silme, iptal islemleri icin)
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               # Dashboard yan menu (admin/worker'a gore farkli menuler)
│   │   │   ├── Header.tsx                # Ust bar (kullanici bilgisi, rol gosterimi, cikis butonu)
│   │   │   └── DashboardShell.tsx        # Dashboard ana cerceve (sidebar + header + content wrapper)
│   │   │
│   │   ├── operations/
│   │   │   ├── OperationCard.tsx          # Operasyon ozet karti (baslik, durum, oncelik, ilerleme)
│   │   │   ├── OperationForm.tsx          # Operasyon olusturma/duzenleme formu (React Hook Form + Zod)
│   │   │   ├── OperationTimeline.tsx      # Adimlarin sirali timeline gorunumu
│   │   │   ├── OperationStatusBadge.tsx   # Operasyon durum rozeti
│   │   │   ├── PriorityBadge.tsx          # Oncelik rozeti (low, medium, high, critical)
│   │   │   ├── StepForm.tsx               # Adim ekleme/duzenleme formu (isci secimi dahil)
│   │   │   └── StepCard.tsx               # Tekil adim karti (timeline icinde kullanilir)
│   │   │
│   │   ├── worker/
│   │   │   ├── ActiveStepCard.tsx         # Isci ekranindaki aktif adim karti (buyuk, dikkat cekici)
│   │   │   └── CompletedStepCard.tsx      # Tamamlanmis adim karti (gecmis sayfasinda)
│   │   │
│   │   └── auth/
│   │       └── LoginForm.tsx              # Giris formu bileseni (email, password, submit)
│   │
│   ├── lib/
│   │   ├── db.ts                          # Prisma client singleton instance
│   │   ├── auth.ts                        # NextAuth.js yapilandirmasi (providers, callbacks, session)
│   │   ├── auth.config.ts                 # Auth edge config (middleware icin, DB bagimsiz)
│   │   ├── utils.ts                       # Genel yardimci fonksiyonlar (cn, formatDate, vb.)
│   │   │
│   │   ├── validations/
│   │   │   ├── auth.ts                    # Login formu Zod semalari
│   │   │   ├── operation.ts               # Operasyon CRUD Zod semalari
│   │   │   ├── step.ts                    # Adim CRUD Zod semalari
│   │   │   └── worker.ts                  # Isci CRUD Zod semalari
│   │   │
│   │   └── queries/
│   │       ├── operations.ts              # Operasyon veri cekme fonksiyonlari (getOperations, getOperationById vb.)
│   │       ├── steps.ts                   # Adim veri cekme fonksiyonlari (getActiveSteps, getCompletedSteps vb.)
│   │       └── workers.ts                 # Isci veri cekme fonksiyonlari (getWorkers, getWorkerById vb.)
│   │
│   ├── providers/
│   │   ├── Providers.tsx                  # Tum provider'lari saran wrapper (Toaster, SessionProvider vb.)
│   │   └── SessionProvider.tsx            # NextAuth.js SessionProvider wrapper
│   │
│   ├── hooks/
│   │   └── useCurrentUser.ts             # Mevcut oturumdaki kullanici bilgisini donduren hook
│   │
│   ├── types/
│   │   └── index.ts                       # TypeScript tip tanimlari (User, Operation, Step, enums)
│   │
│   ├── constants/
│   │   └── index.ts                       # Sabit degerler (roller, oncelikler, durumlar, renk map'leri)
│   │
│   └── middleware.ts                      # Next.js Middleware - route korumasi (auth + rol bazli yonlendirme)
│
├── .env                                   # Ortam degiskenleri (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
├── .env.example                           # Ornek ortam degiskenleri (template)
├── .gitignore
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## Mimari Kararlar ve Aciklamalar

### 1. Server Actions vs API Routes
- **Server Actions** (src/actions/): Tum form submit islemleri, veri mutasyonlari (CRUD) icin kullanilir. Dogrudan form'larin action prop'una baglanir veya useActionState ile kullanilir.
- **API Routes** (src/app/api/): Yalnizca NextAuth.js handler'i icin kullanilir. Dis entegrasyon gerekmedikce yeni API route eklenmez.
- **Neden?**: Server Actions, Next.js App Router'in dogal yaklasimi. Progressive enhancement destekler, tip guvenligi saglar ve gereksiz client-side fetch kodunu ortadan kaldirir.

### 2. Veri Cekme Katmani (src/lib/queries/)
- Server Component'ler icinde dogrudan cagrilacak saf fonksiyonlar.
- Her fonksiyon Prisma client'i kullanarak veritabanindan veri ceker.
- Bu fonksiyonlar asla component dosyalarinda inline yazilmaz; her zaman queries/ altindan import edilir.
- Ornek: getOperations(), getOperationById(id), getActiveStepsByWorker(userId), getWorkers()

### 3. Validasyon Katmani (src/lib/validations/)
- Her entity icin ayri Zod semalari.
- Hem Server Actions'da (backend validation) hem de form'larda (client-side validation) ayni sema kullanilir.
- Ornek: createOperationSchema, updateOperationSchema, createStepSchema, loginSchema

### 4. Middleware (src/middleware.ts)
- Korunan route'lar: /dashboard/* -> oturum acmamis kullanicilar /login'e yonlendirilir.
- Rol bazli erisim: /dashboard/admin/* -> sadece admin, /dashboard/worker/* -> sadece worker.
- Auth olmayan sayfalar: /login, / -> oturum acmis kullanici dashboard'a yonlendirilir.

### 5. Auth Yapisi
- NextAuth.js v5 (Auth.js) kullanilir.
- src/lib/auth.ts: Ana yapilandirma (Credentials provider, Prisma adapter, session callbacks).
- src/lib/auth.config.ts: Edge-uyumlu yapilandirma (middleware icin, DB erisimi olmadan).
- src/app/api/auth/[...nextauth]/route.ts: NextAuth catch-all route handler.
- Session strategy: JWT (veritabaninda session tutulmaz, performans icin).

### 6. Component Mimarisi
- **Server Components** (varsayilan): Veri ceken, layout saglayan bilesenler. DB query'leri burada yapilir.
- **Client Components** ("use client"): Form'lar, interaktif UI, event handler'lar gerektiren bilesenler.
- src/components/ui/: Projede tekrar kullanilan genel UI bilesenleri. Hepsi "use client" olabilir.
- src/components/layout/: Sidebar ve Header client component (interaktivite), DashboardShell server component olabilir.
- src/components/operations/: Form bilesenleri client, goruntuleyiciler server.
- src/components/worker/: ActiveStepCard client (buton interaksiyonu), CompletedStepCard server olabilir.

### 7. Provider Yapisi
- src/providers/Providers.tsx: Root layout'ta children etrafini saran tek wrapper.
- Icerir: NextAuth SessionProvider, React Hot Toast Toaster.
- Root layout.tsx icerisinde <Providers>{children}</Providers> seklinde kullanilir.

---

## Sayfa Yapisi (Route Structure) - Detayli

### Genel Sayfalar
| Route | Dosya | Aciklama |
|-------|-------|----------|
| / | src/app/page.tsx | Login'e redirect (server-side redirect) |
| /login | src/app/login/page.tsx | Giris sayfasi (LoginForm bileseni) |

### Admin Sayfalari
| Route | Dosya | Aciklama |
|-------|-------|----------|
| /dashboard/admin | src/app/dashboard/admin/page.tsx | Ozet istatistikler (toplam operasyon, aktif, tamamlanan, isci sayisi) |
| /dashboard/admin/operations | src/app/dashboard/admin/operations/page.tsx | Operasyon listesi (filtreleme: durum, oncelik) |
| /dashboard/admin/operations/new | src/app/dashboard/admin/operations/new/page.tsx | Yeni operasyon + adimlar olusturma |
| /dashboard/admin/operations/[id] | src/app/dashboard/admin/operations/[id]/page.tsx | Operasyon detay (timeline, baslatma, iptal) |
| /dashboard/admin/operations/[id]/edit | src/app/dashboard/admin/operations/[id]/edit/page.tsx | Operasyon duzenleme |
| /dashboard/admin/workers | src/app/dashboard/admin/workers/page.tsx | Isci listesi |
| /dashboard/admin/workers/new | src/app/dashboard/admin/workers/new/page.tsx | Yeni isci ekleme |
| /dashboard/admin/workers/[id]/edit | src/app/dashboard/admin/workers/[id]/edit/page.tsx | Isci duzenleme |

### Worker Sayfalari
| Route | Dosya | Aciklama |
|-------|-------|----------|
| /dashboard/worker | src/app/dashboard/worker/page.tsx | Aktif adim kartlari (sirasi gelen, atanmis) |
| /dashboard/worker/history | src/app/dashboard/worker/history/page.tsx | Tamamlanmis adimlar gecmisi |

---

## UI/UX Kurallari

- **Dashboard tasarimi**: Sol tarafta sidebar, ustte header, ortada icerik alani.
- **Oncelik Renkleri**: low=Gri/Mavi, medium=Sari/Turuncu, high=Turuncu/Kirmizi, critical=Kirmizi
- **Durum Rozetleri**: draft=Gri, in_progress=Mavi, completed=Yesil, cancelled=Kirmizi, pending=Gri, active=Mavi/Sari
- **Isci Kartlari**: Buyuk, dikkat cekici kartlar. Tek bakista operasyon adi, adim adi, aciklama ve "Tamamla" butonu gorulebilmeli.
- **Responsive**: Mobil ve tablet uyumlu olmali (mobile-first yaklasim).
- **Turkce UI**: Tum arayuz metinleri Turkce olacak.
- **Loading States**: Her sayfa gecisinde skeleton/spinner gosterilecek (loading.tsx).
- **Empty States**: Veri yoksa anlamli bos durum mesajlari gosterilecek.
- **Toast Bildirimleri**: Basarili/basarisiz islem sonrasi kullaniciya bildirim gosterilecek.

---

## Teknoloji Kararlari

| Kategori | Teknoloji | Versiyon/Not |
|----------|-----------|--------------|
| Framework | Next.js | 16 (App Router) |
| Dil | TypeScript | Strict mode |
| Styling | Tailwind CSS | 4 |
| Auth | NextAuth.js (Auth.js) | v5, JWT strategy, Credentials provider |
| Veritabani | Prisma + SQLite | Gelistirme icin SQLite, prod icin PostgreSQL |
| Form Yonetimi | React Hook Form | Zod resolver ile |
| Validasyon | Zod | Hem client hem server tarafinda |
| Bildirimler | React Hot Toast | Basari/hata bildirimleri |
| Sifreleme | bcryptjs | Parola hashleme |

---

## Coding Guidelines

### Genel Kurallar
- Tum dosyalarda **TypeScript** kullan, any tipinden kacin.
- **App Router** convention'larini takip et (page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx).
- Styling icin **Tailwind CSS** kullan (gerekmedikce CSS modules kullanma).
- Varsayilan olarak **Server Components** kullan; sadece gerektiginde "use client" ekle.
- Import'larda @/* alias'ini kullan (src/ klasorune isaret eder).
- Temiz, okunabilir ve iyi belgelenmis kod yaz.
- Her fonksiyon ve bilesen icin **JSDoc** yorumlari ekle.
- Hata yonetimini (error handling) her zaman uygula - try/catch bloklari kullan.
- Turkce yorum ve aciklamalar yaz.

### Veri Islemleri
- Veri **cekme** (read): src/lib/queries/ altindaki fonksiyonlari Server Component'lerde dogrudan cagir.
- Veri **mutasyonu** (create/update/delete): src/actions/ altindaki Server Actions'lari kullan.
- **Asla** component dosyasinda dogrudan Prisma cagrisi yapma.
- Server Actions'da her zaman **Zod** ile input validation yap.
- Server Actions'da her zaman **auth kontrolu** yap (oturum ve rol dogrulama).

### Form Yonetimi
- Form bilesenleri icin **React Hook Form** + **Zod resolver** kullan.
- Ayni Zod semasini hem client (form validation) hem server (action validation) tarafinda kullan.
- Form submit sonrasi revalidatePath veya redirect ile sayfayi guncelle.

### Stil Kurallari
- cn() utility fonksiyonu ile kosullu class birlesimi yap (clsx + tailwind-merge).
- Renk ve boyut varyantlari icin Tailwind class'larini kullan, inline style yazma.
- Component'lerde className prop'u destekle (birlestirme icin).

---

## Isimlendirme Konvansiyonlari (Naming Conventions)

| Tur | Kural | Ornek |
|-----|-------|-------|
| React Component | PascalCase | `OperationCard.tsx`, `ActiveStepCard.tsx` |
| Hook | `use` prefix + camelCase | `useCurrentUser.ts`, `useAuth.ts` |
| Server Action | fiil + PascalCase | `createOperation`, `startOperation`, `completeStep` |
| Query fonksiyonu | `get`/`find` prefix | `getOperations()`, `findOperationById()` |
| Zod semasi | entity + islem + Schema | `createOperationSchema`, `updateStepSchema` |
| TypeScript tipi/interface | PascalCase | `Operation`, `Step`, `ActionResult` |
| Sabit (constant) | UPPER_SNAKE_CASE | `PRIORITY_COLORS`, `STATUS_LABELS` |
| Dosya (utility/lib) | camelCase | `db.ts`, `utils.ts`, `auth.ts` |
| CSS class (dinamik) | her zaman cn() ile | `cn('base-class', condition && 'conditional-class')` |

---

## TypeScript Konvansiyonlari

- `any` tipinden **kesinlikle** kacin; bilinmeyen tip icin `unknown` kullan.
- Interface yerine `type` kullan (Prisma'nin generate ettigi tipler `type` tabanli).
- Return tipi annotation'i her Server Action ve query fonksiyonu icin zorunlu.
- Prisma'nin urettigi tipleri `import type { User, Operation, Step } from '@prisma/client'` seklinde import et.
- `Partial<T>`, `Pick<T, K>`, `Omit<T, K>` utility tiplerini tercih et; yeni interface tanimlama.
- `satisfies` operatorunu config nesnelerinde kullan (tip guvenligi + autocomplete).

```ts
// Dogru - tip guvenligi + autocomplete
const priorityColors = {
  low: 'text-gray-500',
  medium: 'text-yellow-500',
  high: 'text-orange-500',
  critical: 'text-red-600',
} satisfies Record<Priority, string>

// Dogru - return tipi annotation
async function getOperations(): Promise<Operation[]> { ... }
```

---

## Server Action Return Type Pattern

Her Server Action `ActionResult<T>` tipini dondurmelidir. Bu tip `src/types/index.ts` icinde tanimlidir.

```ts
// src/types/index.ts
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

Her Server Action basinda **mutlaka** auth + rol kontrolu yapilmalidir:

```ts
// src/actions/operations.ts
export async function createOperation(
  formData: FormData
): Promise<ActionResult<Operation>> {
  // 1. Auth kontrolu
  const session = await auth()
  if (!session?.user) return { success: false, error: 'Yetkisiz erisim' }
  if (session.user.role !== 'admin') return { success: false, error: 'Sadece yoneticiler erisebilir' }

  // 2. Zod validasyonu
  const parsed = createOperationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: 'Gecersiz veri', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  // 3. DB islemi
  try {
    const operation = await db.operation.create({ data: { ...parsed.data, createdBy: session.user.id } })
    revalidatePath('/dashboard/admin/operations')
    return { success: true, data: operation }
  } catch {
    return { success: false, error: 'Operasyon olusturulamadi' }
  }
}
```

---

## Caching Stratejisi

Next.js App Router'da caching kurallari:

- **Server Component'lerde veri cekme**: Varsayilan olarak cache'lenmez (dinamik). `cache()` ile sararak ayni request'te tekrar kullanimi onle.
- **`revalidatePath`**: Mutation sonrasi ilgili sayfayi revalidate et. Her Server Action'da kullanilmali.
- **`revalidateTag`**: Birden fazla sayfayi etkileyen mutasyonlarda tag bazli revalidation kullan.
- **`unstable_cache`**: Pahalı DB sorgularini cache'lemek icin kullan (istatistik sorgulari vb.).

```ts
// Dogru - query fonksiyonlarini cache() ile sar
import { cache } from 'react'

export const getOperationById = cache(async (id: string): Promise<Operation | null> => {
  return db.operation.findUnique({ where: { id }, include: { steps: true } })
})
```

---

## Real-time Guncellemeler (Worker Dashboard)

**Karar: Polling stratejisi** (WebSocket/SSE gerektirmez, basit ve guvenilir).

Isci dashboard'u yeni aktif adimlar icin polling yapar:

- `router.refresh()` her 30 saniyede bir cagrilir (Server Component verileri yenilenir).
- Kullanici "Adimi Tamamla"ya bastiginda adim aninda tamamlanir, sayfa refresh edilir.
- Sayfa odak kaybedip geri geldiginde (`visibilitychange` event) refresh tetiklenir.

```ts
// src/components/worker/WorkerDashboardRefresher.tsx ("use client")
useEffect(() => {
  const interval = setInterval(() => router.refresh(), 30_000)
  const onFocus = () => router.refresh()
  document.addEventListener('visibilitychange', onFocus)
  return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onFocus) }
}, [router])
```

---

## Guvenlik Kurallari

### IDOR Korumalı Prisma Sorguları
Her zaman sorguya `userId` veya `role` kosulunu ekle — sadece ID ile sorgulama yapma:

```ts
// Yanlis - baska kullanicinin adimini gorebilir
const step = await db.step.findUnique({ where: { id } })

// Dogru - yalnizca kendi atandigi adimi gorur
const step = await db.step.findUnique({ where: { id, assignedTo: session.user.id } })
```

### Diger Guvenlik Kurallari
- **Rate limiting**: Login endpoint'i icin basit rate limiting ekle (5 basarisiz deneme -> 15 dk bekleme).
- **Input sanitizasyonu**: Zod validasyonu yeterlidir; `DOMPurify` gibi ek kutuphanelere gerek yok (SSR).
- **Server Action CSRF**: Next.js Server Actions CSRF korumasini otomatik saglar; ekstra onlem gerekmez.
- **Session guvenligi**: `NEXTAUTH_SECRET` production'da en az 32 karakter olmali (`openssl rand -base64 32`).
- **Hassas log**: Hicbir zaman `console.log` ile parola, token veya session verisi loglama.

---

## Erisebilirlik (Accessibility / a11y)

- Tum `<button>` elemanlarinda anlasılır metin veya `aria-label` olmali.
- Form alanlari: `<label htmlFor="id">` ile `<input id="id">` mutlaka eslesmeli.
- Modal'larda: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` kullan.
- Modal acildiginda focus otomatik olarak ilk interaktif elemana tasınmali; ESC ile kapanmali.
- Renk ile anlam vermekten kacin — rozet/badge'lerin yaninda daima metin de olmali.
- Tablo'larda `<th scope="col">` kullan.

```tsx
// Dogru
<button aria-label="Operasyonu sil" onClick={handleDelete}>
  <TrashIcon className="h-4 w-4" />
</button>

// Yanlis
<button onClick={handleDelete}>
  <TrashIcon className="h-4 w-4" />
</button>
```

---

## Environment Variables

`.env` dosyasi (asla git'e commit etme):

```bash
# Veritabani
DATABASE_URL="file:./dev.db"           # SQLite (gelistirme)
# DATABASE_URL="postgresql://..."      # PostgreSQL (production)

# NextAuth.js
NEXTAUTH_SECRET=""                      # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"    # Production'da gercek domain

# Node
NODE_ENV="development"                  # production | development | test
```

`.env.example` her zaman guncel tutulmali (deger olmadan, sadece anahtar).

---

## Veritabani Migration Workflow

```bash
# 1. Schema degisikliginden sonra migration olustur (gelistirme)
npx prisma migrate dev --name <migration-adi>
# Ornek: npx prisma migrate dev --name add-completed-at-to-step

# 2. Production'a deploy et
npx prisma migrate deploy

# 3. Prisma Client'i yeniden uret (schema degisikliginden sonra)
npx prisma generate

# 4. Seed verisi yukle (sadece gelistirme)
npx prisma db seed
```

**Kurallar:**
- Schema'da her degisiklik icin migration olustur; `db push` sadece prototipleme icin kullan.
- Migration dosyalarini asla manuel duzenleme — Prisma tarafindan yonetilir.
- Production'da `migrate dev` degil `migrate deploy` kullan.

---

## Test Stratejisi

### Birim Testler (Jest + ts-jest)
- `src/lib/utils.ts` ve `src/lib/validations/` icindeki saf fonksiyonlar test edilir.
- Test dosyalari yaninda tutulur: `utils.test.ts`, `operation.test.ts`
- Prisma'yi mock'la: `jest.mock('@/lib/db')`

### Server Action Testleri
- Her action'in happy path ve error case'leri test edilir.
- Auth mock'lanir, Prisma mock'lanir.

### E2E Testler (Playwright)
Kritik akislar otomatik test edilir:
1. Login (admin + worker)
2. Operasyon olusturma ve baslatma
3. Isci adim tamamlama akisi (end-to-end workflow)
4. Yetkisiz erisim reddi

```bash
# Test komutlari
pnpm test           # Birim testler (Jest)
pnpm test:e2e       # E2E testler (Playwright)
pnpm test:coverage  # Coverage raporu
```

Test dosya yapisi:
```
src/
  lib/
    utils.test.ts
    validations/
      operation.test.ts
tests/
  e2e/
    auth.spec.ts
    operation-flow.spec.ts
```
