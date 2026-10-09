# MEOW AI — Launch, Deployment & Infrastructure Checklist

This checklist provides the exact operational steps for Founder **Ram Nivas Attanti** to configure the custom domain, establish corporate email, activate the Claude API integration, and complete public deployment.

---

## 1. Domain Setup via GitHub Student Developer Pack

As a student at Jain University with GitHub Student Developer Pack benefits:
1. **Namecheap or Name.com free domain benefit:**
   - Log into [GitHub Education Pack](https://education.github.com/pack).
   - Navigate to the **Domain Name** benefits section (e.g. Namecheap free 1-year `.me` or discount on `.in` / `.com`, or Name.com free `.live` / `.studio` / `.tech`).
   - Claim your domain registration voucher.
   - Recommended domains for MEOW AI: `meowai.in`, `meow-ai.com`, or `meowai.tech`.
2. **DNS Management:**
   - Keep DNS managed either directly at Namecheap/Name.com or point nameservers to Cloudflare (free plan) for fast edge caching and SSL management.

---

## 2. Business Email Setup (Zoho Mail Free Tier)

To qualify for the Claude Startups program, a domain-matching business email (e.g. `ramnivas@meowai.in` or `founder@meowai.in`) is highly recommended over generic Gmail.
1. **Register on Zoho Mail Forever Free Plan:**
   - Visit [Zoho Mail Free Plan](https://www.zoho.com/mail/zohomail-pricing.html) (scroll down to "Forever Free Plan" for up to 5 users, 5GB/user, single domain webmail access).
   - Enter your registered custom domain.
2. **Configure DNS Records for Email Delivery:**
   - **TXT (Domain Verification):** Add `zoho-verification=...` TXT record as provided by Zoho.
   - **MX Records:**
     - `mx.zoho.in` (Priority 10)
     - `mx2.zoho.in` (Priority 20)
     - `mx3.zoho.in` (Priority 50)
     *(Note: Use `.com` if registered on global US data center).*
   - **SPF Record (TXT):**
     - Host: `@` | Value: `v=spf1 include:zoho.in ~all`
   - **DKIM Record (TXT):**
     - Host: `zmail._domainkey` | Value: `<key generated from Zoho control panel>`
   - **DMARC Record (TXT):**
     - Host: `_dmarc` | Value: `v=DMARC1; p=none; rua=mailto:admin@yourdomain.com`

---

## 3. Deployment Configuration (Vercel Free Tier)

1. **GitHub Repository:**
   - Initialize git branch `main`.
   - Create private/public repo `ramnivasattanti/meow-ai-platform` on GitHub.
   - Push code:
     ```bash
     git remote add origin https://github.com/<your-username>/meow-ai-platform.git
     git push -u origin main
     ```
2. **Vercel Project Setup:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub.
   - Click **Add New... -> Project** and select `meow-ai-platform`.
   - Framework Preset: **Next.js** (App Router).
   - Build Command: `npm run build`
   - Root Directory: `./`
3. **Environment Variables on Vercel:**
   - In Vercel Project Settings -> **Environment Variables**, add:
     - `ANTHROPIC_API_KEY`: *(Optional in demo mode, required for live Claude generation)*
     - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app` (or custom domain)
     - `CONTACT_NOTIFICATION_EMAIL`: `founder@yourdomain.com`
4. **Custom Domain Attachment on Vercel:**
   - Go to Settings -> Domains.
   - Add your custom domain (e.g. `meowai.in`).
   - Add CNAME or A-record:
     - A-record for root `@`: `76.76.21.21`
     - CNAME for `www`: `cname.vercel-dns.com`

---

## 4. Anthropic Claude API Configuration

1. **Obtain API Key:**
   - Log into [Anthropic Console](https://console.anthropic.com).
   - Go to **Settings -> API Keys**.
   - Create key: `sk-ant-api03-...`
2. **Local Development:**
   - Create `.env.local` based on `.env.example`.
   - Set `ANTHROPIC_API_KEY=sk-ant-api03-...`.
   - Note: The platform operates seamlessly in **Demo Mode** with intelligent deterministic engines when no API key is set. When the API key is present, it automatically activates live Claude generation!

---

## 5. Security & Verification Audit

- [x] No secrets committed to git.
- [x] Strict server-side only execution for Anthropic SDK calls.
- [x] Rate limiting and honeypot validation on `/api/contact`.
- [x] Explicit browser microphone consent disclosure prior to speech recording.
- [x] AI identity disclosure ("I am MEOW Voice AI") strictly configured.
- [x] Human-in-the-loop escalation paths provided for all booking & business decisions.

