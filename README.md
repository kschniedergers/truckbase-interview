# Basic Stock Tracker for Truckbase Interview

Basic stock tracker built by Kai Schniedergers for the Truckbase interview process.

## Installation
This is a monorepo with 2 packages, frontend and server. They both run in the foreground so you will need 2 terminal windows.

Terminal 1:
- `cd server`
- `pnpm install`
- `pnpm start`

Terminal 2:
- `cd frontend`
- `pnpm install`
- `pnpm start`

(should work with other package managers as well)

Then go to `http://localhost:5173/` in your browser.

## Notes
Theres a lot of random files created by the vite script, etc, the main code I wrote is in `server/src` and `frontend/src/App.tsx`.
The backend polls the yahoo finance API every 30 seconds, the frontend polls the backend every 5 seconds.
Also it seems the yahoo API crashes the server every once in a while, please restart if that happens.