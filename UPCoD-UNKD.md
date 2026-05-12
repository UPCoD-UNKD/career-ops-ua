# Career-Ops UA — Форк з українською підтримкою

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Українська](README.ua.md) | [Русский](README.ru.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <a href="https://github.com/UPCoD-UNKD/career-ops-ua"><img src="docs/hero-banner.jpg" alt="Career-Ops UA — Форк з підтримкою українського ринку" width="800"></a>
</p>

<p align="center">
  <em>Автор оригінального проєкту не підтримує українську локалізацію та український ринок.</em><br>
  <strong>Ми підтримуємо.</strong><br>
  <em>Цей форк додає повну підтримку українського IT-ринку: ФОП, Дія City, DOU.ua, Djinni.co, USD-зарплати, медстрахування.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-111827?style=flat&logo=terminal&logoColor=white" alt="OpenCode">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
  <img src="https://img.shields.io/badge/UA-blue?style=flat" alt="UA">
</p>

---

## Навіщо цей форк

Оригінальний [santifer/career-ops](https://github.com/santifer/career-ops) — чудова система для пошуку роботи з AI. Але автор забив на підтримку українського ринку: PR з українськими модами висів без реакції, а специфіка українського IT (ФОП 3-я група, Дія City, КЗпП, ПДФО 18% + військовий збір, ЄСВ, DOU.ua, Djinni.co, USD-деноміновані зарплати, медстрахування) — це не те, що можна "просто перекласти".

Український IT-ринок має свої правила гри:
- Більшість вакансій написані англійською, але працюють за українськими правилами
- Зарплати в USD, але оподаткування — ФОП або Дія City
- Портали — DOU.ua, Djinni.co, а не тільки Greenhouse/Lever
- Контракти — ФОП 3-я група, а не employment agreement

Тому ми підтримуємо цей форк самостійно.

## Що додано

- **`modes/ua/`** — повні українські моди:
  - `_shared.md` — спільний контекст з українською специфікою
  - `oferta.md` — оцінка вакансій з урахуванням ФОП/Дія City/КЗпП
  - `apply.md` — подача заявок на українському ринку
  - `pipeline.md` — обробка конвеєра
  - `interview-prep.md` — підготовка до інтерв'ю
- **Інтеграція в `AGENTS.md`** — секція "When to use Ukrainian modes" для всіх AI CLI

## Як тримати форк актуальним

Оригінальний репозиторій активно розвивається. Щоб не відставати:

```bash
# Одноразово: додати upstream
git remote add upstream https://github.com/santifer/career-ops.git

# При кожному синку:
git fetch upstream
git merge upstream/main

# Якщо є конфлікти — резолвити вручну.
# Наші зміни зазвичай в modes/ua/ та AGENTS.md (секція Language Modes).
# Решта файлів — upstream без змін.
```

**Правило:** ми не змінюємо файли upstream без потреби. Наші зміни ізольовані в:
- `modes/ua/*` — українські моди (upstream їх не має)
- `AGENTS.md` — додана секція Ukrainian в Language Modes
- `README.ua.md` — українська версія README
- `UPCoD-UNKD.md` — цей файл

Якщо upstream змінює `AGENTS.md` (секцію Language Modes), при merge буде конфлікт — просто додайте Ukrainian блок назад після Japanese.

## Швидкий старт

```bash
# 1. Клонування
git clone https://github.com/UPCoD-UNKD/career-ops-ua.git
cd career-ops-ua && npm install
npx playwright install chromium

# 2. Конфігурація
cp config/profile.example.yml config/profile.yml
cp templates/portals.example.yml portals.yml

# 3. Увімкнути українські моди
# Додайте в config/profile.yml:
#   language:
#     modes_dir: modes/ua

# 4. Додайте cv.md та запустіть
claude   # або opencode
```

## Використання українських модів

Система автоматично визначає український ринок за ознаками:
- Вакансія з DOU.ua або Djinni.co
- Згадується ФОП, Дія City, українська компанія
- Зарплата в USD з українською специфікою

Або вручну: скажіть агенту "use Ukrainian modes" або встановіть `language.modes_dir: modes/ua` в `config/profile.yml`.

## Контриб'юшн

Якщо ви з України і хочете покращити моди — PR welcome. Ми приймаємо:
- Покращення оцінювання для українського ринку
- Нові портали (DOU.ua, Djinni.co, Work.ua, Robota.ua)
- Виправлення термінології (ФОП, КЗпП, ЄСВ тощо)
- Переклади та локалізацію

## Ліцензія

MIT — як і оригінал.

## Контакти

[![GitHub](https://img.shields.io/badge/UPCoD--UNKD-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/UPCoD-UNKD)
