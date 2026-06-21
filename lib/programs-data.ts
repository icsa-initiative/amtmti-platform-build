export type Program = {
  slug: string
  title: string
  category: string // profession slug
  categoryLabel: string
  level: 'Certificate' | 'Diploma' | 'Postgraduate Diploma' | 'CPD Course'
  programme?: string
  mode: 'Online' | 'Hybrid' | 'In-Person'
  duration: string
  feesKsh: number
  summary: string
  outcomes: string[]
  intake?: string
  learningMethods?: string[]
  featured?: boolean
  image?: string
}


export function formatUsd(amount: number) {
  // Convert amount (assumed as KSH) to USD for display.
  // Using a rough conversion rate: 1 USD ≈ 110 KSH. Adjust as needed.
  const conversionRate = 110; // KSH per USD
  const usdAmount = amount / conversionRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(Math.round(usdAmount));
}

/**
 * Format a KSH amount as Kenyan Shilling currency.
 */
export function formatKsh(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
}
