<img alt="DONGY" height="60" src="apps/web/public/logo-with-text.svg" />

**DONGY (دنگی) splits shared expenses for Iranian friend groups: in Farsi, in toman, with a retro 8-bit look.**

Scan a restaurant receipt, let everyone claim the items they ordered, and DONGY works out who owes whom. Tax, service charge and tip are split in proportion to what each person ate.

> DONGY is a fork of [Spliit Cloud](https://github.com/antonio-ivanovski/spliit-cloud) by Antonio Ivanovski, which is itself a fork of [Spliit](https://github.com/spliit-app/spliit). Both are MIT-licensed. Thanks to their authors and contributors for the foundation this app is built on. See [LICENSE](LICENSE).

## What makes DONGY different

- **Farsi first.** The full interface is in Farsi (right-to-left, Persian digits, Iranian calendar dates) and English. No other languages.
- **Toman and million toman.** These are the only currencies, so there's no currency converter or exchange rates. A price shows as «۱٬۷۵۳٬۰۰۰ تومان» or «۱٫۷۵۳ میلیون تومان».
- **Per-item splitting.** Each person claims their own line items. What's left over (tax, service, tip) is split proportionally or however you choose.
- **Receipt scanning.** AI reads a photo of a receipt, Persian receipts included, and fills in the title, total, date and line items. Gemini works out of the box.
- **8-bit look.** It has square corners, the [Unixel](https://github.com/MDarvishi5124/Unixel) pixel font for Persian and English, [pixelarticons](https://github.com/halfmage/pixelarticons) icons, stepped gradients and a pixel-art logo.

It keeps the parts it inherited from Spliit Cloud: accounts (including anonymous accounts with no email), groups that sync across devices, balances and settle-up, recurring expenses, budgets, stats, CSV import (Splitwise, Cospend, bank statements) and an offline-capable web app.

## Status

DONGY is under active, early development and has no public instance yet. Run it locally (below).

## Run locally

Prerequisites: [Bun](https://bun.sh) and Docker.

```bash
bun install
cp .env.example .env            # then fill in the values described below
bun dev:up                      # PostgreSQL, MaxIO (S3) and MailDev in Docker
bun prisma-migrate
bun prisma-generate
```

Then start the three app servers, each in its own terminal:

```bash
cd apps/api && bun run dev:app       # API on http://localhost:3001
cd apps/worker && bun run dev:app    # background jobs on http://localhost:3003
cd apps/web && bun run dev:app       # web app on http://localhost:3000
```

`bun dev:down` stops the Docker services. Local service data lives under `storage/`.

### Settings in `.env`

For plain `localhost` development:

| Variable                                                     | Value                                 |
| ------------------------------------------------------------ | ------------------------------------- |
| `PORTLESS`                                                   | `0`                                   |
| `VITE_API_URL`, `BETTER_AUTH_URL`                            | `http://localhost:3001`               |
| `WEB_ORIGINS`                                                | `http://localhost:3000`               |
| `BETTER_AUTH_SECRET`                                         | a long random string                  |
| `PUBLIC_DEFAULT_CURRENCY_CODE`, `VITE_DEFAULT_CURRENCY_CODE` | `IRT` (toman)                         |
| `ENABLE_ANONYMOUS_AUTH`                                      | `true` to allow sign-up without email |

To turn on receipt scanning with Gemini:

| Variable                        | Value                                                             |
| ------------------------------- | ----------------------------------------------------------------- |
| `PUBLIC_ENABLE_RECEIPT_EXTRACT` | `true`                                                            |
| `AI_PROVIDER`                   | `google`                                                          |
| `AI_API_KEY`                    | your Gemini API key (keep it only in `.env`, which is gitignored) |
| `AI_RECEIPT_MODEL`              | e.g. `gemini-3.5-flash-lite`                                      |

Every other option (OpenAI, Anthropic and OpenAI-compatible providers, OCR, email, push, storage) is listed in `.env.example` and validated in `apps/api/src/lib/env.ts`.

## Project layout

A Bun + Turbo monorepo:

- `apps/web`: the web app (Vite, React 19, TanStack Router, Tailwind)
- `apps/api`: the API (Hono, tRPC, Effect, better-auth)
- `apps/worker`: background jobs (recurring expenses, notifications)
- `apps/mcp`, `apps/android`, `apps/webhook-relay`: optional extras inherited from Spliit Cloud
- `packages/db`: Prisma schema and migrations
- `packages/domain`: business logic (money is integer minor units, itemized splitting, balances)

## Development

Before sending a change, run the checks and tests for what you touched:

```bash
bun run format
bun run check
bun run test
bun i18n check                  # when UI text changed
```

UI text lives in `apps/web/src/messages/{en-US,fa-IR}.json`. Change it only through the `bun i18n` CLI (see `AGENTS.md`).

## Feedback

Report bugs and ideas on [GitHub issues](https://github.com/5aeidi/dongy/issues), or use the Feedback page in the app.

## License

MIT. See [LICENSE](LICENSE), which keeps the original copyright notices of Spliit and Spliit Cloud.
