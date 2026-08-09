# Java Daily Planner

A lightweight web app for daily Java study check-ins. It lists each day's study tasks (Java and frontend practice) by time block, and you check them off one by one — progress is stored locally in the browser. When all tasks are done, it automatically resets for a new day; you can also reset today's tasks manually.

## Features

- Daily task list: study tasks grouped by period (early / noon / early evening / evening)
- Check-in: click to mark a task done, with real-time progress display
- Local persistence: daily progress saved via localStorage, auto-reset across days
- Configurable: title, storage key, reset delay, and time blocks are adjustable via environment variables

## Tech Stack

- Vue 3 + Vite + TypeScript
- UnoCSS atomic styles
- reka-ui components
- Netlify deployment

## Development

```bash
pnpm install
pnpm dev
```

Build: `pnpm build`