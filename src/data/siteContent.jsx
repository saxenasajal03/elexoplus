/**
 * siteContent.js
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF DEFAULT / FALLBACK CONTENT for every Admin-CMS-controlled
 * section of the ElexoPlus D2C website (Header mega-menu, Footer, Company,
 * Insights, Support pages etc.)
 *
 * Per the Master Developer Requirements doc (Req #1, #2, #3, #98):
 * "All visible content must be manageable from the Admin CMS... until the
 *  Admin Panel + endpoints are built, ship sensible, on-brand defaults."
 *
 * HOW THIS WILL BE WIRED TO PHP LATER (no component changes needed):
 *   Each exported array/object below is shaped EXACTLY like the JSON payload
 *   the future endpoint should return, e.g.
 *     GET https://project.interndesire.com/api/cms/leadership.php  -> { success:true, data:[...] }
 *   Pages already call `getCmsContent(endpoint, fallbackArray)` (see helper
 *   below) — once an endpoint exists, drop its path into CMS_ENDPOINTS and
 *   the page will automatically prefer live data, falling back to these
 *   defaults if the API is unreachable or returns nothing.
 * ---------------------------------------------------------------------------
 */

export const API_BASE = "https://project.interndesire.com/api";
export const B2B_API_BASE = "https://b2b.elexoplus.in/api";

// Map of CMS section -> future PHP endpoint (kept centralised so the whole
// site can be re-pointed in one place once the Admin Panel ships new APIs).
export const CMS_ENDPOINTS = {
  banners: `${API_BASE}/cms/banners.php`,
  categories: `${API_BASE}/cms/categories.php`,
  leadership: `${API_BASE}/cms/leadership.php`,
  milestones: `${API_BASE}/cms/milestones.php`,
  gallery: `${API_BASE}/cms/gallery.php`,
  media: `${API_BASE}/cms/media_resources.php`,
  blog: `${API_BASE}/cms/blog_posts.php`,
  events: `${API_BASE}/cms/events.php`,
  branches: `${API_BASE}/cms/branches.php`,
  careers: `${API_BASE}/cms/careers.php`,
  serviceCenters: `${API_BASE}/cms/service_centers.php`,
  faqs: `${API_BASE}/cms/faqs.php`,
  testimonials: `${API_BASE}/cms/testimonials.php`,
  socialLinks: `${API_BASE}/cms/social_links.php`,
  marketplaceLinks: `${API_BASE}/cms/marketplace_links.php`,
  siteSettings: `${API_BASE}/cms/site_settings.php`,
};

/**
 * Generic fetch-with-fallback helper.
 * Usage inside a page:
 *   const [rows, setRows] = useState(defaultLeadership);
 *   useEffect(() => { getCmsContent('leadership', defaultLeadership).then(setRows); }, []);
 */
export async function getCmsContent(section, fallback) {
  const url = CMS_ENDPOINTS[section];
  if (!url) return fallback;
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const json = await res.json();
    const data = json?.data ?? json?.items ?? json?.rows;
    if (Array.isArray(data) && data.length > 0) return data;
    if (data && typeof data === 'object' && !Array.isArray(fallback)) return data;
    return fallback;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* PRODUCT CATEGORIES (Req #3 — Admin create/edit/reorder categories)  */
/* ------------------------------------------------------------------ */
export const defaultCategories = [
  {
    id: 1,
    name: "Heating Appliances",
    slug: "heating-appliances",
    image: "/assets/heating-Cimz2wTQ.png",
    tagline: "Precision heating for winter comfort",
    subcategories: ["Geysers", "Room Heaters", "Immersion Rods"],
  },
  {
    id: 2,
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    image: "/assets/Kitchen-BYeIJkbK.png",
    tagline: "Smart induction, kettles & chimneys",
    subcategories: ["Mixer Grinders", "Induction Cooktops", "Electric Kettles", "Chimneys", "Gas Stoves"],
  },
  {
    id: 3,
    name: "Summer Collection",
    slug: "summer-collection",
    image: "/assets/Summer-BgV9wR3f.png",
    tagline: "Advanced air circulation & cooling",
    subcategories: ["Ceiling Fans", "Table Fans", "Ventilation Fans"],
  },
  {
    id: 4,
    name: "Winter Collection",
    slug: "winter-collection",
    image: "/assets/Winter-7A8mnezP.png",
    tagline: "Compact water & space warmers",
    subcategories: ["Water Purifiers", "Room Heaters"],
  },
];

/* ------------------------------------------------------------------ */
/* COMPANY LEGACY / TIMELINE (Req #12)                                  */
/* ------------------------------------------------------------------ */
export const defaultMilestones = [
  { id: 1, year: "1996", title: "Foundation as Nakoda Traders", description: "Late Shri Baleshwar Kumar Jain and Mr. Rohit Kumar Jain founded Oswal Electric & Electronic, originally Nakoda Traders, trading heating-appliance spare parts across Rajasthan." },
  { id: 2, year: "2005", title: "Regional Trust Built", description: "Grew into a trusted name for heating-appliance components, expanding distribution relationships across North India." },
  { id: 3, year: "2015", title: "Manufacturing Capability", description: "Began building in-house manufacturing and quality-control capability to support a full home-appliance product range." },
  { id: 4, year: "2022", title: "ELEXO PLUS is Born", description: "Mr. Somil Jain launched ELEXO PLUS — a new brand built on the group's heritage, focused on innovation, safety and customer-first service." },
  { id: 5, year: "2024", title: "Pan-India B2B Network", description: "Onboarded dealers, distributors and super-stockists nationwide with credit-backed wallet and scheme systems." },
  { id: 6, year: "2026", title: "Unified ERP + D2C Platform", description: "Launched the integrated ELEXO PLUS platform connecting website, ERP, vendor network, service and payroll on one system." },
];

/* ------------------------------------------------------------------ */
/* LEADERSHIP (Req #13, #14)                                            */
/* ------------------------------------------------------------------ */
export const defaultLeadership = [
  {
    id: 1,
    name: "Mr. Somil Jain",
    designation: "Founder & Managing Director",
    type: "Founder",
    photo: "https://placehold.co/400x400/1A1A1A/FBBF24?text=SJ",
    bio: "Inspired by three decades of family heritage in the electrical appliance trade, Mr. Somil Jain founded ELEXO PLUS in 2022 with a mission to surpass customer expectations through innovation, safety and uncompromising quality.",
    message: "\"Our promise is simple — comfort without compromise, backed by a network you can trust from purchase to after-sales service.\"",
  },
  {
    id: 2,
    name: "Mr. Rohit Kumar Jain",
    designation: "Co-Founder & Director, Operations",
    type: "Co-Founder",
    photo: "https://placehold.co/400x400/1A1A1A/FBBF24?text=RJ",
    bio: "A co-founder of the group's original venture, Mr. Rohit Kumar Jain brings decades of hands-on experience in sourcing, manufacturing and channel operations.",
  },
  {
    id: 3,
    name: "Sales Head",
    designation: "Head of Sales & Channel Partnerships",
    type: "Leadership",
    photo: "https://placehold.co/400x400/1A1A1A/FBBF24?text=SH",
    bio: "Leads the dealer, distributor and super-stockist network across India, driving the B2B growth strategy.",
  },
  {
    id: 4,
    name: "Operations Head",
    designation: "Head of Manufacturing & Warehouse",
    type: "Leadership",
    photo: "https://placehold.co/400x400/1A1A1A/FBBF24?text=OH",
    bio: "Oversees production planning, quality control, batch traceability and warehouse operations across all facilities.",
  },
];

/* ------------------------------------------------------------------ */
/* COMPANY GALLERY (Req #17)                                            */
/* ------------------------------------------------------------------ */
export const defaultGallery = [
  { id: 1, category: "Factory", caption: "Manufacturing floor — Bhiwadi, Rajasthan", image: "/assets/heating-Cimz2wTQ.png" },
  { id: 2, category: "Products", caption: "Kitchen appliance line-up", image: "/assets/Kitchen-BYeIJkbK.png" },
  { id: 3, category: "Products", caption: "Summer collection fans", image: "/assets/Summer-BgV9wR3f.png" },
  { id: 4, category: "Products", caption: "Winter water heaters", image: "/assets/Winter-7A8mnezP.png" },
  { id: 5, category: "Events", caption: "Annual dealer meet 2026", image: "https://placehold.co/800x600/0a0a0a/FBBF24?text=Dealer+Meet" },
  { id: 6, category: "Team", caption: "Quality control inspection team", image: "https://placehold.co/800x600/0a0a0a/FBBF24?text=QC+Team" },
  { id: 7, category: "Factory", caption: "Warehouse & dispatch bay", image: "https://placehold.co/800x600/0a0a0a/FBBF24?text=Warehouse" },
  { id: 8, category: "Achievements", caption: "ISO certification ceremony", image: "https://placehold.co/800x600/0a0a0a/FBBF24?text=ISO+Certified" },
];

/* ------------------------------------------------------------------ */
/* MEDIA RESOURCES (Req #18)                                            */
/* ------------------------------------------------------------------ */
export const defaultMedia = [
  { id: 1, title: "ELEXO PLUS Logo Pack (PNG/SVG)", type: "Logo", fileUrl: "/assets/elexoplus-logo-BJqIBdaq.png" },
  { id: 2, title: "Product Catalogue 2026 (PDF)", type: "Catalogue", fileUrl: "#" },
  { id: 3, title: "Company Brochure (PDF)", type: "Brochure", fileUrl: "#" },
  { id: 4, title: "Press Kit — High-Res Packshots", type: "Press", fileUrl: "#" },
];

/* ------------------------------------------------------------------ */
/* BLOG / LEADERSHIP THOUGHTS (Req #15)                                 */
/* ------------------------------------------------------------------ */
export const defaultBlogPosts = [
  {
    id: 1,
    slug: "why-bee-star-rating-matters",
    title: "Why BEE Star Rating Matters When Buying a Fan or Geyser",
    excerpt: "A quick guide to understanding energy-efficiency star ratings and how they translate into real electricity savings.",
    category: "Buying Guide",
    author: "ELEXO PLUS Editorial",
    date: "2026-08-12",
    image: "/assets/Summer-BgV9wR3f.png",
    content: "Energy efficiency labelling helps you compare appliances on real running cost, not just purchase price. A 5-star rated fan or geyser consumes meaningfully less electricity over its lifetime than a 3-star equivalent, which typically pays back any price difference within the first year of use. When shopping the ELEXO PLUS range, look for the BEE star label on the product detail page alongside wattage and capacity specifications.",
  },
  {
    id: 2,
    slug: "warranty-registration-in-2-minutes",
    title: "How to Register Your Product Warranty in Under 2 Minutes",
    excerpt: "Scan, verify, done — here's how our QR-based warranty activation keeps your after-sales support hassle-free.",
    category: "Support",
    author: "ELEXO PLUS Editorial",
    date: "2026-07-30",
    image: "/assets/heating-Cimz2wTQ.png",
    content: "Every ELEXO PLUS product ships with a unique serial number and QR code. Simply scan the QR on the product body, or enter the serial manually on our Warranty Registration page, confirm your invoice details, and your warranty period is activated instantly — linked permanently to your purchase record for a smooth claims experience later.",
  },
  {
    id: 3,
    slug: "leadership-message-quality-first",
    title: "Leadership Message: Why Quality Comes Before Speed",
    excerpt: "Our Founder & Managing Director on why every batch goes through multi-stage QC before it reaches a customer.",
    category: "Leadership",
    author: "Mr. Somil Jain, Founder & MD",
    date: "2026-06-18",
    image: "https://placehold.co/900x500/0a0a0a/FBBF24?text=Leadership+Message",
    content: "We could ship faster if we skipped a QC stage here and there. We never will. Every finished unit — whether it's headed to a dealer's warehouse or straight to a customer's home — carries our name and our promise. That's not negotiable, no matter how large our network grows.",
  },
];

/* ------------------------------------------------------------------ */
/* EVENTS (New section requested — Admin managed)                       */
/* ------------------------------------------------------------------ */
export const defaultEvents = [
  { id: 1, title: "Annual Dealer & Distributor Meet 2026", date: "2026-11-14", location: "Jaipur, Rajasthan", type: "Dealer Meet", description: "Network-wide meet covering new product launches, dealer schemes and credit programs for the upcoming season.", image: "https://placehold.co/900x500/0a0a0a/FBBF24?text=Dealer+Meet+2026" },
  { id: 2, title: "Winter Collection Product Launch", date: "2026-10-02", location: "New Delhi", type: "Product Launch", description: "Unveiling the new range of geysers and room heaters ahead of the winter season.", image: "https://placehold.co/900x500/0a0a0a/FBBF24?text=Winter+Launch" },
  { id: 3, title: "ELEXO PLUS at Consumer Electronics Expo", date: "2026-09-25", location: "Pragati Maidan, New Delhi", type: "Trade Show", description: "Visit our booth to experience the full ELEXO PLUS range and speak with our OEM/bulk order team.", image: "https://placehold.co/900x500/0a0a0a/FBBF24?text=Expo+2026" },
];

/* ------------------------------------------------------------------ */
/* BRANCH OFFICES (Req #20)                                             */
/* ------------------------------------------------------------------ */
export const defaultBranches = [
  { id: 1, name: "Corporate Office & Factory", city: "Bhiwadi", state: "Rajasthan", address: "10/481, Bhagat Singh Marg, near RTO ROAD, Sector 9, RIICO Industrial Area, Bhiwadi, Rajasthan 301019", phone: "+91 92570-61015", email: "sales@elexoplus.in", mapUrl: "https://maps.google.com/?q=Bhiwadi+Rajasthan" },
  { id: 2, name: "North Regional Sales Office", city: "New Delhi", state: "Delhi", address: "Regional Sales Office, New Delhi NCR", phone: "+91 92570-61015", email: "sales@elexoplus.in", mapUrl: "https://maps.google.com/?q=New+Delhi" },
  { id: 3, name: "Dehradun Corporate Office", city: "Dehradun", state: "Uttarakhand", address: "Corporate Office, Dehradun, Uttarakhand", phone: "+91 92570-61015", email: "sales@elexoplus.in", mapUrl: "https://maps.google.com/?q=Dehradun" },
];

/* ------------------------------------------------------------------ */
/* SERVICE CENTERS (Req #88)                                            */
/* ------------------------------------------------------------------ */
export const defaultServiceCenters = [
  { id: 1, name: "ELEXO PLUS Authorized Service — Bhiwadi", territory: "Alwar District, Rajasthan", address: "RIICO Industrial Area, Bhiwadi, Rajasthan", phone: "+91 92570-61015", products: "All Categories" },
  { id: 2, name: "ELEXO PLUS Authorized Service — Delhi NCR", territory: "Delhi / NCR", address: "New Delhi, Delhi", phone: "+91 92570-61015", products: "All Categories" },
  { id: 3, name: "ELEXO PLUS Authorized Service — Jaipur", territory: "Jaipur District, Rajasthan", address: "Jaipur, Rajasthan", phone: "+91 92570-61015", products: "Kitchen & Heating Appliances" },
];

/* ------------------------------------------------------------------ */
/* CAREERS (Req #10)                                                    */
/* ------------------------------------------------------------------ */
export const defaultJobs = [
  { id: 1, title: "Sales Executive — B2B Channel", department: "Sales", location: "Bhiwadi, Rajasthan", type: "Full-Time", experience: "1-3 years", postedOn: "2026-08-20", description: "Manage dealer relationships, drive channel sales targets, and support onboarding of new distributors in the assigned territory." },
  { id: 2, title: "Production Supervisor", department: "Manufacturing", location: "Bhiwadi, Rajasthan", type: "Full-Time", experience: "3-5 years", postedOn: "2026-08-10", description: "Oversee daily production targets, BOM adherence, and QC coordination on the shop floor." },
  { id: 3, title: "React Frontend Developer", department: "Technology", location: "Remote / Bhiwadi", type: "Full-Time", experience: "2-4 years", postedOn: "2026-09-01", description: "Build and maintain the ELEXO PLUS D2C, B2B and Admin platforms using React, Tailwind and REST APIs." },
  { id: 4, title: "Customer Support Executive", department: "Customer Care", location: "Bhiwadi, Rajasthan", type: "Full-Time", experience: "0-2 years", postedOn: "2026-08-28", description: "Handle customer complaints, warranty queries and service escalations with a focus on fast resolution." },
];

/* ------------------------------------------------------------------ */
/* FAQs (Req #21 support)                                               */
/* ------------------------------------------------------------------ */
export const defaultFaqs = [
  { id: 1, question: "How do I track my order?", answer: "Go to My Orders (after logging in) or use the Track Order page with your Order ID and registered mobile number / email." },
  { id: 2, question: "How do I register my product warranty?", answer: "Visit the Warranty Registration page, enter your product's serial number (found on the QR sticker) along with your invoice details." },
  { id: 3, question: "What is Cash on Delivery (COD) and is it available?", answer: "COD is available on select products, pincodes and order values, subject to a small admin-configured COD handling fee shown at checkout." },
  { id: 4, question: "How do I raise a service complaint?", answer: "Use the Complaint Registration page. You'll receive a unique Complaint ID (separate from your Order ID) to track status until resolution." },
  { id: 5, question: "How do I become a dealer or distributor?", answer: "Use the Vendor Registration flow from the B2B Dealer Portal link in our footer, or reach out via the Bulk / OEM enquiry form." },
];

/* ------------------------------------------------------------------ */
/* TESTIMONIALS                                                        */
/* ------------------------------------------------------------------ */
export const defaultTestimonials = [
  { id: 1, name: "Rakesh Sharma", role: "Retail Dealer, Jaipur", quote: "The wallet and credit system makes reordering incredibly smooth — no more waiting on manual approvals.", rating: 5 },
  { id: 2, name: "Priya Verma", role: "D2C Customer, Gurugram", quote: "Fast delivery and the QR warranty activation took less than a minute. Very impressed.", rating: 5 },
  { id: 3, name: "Vikas Distributors", role: "Super Stockist, Uttar Pradesh", quote: "Scheme tracking and cashback in the vendor wallet has genuinely improved our monthly targets.", rating: 4 },
];

/* ------------------------------------------------------------------ */
/* MARKETPLACE + SOCIAL LINKS (Req #9)                                  */
/* ------------------------------------------------------------------ */
export const defaultMarketplaceLinks = [
  { id: 1, name: "Amazon", url: "https://www.amazon.in" },
  { id: 2, name: "Flipkart", url: "https://www.flipkart.com" },
  { id: 3, name: "Meesho", url: "https://www.meesho.com" },
];

export const defaultSocialLinks = [
  { name: "Facebook", url: "https://facebook.com" },
  { name: "Instagram", url: "https://instagram.com" },
  { name: "Twitter", url: "https://twitter.com" },
  { name: "LinkedIn", url: "https://linkedin.com" },
  { name: "YouTube", url: "https://youtube.com" },
];