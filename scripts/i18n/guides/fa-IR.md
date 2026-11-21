# fa-IR translation guide

Apply `default.md` first, then these Persian (Iran) rules.

- Write standard, modern Persian as used in Iranian apps: friendly and clear, polite but not stiff. Address the user with the plural/polite verb forms (`کنید`, `دارید`), and use the short imperative for buttons (`ذخیره`, `حذف`, `افزودن هزینه`). Avoid Arabic-heavy or literary phrasing and avoid colloquial spellings (`میخوای`) in UI text.
- Treat the interface as RTL. Keep placeholders such as `{name}` exactly as written; place them where Persian word order needs them.
- Use Persian letters, not Arabic look-alikes: `ی` (U+06CC) not `ي`, `ک` (U+06A9) not `ك`. Use the zero-width non-joiner (U+200C, نیم‌فاصله) where standard: `می‌شود`, `هزینه‌ها`, `گروه‌ها`, `پرداخت‌کننده`.
- Punctuation: `،` for commas, `؛` for semicolons, `؟` for question marks, `«»` for quotes, `…` (U+2026) for ellipsis, never `...`.
- Do not convert digits in the strings; the app formats numbers itself. Keep numbers, currency codes, URLs and product names unchanged.
- Persian has no grammatical gender; keep sentences neutral. Plurals: Persian uses the `one` and `other` categories; after a number the noun stays singular (`{count} هزینه`, not `{count} هزینه‌ها`).
- Terminology (use consistently):
  - expense: `هزینه`; income: `درآمد`; group / ledger: `گروه`; member / participant: `عضو` / `شرکت‌کننده`
  - balance: `تراز` (balances view: `ترازها`); share: `سهم`; split: `تقسیم`; paid by: `پرداخت‌کننده`; paid for / split between: `تقسیم بین`
  - itemized split: `بر اساس اقلام`; item: `قلم` (plural `اقلام`); remainder / unaccounted: `باقی‌مانده`; proportional: `متناسب`; evenly: `مساوی`
  - receipt: `رسید`; scan receipt: `اسکن رسید`; category: `دسته‌بندی`; currency: `ارز`; exchange rate: `نرخ تبدیل`; recurring: `تکرارشونده`
  - account: `حساب کاربری`; sign in: `ورود`; sign up: `ثبت‌نام`; sign out: `خروج`; passkey: `کلید عبور`; settings: `تنظیمات`
- Brands stay in Latin script: `Spliit`, `DONGY`, `Splitwise`, `Cospend`, `Frankfurter`, `ChatGPT`, `Claude`, `Android`.
- Exclusive settlement term: _تسویه_ (noun) and _تسویه کردن_ (verb), e.g. `تسویه حساب`, `ثبت تسویه`. Never use _بازپرداخت_ or _استرداد_ for this concept.
