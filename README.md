# Nebulla Field — Somnia Native Intent Engine
### A native real-time intent layer for the Somnia ecosystem.

Nebulla Field is a Somnia-native, real-time intent engine that transforms wallet activity into a living **Intent Field**.

Connect a wallet → observe the Intent Score, latest actions, and behavioral phase  
(**Predict / Synchronize / Awaiting**) in a single, carefully crafted Nebula-style screen.

This README is **Codex-ready**:  
You can copy / paste it (and the requirement sections) into an AI code assistant to generate or realign the project.

---

## 0. Vision — “Nebulla Field”

**Nebulla Field** is designed to be a reference implementation of a:

> Somnia-native, real-time Intent Layer  
> with premium UI and minimal cognitive load.

Goals:

- One-screen experience: judges understand the value in **3 seconds**
- Strictly **Somnia-centric** (Somnia RPC / data streams first)
- High-end Nebula glass UI (no “cheap” dashboard feeling)
- Clean engine separation for future S1 → G1 → S3 evolution

Nebulla Field is not just a dashboard; it is an **engine** that can power  
future Somnia-native analytics, risk models, and social intent graphs.

---

## 1. Core Features

### 1.1 Wallet-Centric Flow

Nebulla Field starts from the wallet:

- **Connect Wallet** header button
- Nebula-style **Connect Modal** with:
  - MetaMask (primary)
  - Somnia Wallet
  - WalletConnect (QR / deep link)
- If no compatible wallet is found:
  - Show a clear message (e.g. `No compatible wallet found. Please install MetaMask.`)
- On successful connection:
  - Header text changes from `CONNECT WALLET` → `0x1234...abcd`
  - Central 0x input is auto-filled with the connected address
  - Visual glow & connected state are reflected across the UI

The connected wallet address becomes the **default analysis target**.  
Users can still manually overwrite the 0x input to inspect other wallets.

---

### 1.2 Intent Field Tri-Panel Layout

The main field is a **three-card Nebula grid**:

1. **PREDICT**  
   - Overall Intent Score (0–100)  
   - Current phase / classification (e.g. “Accumulating”, “Exploring”, “Dormant”)

2. **SYNCHRONIZE**  
   - Real-time alignment with recent behaviors  
   - Short textual cues like “Aligned with governance”, “Speculative flow”, etc.

3. **AWAITING**  
   - What seems to be “loading” or “pending”  
   - Watchlist-style hints or upcoming potential moves

Requirements:

- On desktop:  
  - PREDICT card height = AWAITING + SYNCHRONIZE stacked height  
  - Lower row cards align bottom edges
- On mobile:  
  - Cards stack vertically with consistent spacing  
  - No broken layout, no overlapping

All three cards must react to:

- Connected wallet address
- Manual 0x override
- Intent engine output (even if mocked / heuristic at first)

---

### 1.3 Real-Time Intent Engine (S1)

For the hackathon version (S1 phase):

- `/api/intent/analyze` receives:
  - `address` (0x string)
- It returns a structured object:
  ```ts
  {
    address: string;
    intentScore: number;       // 0–100
    intentPhase: string;       // "Accumulating" | "Exploring" | ...
    latestActions: NormalizedAction[];
    meta: {
      totalActions: number;
      lastActive: string;      // ISO timestamp
    };
  }
```

`latestActions` is a normalized feed (not raw RPC output)

The scoring can be simple but must be logical and explainable  
(e.g. more governance votes → +score, long inactivity → -score).

### 1.4 Somnia-Native Normalization

Nebulla Field is built to be Somnia-native.

Data flow (conceptual):

```
Somnia RPC / Data Provider
    → Raw activity
        → Normalizer (maps to canonical action types)
            → Intent Engine (scoring + phase classification)
                → Nebulla UI (cards + feed + snapshot)
```

The normalizer should convert raw fields into:

```ts
type NormalizedAction = {
  type: string;       // "swap" | "quest" | "vote" | ...
  label: string;      // Human-readable
  timestamp: string;  // ISO formatted
  txHash?: string;
};
```

Even if the current implementation uses dummy / sample data,  
the structure must be ready to plug into real Somnia endpoints later.

### 1.5 Nebula Glass UI

Visual principles:

- Dark cosmic gradient background:
  - black → deep navy → subtle blue fog
- Glassmorphism cards:
  - `backdrop-blur-2xl`
  - `bg-white/10 + border-white/15–20`
  - Deep shadow for floating effect
- Typography:
  - Tight, modern sans-serif
  - High contrast, slightly wide tracking
- Motion:
  - Framer Motion for gentle:
    - fade-in
    - slide-from-below
    - hover lift + slight 3D tilt

No noisy effects, no rainbow gradients, no cheap “neon”

The overall impression should be:

> “This could be an official Somnia-native Intent Dashboard.”

### 1.6 JSON Snapshot Export

Nebulla Field supports exporting an Intent Snapshot for research or replay.

Sample shape:

```json
{
  "address": "0x1234...",
  "generatedAt": "2025-11-29T12:00:00Z",
  "intentScore": 78,
  "intentPhase": "Accumulating",
  "latestActions": [
    {
      "type": "swap",
      "label": "Swap: TOKENA → TOKENB",
      "timestamp": "2025-11-29T11:50:00Z"
    }
  ],
  "meta": {
    "totalActions": 42,
    "lastActive": "2025-11-29T11:50:00Z"
  }
}
```

This can be triggered via a button in the UI (e.g. EXPORT SNAPSHOT).

---

## 2. Tech Stack & Architecture

### 2.1 Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI: Tailwind CSS
- Animation: Framer Motion
- State & Context: React hooks + custom WalletContext
- Wallets: MetaMask, Somnia Wallet, WalletConnect v2
- Backend: Next.js API routes (Node.js 20+)
- Deployment: Vercel

### 2.2 Project Structure (High-Level)

The exact file paths can be adjusted,  
but the separation of concerns should remain.

```
nebulla-field-engine/
├─ app/
│  ├─ layout.tsx          # Root layout, fonts, background, shell
│  ├─ page.tsx            # Main Nebulla Field screen
│  └─ api/
│     ├─ intent/
│     │  └─ analyze/route.ts   # Intent engine endpoint
│     └─ somnia/
│        ├─ activity/route.ts  # (Optional) raw activity fetch
│        └─ ...                # future Somnia endpoints
├─ app/components/
│  ├─ WalletContext.tsx   # Wallet provider + hooks
│  ├─ ConnectWalletModal.tsx
│  ├─ AddressInput.tsx
│  ├─ cards/
│  │  ├─ PredictCard.tsx
│  │  ├─ SynchronizeCard.tsx
│  │  └─ AwaitingCard.tsx
│  └─ ui/…                # shared buttons, badges, etc.
├─ styles/
│  └─ globals.css
├─ scripts/
│  └─ BASE_WORKING_POINT_*.sh  # restore scripts / save points (optional)
├─ .npmrc                  # legacy-peer-deps=true (for Vercel)
├─ next.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 3. Setup & Development

### 3.1 Prerequisites

- Node.js 20+
- npm 10+
- Git
- (Recommended) MetaMask installed

### 3.2 Install

```bash
git clone https://github.com/0x-xrpl/nebulla-field-engine.git
cd nebulla-field-engine
npm install --legacy-peer-deps
```

### 3.3 Run Dev Server

```bash
npm run dev -- -p 3020
# or
npm run dev -- -p 3030
```

Open:

```
http://localhost:3020
```

---

## 4. Environment Variables

Create a `.env.local` file in the project root as needed.

Example:

```
# Somnia testnet RPC
NEXT_PUBLIC_SOMNIA_RPC=https://rpc-testnet.somnia.network/

# WalletConnect v2 project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

If not set, the app may fall back to demo / placeholder data.

---

## 5. Wallet Behavior & Validation

### 5.1 Connect Flow

- CONNECT WALLET → open modal
- Choose MetaMask / Somnia Wallet / WalletConnect
- On success:
  - Global WalletContext stores:
    - `address`
    - `isConnected`
    - `selectedWallet`
  - Header and 0x input update
  - Cards re-fetch / recompute intent

### 5.2 EMIT / Analyze Button

If there is a primary “EMIT” / “ANALYZE” button:

- If no 0x address is present:
  - Show a gentle warning: “Please connect a wallet or enter an address.”
- If there is an address but no intent data yet:
  - Trigger the intent analysis endpoint.
- The button must not break the card layout or resize heights.

---

## 6. Deployment (Vercel)

- Framework preset: Next.js
- Root directory: `./`
- Build command: default (`next build`)
- Output: Next.js app (App Router)

Every git push to main:

- Vercel clones the repo
- Runs `npm install` (using `.npmrc`)
- Builds & deploys
- Updates:

```
https://nebulla-field-engine.vercel.app/
```

---

## 7. Roadmap

### S1 — Engine Foundations (current)

- Wallet integration
- Intent Score + tri-panel layout
- JSON snapshot

### G1 — Global Intent Layer (future)

- Multi-address aggregation
- Cross-wallet similarity
- Risk / exit modeling

### S3 — Somnia Social Intent Graph (future)

- Intent-based graph of wallets
- Narrative-aware behavior mapping
- Multi-agent simulations

************************
