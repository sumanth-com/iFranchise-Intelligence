-- iFranchise Intelligence — realistic seed data
-- Run in Supabase SQL Editor after migrations 001 + 002.
--
-- Inserts:
--   5 competitors
--   20 competitor articles
--   15 content gaps
--   10 opportunities

begin;

-- ---------------------------------------------------------------------------
-- Clear existing seed-target tables (FK-safe order)
-- ---------------------------------------------------------------------------

delete from public.competitor_articles;
delete from public.content_gaps;
delete from public.opportunities;
delete from public.competitors;

-- ---------------------------------------------------------------------------
-- Competitors (5)
-- ---------------------------------------------------------------------------

insert into public.competitors (id, name, website, industry, created_at) values
  (
    'a1000001-0001-4000-8000-000000000001',
    'Franchise India',
    'https://www.franchiseindia.com',
    'Media & Marketplace',
    '2025-11-12 09:00:00+00'
  ),
  (
    'a1000001-0001-4000-8000-000000000002',
    'Franchise Direct',
    'https://www.franchisedirect.com',
    'Marketplace',
    '2025-11-18 11:30:00+00'
  ),
  (
    'a1000001-0001-4000-8000-000000000003',
    'Entrepreneur India',
    'https://www.entrepreneur.com/en-in',
    'Media',
    '2025-12-02 08:15:00+00'
  ),
  (
    'a1000001-0001-4000-8000-000000000004',
    'Franchise Bazaar',
    'https://www.franchisebazar.com',
    'Marketplace',
    '2025-12-15 14:45:00+00'
  ),
  (
    'a1000001-0001-4000-8000-000000000005',
    'Franchise Mart',
    'https://www.franchisemart.in',
    'Marketplace',
    '2026-01-08 10:20:00+00'
  );

-- ---------------------------------------------------------------------------
-- Competitor articles (20 — 4 per competitor)
-- ---------------------------------------------------------------------------

insert into public.competitor_articles (
  id,
  competitor_id,
  title,
  url,
  published_date,
  summary,
  created_at
) values
  -- Franchise India
  (
    'b2000001-0001-4000-8000-000000000001',
    'a1000001-0001-4000-8000-000000000001',
    'Top 10 Food Franchise Opportunities in India 2026',
    'https://www.franchiseindia.com/insights/en/article/top-10-food-franchise-opportunities-india-2026',
    '2026-06-08',
    'Annual roundup of QSR, cafe, and cloud-kitchen brands expanding across metro and Tier-2 cities with investment bands from ₹15L–₹2Cr.',
    '2026-06-08 06:30:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000002',
    'a1000001-0001-4000-8000-000000000001',
    'How Tier-2 Cities Are Driving QSR Expansion',
    'https://www.franchiseindia.com/insights/en/article/tier-2-cities-qsr-expansion-india',
    '2026-05-29',
    'Analysis of Indore, Coimbatore, and Lucknow showing 38% YoY rise in franchise inquiries for food brands.',
    '2026-05-29 07:00:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000003',
    'a1000001-0001-4000-8000-000000000001',
    'FOCO vs FOFO Models: Which Works in India?',
    'https://www.franchiseindia.com/insights/en/article/foco-vs-fofo-franchise-models-india',
    '2026-05-14',
    'Compares company-operated vs franchisee-operated store economics for retail and F&B chains entering India.',
    '2026-05-14 09:15:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000004',
    'a1000001-0001-4000-8000-000000000001',
    'Franchise Investment Under ₹10 Lakh — Complete Guide',
    'https://www.franchiseindia.com/insights/en/article/franchise-under-10-lakh-guide',
    '2026-04-22',
    'Curated list of education, cleaning, and kiosk franchises with break-even timelines under 18 months.',
    '2026-04-22 11:00:00+00'
  ),

  -- Franchise Direct
  (
    'b2000001-0001-4000-8000-000000000005',
    'a1000001-0001-4000-8000-000000000002',
    'Best Home Services Franchises for First-Time Owners',
    'https://www.franchisedirect.com/information/best-home-services-franchises-first-time-owners',
    '2026-06-05',
    'Profiles 12 cleaning, pest control, and handyman brands with low overhead and recurring revenue models.',
    '2026-06-05 08:45:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000006',
    'a1000001-0001-4000-8000-000000000002',
    'Multi-Unit Franchise Strategies for Scaling in 2026',
    'https://www.franchisedirect.com/information/multi-unit-franchise-strategies-2026',
    '2026-05-21',
    'Playbook for operators managing 3+ units covering territory mapping, staffing, and centralized procurement.',
    '2026-05-21 10:30:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000007',
    'a1000001-0001-4000-8000-000000000002',
    'Low-Cost Franchise Opportunities with High ROI',
    'https://www.franchisedirect.com/information/low-cost-franchise-high-roi',
    '2026-05-03',
    'Benchmarks payback periods for mobile services, tutoring, and vending franchises across North America and India.',
    '2026-05-03 12:00:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000008',
    'a1000001-0001-4000-8000-000000000002',
    'International Brands Entering the Indian Market',
    'https://www.franchisedirect.com/information/international-brands-india-market-entry',
    '2026-04-10',
    'Covers master franchise licensing, localization requirements, and JV structures for global F&B entrants.',
    '2026-04-10 07:30:00+00'
  ),

  -- Entrepreneur India
  (
    'b2000001-0001-4000-8000-000000000009',
    'a1000001-0001-4000-8000-000000000003',
    'Why Cloud Kitchens Are the Hottest Franchise Trend',
    'https://www.entrepreneur.com/en-in/franchise/cloud-kitchens-hottest-franchise-trend',
    '2026-06-10',
    'Interviews founders on aggregator dependency, kitchen throughput, and hybrid dine-in rollout strategies.',
    '2026-06-10 05:00:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000010',
    'a1000001-0001-4000-8000-000000000003',
    'Women Entrepreneurs Leading Franchise Growth in India',
    'https://www.entrepreneur.com/en-in/franchise/women-entrepreneurs-franchise-growth-india',
    '2026-05-26',
    'Spotlights beauty, preschool, and health-coaching franchises where women hold 60%+ of new unit licenses.',
    '2026-05-26 06:20:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000011',
    'a1000001-0001-4000-8000-000000000003',
    'Edtech Franchise Models Post-Pandemic Recovery',
    'https://www.entrepreneur.com/en-in/franchise/edtech-franchise-models-recovery',
    '2026-05-08',
    'Examines hybrid learning centers, coding bootcamps, and test-prep hubs rebounding in suburban markets.',
    '2026-05-08 09:45:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000012',
    'a1000001-0001-4000-8000-000000000003',
    'Franchise Due Diligence Checklist for Indian Investors',
    'https://www.entrepreneur.com/en-in/franchise/due-diligence-checklist-indian-investors',
    '2026-04-18',
    'Step-by-step guide covering FDD review, territory exclusivity, royalty structures, and exit clauses.',
    '2026-04-18 11:30:00+00'
  ),

  -- Franchise Bazaar
  (
    'b2000001-0001-4000-8000-000000000013',
    'a1000001-0001-4000-8000-000000000004',
    'Healthcare Franchise Opportunities in Metro Cities',
    'https://www.franchisebazar.com/blog/healthcare-franchise-metro-cities',
    '2026-06-03',
    'Maps diagnostic labs, dental chains, and physiotherapy clinics with demand spikes in Mumbai and Delhi NCR.',
    '2026-06-03 08:00:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000014',
    'a1000001-0001-4000-8000-000000000004',
    'Beauty & Wellness Franchise ROI Benchmarks',
    'https://www.franchisebazar.com/blog/beauty-wellness-franchise-roi-benchmarks',
    '2026-05-17',
    'Compares salon, spa, and men''s grooming formats on ticket size, footfall, and 24-month payback data.',
    '2026-05-17 10:15:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000015',
    'a1000001-0001-4000-8000-000000000004',
    'Automotive Service Franchise Guide for 2026',
    'https://www.franchisebazar.com/blog/automotive-service-franchise-guide-2026',
    '2026-04-28',
    'Covers detailing, tyre-fitment, and EV maintenance bays with capex models for highway and urban locations.',
    '2026-04-28 07:45:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000016',
    'a1000001-0001-4000-8000-000000000004',
    'Retail Franchise Expansion: Mall vs High-Street',
    'https://www.franchisebazar.com/blog/retail-franchise-mall-vs-high-street',
    '2026-04-05',
    'Footfall, rent-to-sales ratios, and brand visibility trade-offs for apparel and electronics franchises.',
    '2026-04-05 12:30:00+00'
  ),

  -- Franchise Mart
  (
    'b2000001-0001-4000-8000-000000000017',
    'a1000001-0001-4000-8000-000000000005',
    'Fitness Franchise Growth in Bangalore and Hyderabad',
    'https://www.franchisemart.in/insights/fitness-franchise-bangalore-hyderabad',
    '2026-06-07',
    'Gym and boutique fitness brands report 52% inquiry growth in tech-corridor micro-markets.',
    '2026-06-07 06:50:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000018',
    'a1000001-0001-4000-8000-000000000005',
    'Pet Care Franchises — Emerging Category Report',
    'https://www.franchisemart.in/insights/pet-care-franchise-emerging-category',
    '2026-05-19',
    'Grooming, boarding, and premium pet food retail formats gaining traction in affluent urban neighborhoods.',
    '2026-05-19 09:00:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000019',
    'a1000001-0001-4000-8000-000000000005',
    'Co-working Franchise Models for Tier-1 Cities',
    'https://www.franchisemart.in/insights/coworking-franchise-tier-1-cities',
    '2026-05-01',
    'Flexible workspace operators franchise managed centers with 150–400 seat capacity in business districts.',
    '2026-05-01 11:10:00+00'
  ),
  (
    'b2000001-0001-4000-8000-000000000020',
    'a1000001-0001-4000-8000-000000000005',
    'Sustainable & Eco Franchise Opportunities in India',
    'https://www.franchisemart.in/insights/sustainable-eco-franchise-opportunities-india',
    '2026-04-12',
    'Organic grocery, zero-waste retail, and solar installation franchises aligned with ESG investor interest.',
    '2026-04-12 08:25:00+00'
  );

-- ---------------------------------------------------------------------------
-- Content gaps (15)
-- ---------------------------------------------------------------------------

insert into public.content_gaps (
  id,
  topic,
  importance_score,
  competitor_count,
  status,
  created_at
) values
  (
    'c3000001-0001-4000-8000-000000000001',
    'FOCO vs FOFO franchise models comparison',
    92,
    3,
    'open',
    '2026-06-01 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000002',
    'Tier-2 city franchise market sizing',
    89,
    2,
    'open',
    '2026-05-28 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000003',
    'Cloud kitchen franchise unit economics',
    87,
    4,
    'open',
    '2026-05-25 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000004',
    'Franchise investment under ₹10 lakh guide',
    85,
    2,
    'monitoring',
    '2026-05-20 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000005',
    'Women-led franchise success stories India',
    83,
    1,
    'monitoring',
    '2026-05-15 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000006',
    'Healthcare franchise regulatory requirements',
    81,
    2,
    'in_progress',
    '2026-05-10 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000007',
    'Beauty salon franchise ROI benchmarks',
    79,
    3,
    'monitoring',
    '2026-05-05 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000008',
    'International master franchise licensing India',
    78,
    2,
    'in_progress',
    '2026-04-30 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000009',
    'Edtech franchise territory planning',
    76,
    2,
    'monitoring',
    '2026-04-25 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000010',
    'QSR franchise supply chain optimization',
    74,
    3,
    'in_progress',
    '2026-04-20 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000011',
    'Automotive detailing franchise margins',
    72,
    2,
    'resolved',
    '2026-04-15 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000012',
    'Pet services franchise market gap analysis',
    70,
    1,
    'monitoring',
    '2026-04-10 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000013',
    'Co-working space franchise feasibility',
    68,
    1,
    'dismissed',
    '2026-04-05 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000014',
    'Franchise financing options for Indian SMBs',
    66,
    0,
    'open',
    '2026-03-28 10:00:00+00'
  ),
  (
    'c3000001-0001-4000-8000-000000000015',
    'Digital marketing playbook for franchisees',
    64,
    1,
    'in_progress',
    '2026-03-20 10:00:00+00'
  );

-- ---------------------------------------------------------------------------
-- Opportunities (10)
-- ---------------------------------------------------------------------------

insert into public.opportunities (
  id,
  title,
  industry,
  city,
  score,
  priority,
  status,
  created_at,
  updated_at
) values
  (
    'd4000001-0001-4000-8000-000000000001',
    'Premium Tea Cafe — Bandra West',
    'Food & Beverage',
    'Mumbai, MH',
    93,
    'Critical',
    'Hot',
    '2026-06-09 08:00:00+00',
    '2026-06-09 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000002',
    'Cloud Kitchen Hub — Koramangala',
    'Food & Beverage',
    'Bangalore, KA',
    91,
    'Critical',
    'Hot',
    '2026-06-07 08:00:00+00',
    '2026-06-07 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000003',
    'Home Deep-Cleaning Services — Cyber City',
    'Home Services',
    'Gurgaon, HR',
    88,
    'High',
    'Active',
    '2026-06-04 08:00:00+00',
    '2026-06-04 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000004',
    'Kids Coding Academy — Hitech City',
    'Education',
    'Hyderabad, TS',
    86,
    'High',
    'Active',
    '2026-06-01 08:00:00+00',
    '2026-06-01 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000005',
    'Ayurvedic Wellness Clinic — Koregaon Park',
    'Health & Wellness',
    'Pune, MH',
    82,
    'Medium',
    'Review',
    '2026-05-28 08:00:00+00',
    '2026-05-28 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000006',
    'EV Charging Station Franchise — OMR Corridor',
    'Automotive',
    'Chennai, TN',
    87,
    'High',
    'Active',
    '2026-05-24 08:00:00+00',
    '2026-05-24 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000007',
    'Quick Service Pizza — Salt Lake Sector V',
    'Food & Beverage',
    'Kolkata, WB',
    79,
    'Medium',
    'Review',
    '2026-05-20 08:00:00+00',
    '2026-05-20 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000008',
    'In-Home Senior Care — Indiranagar',
    'Healthcare',
    'Bangalore, KA',
    84,
    'High',
    'Active',
    '2026-05-16 08:00:00+00',
    '2026-05-16 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000009',
    'Mobile Phone Repair — Connaught Place',
    'Retail & Services',
    'New Delhi, DL',
    77,
    'Medium',
    'Review',
    '2026-05-12 08:00:00+00',
    '2026-05-12 08:00:00+00'
  ),
  (
    'd4000001-0001-4000-8000-000000000010',
    'Organic Grocery Mini-Store — Jubilee Hills',
    'Retail',
    'Hyderabad, TS',
    90,
    'Critical',
    'Hot',
    '2026-05-08 08:00:00+00',
    '2026-05-08 08:00:00+00'
  );

commit;
