# Setup Instructions

## 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API to get your:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep this secret!)

## 2. Database Setup

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Run the SQL script
4. This will create:
   - All required tables
   - Indexes for performance
   - Default blog posts
   - Triggers for auto-updating timestamps

## 3. Environment Variables

Create `.env.local` in the `eyesite-admin` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Also create `.env.local` in the `eyesite` folder (main site):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Create First Admin User

You need to create the first admin user manually in Supabase:

1. Go to Authentication > Users in Supabase dashboard
2. Click "Add user" > "Create new user"
3. Enter email and password
4. Copy the User ID
5. Go to SQL Editor and run:

```sql
INSERT INTO admin_users (email, role, auth_user_id)
VALUES ('your-email@example.com', 'admin', 'paste-user-id-here');
```

## 5. Row Level Security (RLS)

Set up RLS policies in Supabase:

### For blogs table:
```sql
-- Allow public read access
CREATE POLICY "Public blogs are viewable by everyone"
ON blogs FOR SELECT
USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Only admins can modify blogs"
ON blogs FOR ALL
USING (auth.role() = 'authenticated');
```

### For email tables:
```sql
-- Allow public insert (for form submissions)
CREATE POLICY "Anyone can insert newsletter emails"
ON newsletter_emails FOR INSERT
WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Only admins can read newsletter emails"
ON newsletter_emails FOR SELECT
USING (auth.role() = 'authenticated');

-- Similar policies for appointment_emails and offer_emails
CREATE POLICY "Anyone can insert appointment emails"
ON appointment_emails FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can read appointment emails"
ON appointment_emails FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can insert offer emails"
ON offer_emails FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can read offer emails"
ON offer_emails FOR SELECT
USING (auth.role() = 'authenticated');
```

## 6. Install Dependencies

In both `eyesite-admin` and `eyesite` folders:

```bash
npm install
```

## 7. Run Development Servers

### Admin Panel:
```bash
cd eyesite-admin
npm run dev
```
Access at http://localhost:3000/login

### Main Site:
```bash
cd eyesite
npm run dev
```
Access at http://localhost:3001 (or next available port)

## 8. GitHub Setup

1. Initialize git in `eyesite-admin`:
```bash
cd eyesite-admin
git init
git add .
git commit -m "Initial commit: Admin panel setup"
```

2. Create a new repository on GitHub
3. Push the code:
```bash
git remote add origin https://github.com/yourusername/eyesite-admin.git
git branch -M main
git push -u origin main
```

## Notes

- The admin panel uses Supabase Auth for authentication
- All email submissions from the frontend are stored in Supabase
- Blog posts are fetched dynamically from Supabase
- Offer codes are automatically generated and unique
- Appointment leads can be tracked with status (new, contacted, booked, cancelled)

