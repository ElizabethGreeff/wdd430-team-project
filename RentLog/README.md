Team members of Team 12!
Elizabeth Greeff
Thubelihle Dlamini
Mackison Jean Pierre
Britney Maulana

Description:
RentLog is a mobile-responsive full-stack web application designed to help renters seamlessly document their apartment's condition and track out-of-pocket maintenance expenses.


## Sign-in setup (Auth.js)

RentLog uses Auth.js (NextAuth v5) with email and password. Each renter only sees their own properties, condition reports and photos.

1. Add these to `RentLog/.env.local` (never commit this file):
   - `MONGODB_URI=...` (ask the team for the connection string)
   - `AUTH_SECRET=...` (generate one with `npx auth secret`, or any random 32-byte base64 value)
2. `npm install`, then `npm run dev` and create an account at `/register`.
3. Optional: move the old seeded "demo-user" data to your account:
   `npx tsx --env-file=.env.local scripts/claim-demo-data.ts you@example.com`
4. On Vercel, add the same `MONGODB_URI` and `AUTH_SECRET` under Settings, Environment Variables.

How it fits together:
- `auth.config.ts` lists the private sections (`/properties`, `/expenses`, `/packages`, `/profile`); `proxy.ts` (Next.js 16's name for middleware) sends signed-out visitors to `/login` and back afterwards.
- `lib/current-user.ts`: `getCurrentUserId()` for pages and Server Actions (redirects to `/login` without a session), and `getApiUserId()` for API routes (they return 401 without a session).
- Passwords are stored only as bcrypt hashes in the `User` model (`models/User.ts`).
