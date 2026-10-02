# SyntaxVirtual Lab (lab.syntaxvirtual.com)

**SyntaxVirtual Lab** is a production-grade, fully functional in-browser development environment and toolset for developers. 

## Supabase Setup Instructions (Phase 1)
Since we are starting from scratch, follow these exact steps to create and link your database:

1. Go to [Supabase.com](https://supabase.com) and click "New Project".
2. Name the project `syntaxvirtual-lab`.
3. Select a region close to your Vercel deployment (e.g., Frankfurt).
4. Save the auto-generated database password somewhere secure.
5. Once the project is provisioned, go to **Project Settings > API**.
6. Copy the `Project URL` and `anon public` key.
7. Open the `.env.local` file (create it based on `.env.local.example`) and add these keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
8. Navigate to the **SQL Editor** in the Supabase Dashboard.
9. Copy the contents of `supabase-schema.sql` (found in the root of this project) and click **Run**. This will generate all your tables and RLS (Row Level Security) policies automatically.

## Deployment & Subdomain Configuration

1. **Vercel**: Link your GitHub repository to Vercel and deploy.
2. **Cloudflare DNS**:
   - Go to your Cloudflare dashboard for `syntaxvirtual.com`.
   - Go to DNS Settings and add a new record:
     - **Type:** `CNAME`
     - **Name:** `lab`
     - **Target:** `cname.vercel-dns.com`
   - **CRITICAL:** Ensure the proxy status (the orange cloud) is turned **OFF** (DNS only). If it is on, Vercel cannot issue the SSL certificate.
3. In Vercel, go to Project Settings > Domains and add `lab.syntaxvirtual.com`. It should verify within a few minutes.

-- ✅ Verified: README with setup instructions.
