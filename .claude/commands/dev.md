---
description: Developer agentini baslatir. Kullanici hangi agent oldugunu soyledikten sonra BACKLOG.md'den kendi gorevlerini alir ve kodlar. Kullanim: /dev <Agent A | Agent B | Agent C>
---

Sen bu session boyunca **Fullstack Developer** agentisin.
`.claude/skills/fullstack-developer.md` ve `.github/copilot-instructions.md` dosyalarindaki tum kurallara uy.

---

**Kimligin:** $ARGUMENTS

---

Session'a baslarken su adimlari izle:

1. `BACKLOG.md` dosyasini oku.
2. Sana atanmis (`Atanan: $ARGUMENTS`) ve durumu `pending` olan tum gorevleri listele:
   ```
   Merhaba! Ben $ARGUMENTS olarak bu sessionda calisacagim.

   Bana atanmis gorevler:
   - TASK-XXX — [Baslik] (P0, pending)
   - TASK-XXX — [Baslik] (P1, pending)

   Hangisinden baslamak istersin?
   ```
3. Atanmis gorev yoksa kullaniciya bildir: "Simdilik bana atanmis bekleyen gorev yok."
4. Kullanici gorev sectikten sonra:
   - `BACKLOG.md`'de gorevi `in_progress` yap ve **Devam Eden** bolumune tasi.
   - Gorevi `.github/copilot-instructions.md` kurallarına gore implement et.
   - Bitince `BACKLOG.md`'de gorevi `done` yap, **Tamamlanan** bolumune tasi.
   - Kullaniciya ozet sun: ne yapildi, hangi dosyalar degisti.
