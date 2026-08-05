export type Language = 'ar' | 'en';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

export interface StepItem {
  step: number;
  title: string;
  description: string;
  icon: string;
  detail: string;
}

export interface UseCase {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  description: string;
  benefits: string[];
  docSampleName: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceMonthlySAR: number;
  priceYearlySAR: number;
  priceMonthlyUSD: number;
  priceYearlyUSD: number;
  popular?: boolean;
  ctaText: string;
  features: string[];
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  pages: number;
  size: string;
  previewContent: {
    header: string;
    body: string;
    footer: string;
  };
}

export interface SignatureField {
  id: string;
  type: 'signature' | 'name' | 'date' | 'stamp' | 'checkbox';
  x: number;
  y: number;
  value?: string;
  signatureType?: 'drawn' | 'typed';
  color?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}
