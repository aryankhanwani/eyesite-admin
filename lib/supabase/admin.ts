import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client using the service role key.
// IMPORTANT: Never expose the service role key to the browser.

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)


