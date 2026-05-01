export interface Vendor {
  id: string
  name: string
  idno: string
  address: string
  website: string
  logo: string
  email: string
  rating: string
  phone: string
  registrationDate: string
  status: 'active' | 'suspended' | 'pending'
  overallRating: number
  completedContracts: number
}

export interface WorkOffer {
  id: string
  title: string
  description: string
  category: string
  budget: number
  currency: string
  deadline: string
  publishedAt: string
  status: 'open' | 'closed' | 'awarded' | 'cancelled'
  location: string
  requirements: string[]
  submissionsCount: number
}

export interface Submission {
  id: string
  workOfferId: string
  workOfferTitle: string
  vendorId: string
  vendorName: string
  vendorLogo: string
  submittedAt: string
  totalCost: number
  currency: string
  status: 'pending' | 'under_review' | 'accepted' | 'rejected'
  fisaDeAchizitie: AcquisitionItem[]
}

export interface AcquisitionItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Contract {
  id: string
  workOfferId: string
  workOfferTitle: string
  vendorId: string
  vendorName: string
  awardedAt: string
  completedAt?: string
  totalValue: number
  currency: string
  status: 'active' | 'completed' | 'terminated'
  rating?: number
  ratingComment?: string
}


