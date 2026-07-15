export type Category =
  | "SEO"
  | "PPC"
  | "Social Media"
  | "Content"
  | "Email"
  | "Brand Strategy";

export type BlogCategory = "SEO" | "PPC" | "Social Media" | "Analytics" | "Strategy";

export interface NavLink {
  label: string;
  href: string;
}

export interface ContactPageContent {
  eyebrow: string;
  title: string;
  description: string;
  auditTitle: string;
  auditDescription: string;
}

export interface HeroStat {
  label: string;
  value: string;
  suffix?: string;
}

export interface HeroContent {
  title: string;
  role: string;
  subtitle: string;
  headline: string;
  description: string;
  stats: HeroStat[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  image: string;
}

export interface Expertise {
  title: string;
  description: string;
  icon: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  achievements: string[];
}

export interface AboutContent {
  headline: string;
  bio: string;
  philosophy: string;
  expertise: Expertise[];
  experience: ExperienceItem[];
  certifications: string[];
  tools: string[];
}

export interface Metric {
  label: string;
  value: string;
  before: string;
  after: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface ChartPoint {
  label: string;
  before: number;
  after: number;
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: Category;
  client: string;
  industry: string;
  challenge: string;
  strategy: string;
  results: {
    trafficGrowth: string;
    conversionRate: string;
    roi: string;
    revenue: string;
  };
  metrics: Metric[];
  chartData: ChartPoint[];
  publishedDate: string;
  featuredImage: string;
  testimonial: CaseStudyTestimonial;
  excerpt: string;
}

export interface ServiceFeature {
  text: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  price: string;
  priceNote: string;
  features: string[];
  deliverables: string[];
  timeline: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  readTime: string;
  category: BlogCategory;
  featuredImage: string;
  author: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ClientLogo {
  name: string;
  logo: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
}

export interface SiteContent {
  nav: {
    logo: string;
    logoImage?: string;
    links: NavLink[];
  };
  hero: HeroContent;
  about: AboutContent;
  services: Service[];
  portfolio: CaseStudy[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  clients: ClientLogo[];
  process: ProcessStep[];
  contact: ContactContent;
  contactPage: ContactPageContent;
}
