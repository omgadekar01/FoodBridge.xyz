# FoodBridge

FoodBridge is a React and Vite hackathon prototype for coordinating surplus food rescue between donors, NGOs, recipients, and delivery teams. Its existing operations dashboard includes simulated listings, matching, route, verification, and impact analytics.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates a production bundle, and `npm run lint` runs Oxlint.

## Demonstrate authentication

The application opens on the FoodBridge sign-in page. Choose **Create account** to register an NGO, Donor, or Food recipient, fill in that role's fields, and submit. You can also sign in directly with any valid email, a password of at least eight characters, and the role you want to demonstrate. The demo service accepts new sign-in details and keeps registered demo accounts in memory for the current browser session.

Each role opens the existing dashboard with matching role navigation:

- **NGO** → NGO dashboard
- **Food-business Donor** → FSSAI demo verification, then Donor dashboard
- **Individual Donor** → Donor dashboard without business-license verification
- **Food recipient** → recipient dashboard

Use **Log out** in the dashboard header to return to sign-in. The demo session stores only a generated session ID, role, and expiry time in browser storage. Registration details and passwords are kept only in memory and are never persisted. Sessions expire after eight hours. There is no backend or production-grade authentication; the client-side demo is for demonstrations only.

Food-business Donors must complete the FSSAI demo modal before the Donor dashboard can be opened, including after a refresh or by entering the dashboard URL directly. NGO, Food recipient, and Individual Donor flows do not require this step. The demo stores only a per-account `demo-approved` status; it does not store the entered license number. A 14-digit format check is not an official license verification: other correctly formatted numbers simulate a demo pass, while `00000000000000` simulates a failure. Do not enter a real license number. An official verification provider and a trusted server-side endpoint are required before this flow can verify licenses or secure donor features in production; browser storage is not an authorization boundary.
