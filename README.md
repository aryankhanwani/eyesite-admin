# Eyesite Admin Panel

Admin dashboard for managing Eyesite Opticians website content and leads.

## Features

- **Authentication**: Email/password login system
- **Blog Management**: Full CRUD operations for blog posts
- **User Management**: Create and manage admin/staff accounts
- **Email Management**: 
  - Newsletter subscribers
  - Appointment requests with status tracking
  - 20% off offer signups with unique code generation
- **Code Validation**: Validate and mark offer codes as used

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Set up Supabase database:
   - Run the SQL queries from `supabase-schema.sql` in your Supabase SQL editor
   - This will create all necessary tables and insert default blog posts

4. Run the development server:
```bash
npm run dev
```

5. Access the admin panel at `http://localhost:3000/login`

## Database Setup

Run the SQL queries in `supabase-schema.sql` to:
- Create all required tables
- Set up indexes for performance
- Insert default blog posts
- Create triggers for updated_at timestamps

## API Endpoints

### Admin API Routes
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog
- `POST /api/users` - Create new admin/staff user
- `DELETE /api/users/[id]` - Delete user
- `PATCH /api/emails/[table]/[id]` - Update email status
- `GET /api/codes/validate?code=XXX` - Validate offer code
- `PATCH /api/codes/[id]/mark-used` - Mark code as used

### Public API Routes (for frontend)
- `POST /api/submit/newsletter` - Subscribe to newsletter
- `POST /api/submit/appointment` - Submit appointment request
- `POST /api/submit/offer` - Sign up for 20% off offer

## Pages

- `/login` - Login page
- `/dashboard` - Main dashboard with stats
- `/dashboard/blogs` - Blog management
- `/dashboard/blogs/new` - Create new blog
- `/dashboard/blogs/[id]/edit` - Edit blog
- `/dashboard/users` - User management
- `/dashboard/users/new` - Create new user
- `/dashboard/newsletters` - Newsletter subscribers
- `/dashboard/appointments` - Appointment requests
- `/dashboard/offers` - Offer signups
- `/dashboard/codes` - Code validation

## Notes

- All admin routes are protected by authentication middleware
- Lead statuses for appointments: new, contacted, booked, cancelled
- Offer codes are automatically generated and unique
- Codes can be validated and marked as used to prevent reuse
