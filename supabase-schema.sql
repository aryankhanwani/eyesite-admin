-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  auth_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  read_time TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Emails Table
CREATE TABLE IF NOT EXISTS newsletter_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointment Emails Table
CREATE TABLE IF NOT EXISTS appointment_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offer Emails Table (20% Off)
CREATE TABLE IF NOT EXISTS offer_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date);
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_email ON newsletter_emails(email);
CREATE INDEX IF NOT EXISTS idx_appointment_emails_status ON appointment_emails(status);
CREATE INDEX IF NOT EXISTS idx_appointment_emails_email ON appointment_emails(email);
CREATE INDEX IF NOT EXISTS idx_offer_emails_code ON offer_emails(code);
CREATE INDEX IF NOT EXISTS idx_offer_emails_is_used ON offer_emails(is_used);

-- Insert default blogs
INSERT INTO blogs (slug, title, excerpt, content, author, date, category, image, read_time, tags) VALUES
(
  'how-often-should-you-get-eye-test',
  'How Often Should You Get an Eye Test?',
  'Regular eye tests are crucial for maintaining good vision and detecting potential health issues early. Learn how often you should schedule your eye exams.',
  '# How Often Should You Get an Eye Test?

Regular eye examinations are essential for maintaining good eye health and detecting potential problems early. But how often should you actually get your eyes tested?

## General Guidelines

### Adults (18-60 years)
If you''re an adult with no known vision problems or risk factors, you should have an eye test **at least every two years**. This is the recommendation from the College of Optometrists and the NHS.

### Over 60s
Once you reach 60, it''s recommended to have annual eye tests. As we age, we become more susceptible to eye conditions such as:
- Cataracts
- Glaucoma
- Age-related macular degeneration (AMD)
- Diabetic retinopathy

### Children
Children should have their eyes tested:
- Before starting school (around age 4-5)
- Every year during their school years
- More frequently if they wear glasses or have vision problems

## When to Get Tested More Frequently

You should have more frequent eye tests if you:

### Have Existing Eye Conditions
If you wear glasses or contact lenses, or have been diagnosed with an eye condition, your optometrist will recommend how often you should be tested.

### Have Diabetes
Diabetic patients should have annual eye screenings as diabetes can affect the blood vessels in your eyes, leading to diabetic retinopathy.

### Have a Family History
If close family members have had glaucoma or other eye diseases, you may need more frequent tests.

### Work with Screens
If you spend long hours working on computers or digital devices, regular eye tests can help detect early signs of digital eye strain.

## NHS Free Eye Tests

You''re entitled to a free NHS eye test if you:
- Are under 16 (or under 19 and in full-time education)
- Are 60 or over
- Have diabetes or glaucoma
- Are 40 or over and have a close relative with glaucoma
- Are registered as partially sighted or blind
- Receive certain benefits

## Warning Signs Between Tests

Book an eye test sooner if you experience:
- Sudden vision changes
- Eye pain or discomfort
- Frequent headaches
- Difficulty seeing at night
- Floaters or flashes of light
- Double vision

## What Happens During an Eye Test?

At Eyesite Opticians, a comprehensive eye examination includes:

1. **Visual Acuity Test** - Testing how well you see at various distances
2. **Refraction Test** - Determining your exact prescription
3. **Eye Health Check** - Examining the health of your eyes
4. **Pressure Test** - Checking for signs of glaucoma
5. **OCT Scan** - Advanced imaging of the back of your eye (recommended)

## Book Your Eye Test Today

Don''t wait until you notice problems with your vision. Regular eye tests can detect issues before you''re even aware of them.

At Eyesite Opticians in Leeds, we offer:
- Comprehensive eye examinations
- NHS and private appointments
- Advanced OCT scanning technology
- Expert advice on eye health
- Wide range of eyewear solutions

**Call us today on 0113 260 0063** to book your appointment.',
  'Dr. Sarah Mitchell',
  '2024-11-15',
  'Eye Health',
  '/eye-exams.png',
  '5 min read',
  ARRAY['Eye Tests', 'Eye Health', 'NHS', 'Prevention']
),
(
  'choosing-perfect-glasses-for-your-face-shape',
  'Choosing the Perfect Glasses for Your Face Shape',
  'Finding the right frames can enhance your features and boost your confidence. Discover which glasses suit your face shape best.',
  '# Choosing the Perfect Glasses for Your Face Shape

Selecting the perfect pair of glasses is about more than just vision correction – it''s a fashion statement that can enhance your natural features. Here''s our comprehensive guide to finding frames that suit your face shape.

## Determining Your Face Shape

Before choosing frames, identify your face shape by looking in a mirror:

### Oval Face
- Balanced proportions
- Slightly wider at the cheekbones
- Forehead slightly wider than chin

### Round Face
- Full cheeks
- Rounded chin
- Similar width and length

### Square Face
- Strong jawline
- Broad forehead
- Angular features

### Heart-Shaped Face
- Wider forehead
- Narrow chin
- Prominent cheekbones

### Diamond Face
- Narrow forehead and jaw
- Wide cheekbones
- Angular features

### Rectangle/Oblong Face
- Longer than wide
- Straight cheek line
- Long nose

## Best Frames for Each Face Shape

### Oval Face - The Lucky One
Oval faces are the most versatile and suit almost any frame style!

**Best choices:**
- Oversized frames
- Geometric shapes
- Cat-eye styles
- Aviators

**Avoid:** Frames that are too large and overwhelm your features

### Round Face - Add Definition
**Best choices:**
- Rectangular frames
- Angular styles
- Cat-eye frames
- Geometric designs

**Key tip:** Look for frames wider than the broadest part of your face

**Avoid:** Round or circular frames that emphasize roundness

### Square Face - Soften Angles
**Best choices:**
- Round frames
- Oval shapes
- Cat-eye styles
- Rimless or light-colored frames

**Key tip:** Choose frames with curves to balance angular features

**Avoid:** Rectangular or geometric frames

### Heart-Shaped Face - Balance the Width
**Best choices:**
- Bottom-heavy frames
- Round or oval shapes
- Aviators
- Rimless frames

**Key tip:** Choose frames that are wider at the bottom

**Avoid:** Top-heavy or oversized frames

### Diamond Face - Highlight Eyes
**Best choices:**
- Cat-eye frames
- Oval shapes
- Rimless styles
- Frames with detailing on brow line

**Key tip:** Choose frames that highlight your eyes and brow

**Avoid:** Narrow frames

### Rectangle Face - Add Width
**Best choices:**
- Large, decorative frames
- Round or square shapes
- Deep frames

**Key tip:** Choose frames that add width to balance length

**Avoid:** Narrow rectangular frames

## Additional Considerations

### Skin Tone
- **Warm tones** (golden, peachy): Tortoiseshell, gold, olive, brown
- **Cool tones** (pink, blue): Black, silver, blue, pink, purple
- **Neutral tones**: Most colors work well!

### Hair Color
- **Dark hair**: Bold, vibrant colors
- **Light hair**: Softer, lighter tones
- **Red hair**: Greens, browns, golds

### Lifestyle
- **Active lifestyle**: Durable materials, secure fit
- **Professional**: Classic, understated styles
- **Fashion-forward**: Bold, trendy designs

## Designer Collections at Eyesite Opticians

We stock premium designer frames including:
- **Ray-Ban** - Timeless classics
- **Tom Ford** - Luxury sophistication
- **Gucci** - Bold fashion statements
- **Saint Laurent** - Parisian elegance
- **Hugo Boss** - Professional style
- **Jimmy Choo** - Glamorous designs
- **Ted Baker** - British contemporary style

## Expert Fitting Service

At Eyesite Opticians, our expert team will:
1. Analyze your face shape
2. Consider your lifestyle needs
3. Match frames to your coloring
4. Ensure perfect fit and comfort
5. Help you find your signature style

## Visit Our Showroom

Experience our extensive collection of designer frames at our Leeds showroom. Our friendly opticians will guide you through the selection process and help you find frames that make you look and feel fantastic.

**Book your eyewear consultation: 0113 260 0063**

Visit us at 198 Selby Rd, Halton, Leeds LS15 0LF',
  'Emily Roberts',
  '2024-11-20',
  'Eyewear',
  '/eyewear.png',
  '6 min read',
  ARRAY['Eyewear', 'Fashion', 'Style Guide', 'Designer Frames']
),
(
  'understanding-dry-eye-syndrome',
  'Understanding Dry Eye Syndrome: Causes and Treatments',
  'Dry eye syndrome affects millions of people. Learn about the causes, symptoms, and effective treatments available.',
  '# Understanding Dry Eye Syndrome: Causes and Treatments

Dry eye syndrome is one of the most common eye conditions, affecting millions of people worldwide. If you''ve experienced scratchy, burning, or watery eyes, you might be suffering from this condition.

## What is Dry Eye Syndrome?

Dry eye syndrome occurs when your eyes don''t produce enough tears or when your tears evaporate too quickly. Tears are essential for:
- Keeping eyes lubricated
- Washing away debris
- Protecting against infection
- Maintaining clear vision

## Common Symptoms

### You might have dry eye syndrome if you experience:
- Scratchy or gritty feeling in your eyes
- Burning or stinging sensation
- Redness
- Watery eyes (paradoxically)
- Blurred vision that improves with blinking
- Eye fatigue
- Difficulty wearing contact lenses
- Light sensitivity

## Main Causes

### Age
As we age, tear production naturally decreases. People over 50 are more likely to experience dry eyes.

### Screen Time
Extended use of computers, tablets, and smartphones reduces blink rate, leading to tear evaporation.

### Environmental Factors
- Air conditioning and heating
- Wind and dry climates
- Smoke and pollution
- High altitudes

### Medical Conditions
- Diabetes
- Rheumatoid arthritis
- Thyroid disorders
- Sjögren''s syndrome
- Meibomian gland dysfunction

### Medications
Certain medications can reduce tear production:
- Antihistamines
- Decongestants
- Antidepressants
- Blood pressure medications
- Hormone replacement therapy

### Contact Lenses
Long-term contact lens wear can contribute to dry eye symptoms.

## Types of Dry Eye

### Aqueous Deficient
Your eyes don''t produce enough of the watery component of tears.

### Evaporative
Tears evaporate too quickly due to meibomian gland dysfunction (blocked oil glands).

### Mixed
A combination of both types (most common).

## Diagnosis

At Eyesite Opticians, our comprehensive dry eye assessment includes:

1. **Symptom Questionnaire** - Understanding your experience
2. **Tear Break-Up Time** - Measuring tear film stability
3. **Schirmer''s Test** - Assessing tear production
4. **Meibomian Gland Evaluation** - Checking oil gland function
5. **Corneal Staining** - Detecting surface damage

## Treatment Options

### Lifestyle Modifications

**Take Screen Breaks**
Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.

**Increase Humidity**
Use a humidifier, especially in winter or air-conditioned environments.

**Protect Your Eyes**
Wear wraparound sunglasses outdoors to reduce tear evaporation.

**Stay Hydrated**
Drink plenty of water throughout the day.

### Over-the-Counter Solutions

**Artificial Tears**
Lubricating eye drops provide immediate relief. Use preservative-free drops if applying more than 4 times daily.

**Eye Ointments**
Thicker than drops, ideal for nighttime use.

**Warm Compresses**
Help unblock oil glands and improve tear quality.

### Professional Treatments at Eyesite Opticians

**Intense Pulsed Light (IPL) Therapy**
Advanced treatment targeting meibomian gland dysfunction and inflammation.

**Prescription Eye Drops**
- Anti-inflammatory drops (Cyclosporine, Lifitegrast)
- Steroid drops for severe cases

**Punctal Plugs**
Tiny devices inserted into tear ducts to prevent drainage, keeping tears on the eye surface longer.

**BlephEx Treatment**
Deep cleaning of eyelid margins to remove debris and bacteria.

**Nutritional Supplements**
Omega-3 fatty acids (EPA and DHA) can improve tear quality.

## Prevention Tips

1. **Blink More Often** - Especially when using screens
2. **Position Screens Correctly** - Below eye level to reduce eye exposure
3. **Take Regular Breaks** - Step away from screens
4. **Clean Eyelids** - Daily lid hygiene routine
5. **Omega-3 Rich Diet** - Include fish, flaxseed, and walnuts
6. **Manage Allergies** - Control underlying conditions
7. **Review Medications** - Discuss alternatives with your doctor

## When to Seek Help

See an optometrist if you experience:
- Persistent symptoms affecting daily life
- Vision changes
- Severe pain
- Symptoms not responding to over-the-counter treatments

## Our Dry Eye Clinic

At Eyesite Opticians, we specialize in dry eye management. Our services include:

- Comprehensive dry eye assessment
- Personalized treatment plans
- Advanced IPL therapy
- Ongoing support and monitoring
- Latest treatment options

Don''t suffer in silence. Effective treatments are available!

**Book your dry eye consultation: 0113 260 0063**

Located at 198 Selby Rd, Halton, Leeds LS15 0LF',
  'Dr. James Patterson',
  '2024-11-25',
  'Eye Conditions',
  '/dry eye.png',
  '8 min read',
  ARRAY['Dry Eye', 'Treatment', 'Eye Health', 'IPL Therapy']
)
ON CONFLICT (slug) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_emails_updated_at BEFORE UPDATE ON appointment_emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------------------
-- Default admin user helper (run AFTER creating auth user in Supabase)
-- -------------------------------------------------------------------
-- 1. In Supabase dashboard, go to Authentication > Users
-- 2. Create a new user with:
--      Email:    admin@eyesite.local
--      Password: EyesiteAdmin123!
-- 3. Copy that user's UUID (id column)
-- 4. Replace <AUTH_USER_ID> below and run this INSERT once:
--
-- INSERT INTO admin_users (email, role, auth_user_id)
-- VALUES ('admin@eyesite.local', 'admin', '<AUTH_USER_ID>');

