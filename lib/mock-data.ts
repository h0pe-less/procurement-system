import { Vendor, WorkOffer, Submission, Contract } from './types'

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'TechBuild Solutions SRL',
    idno: '1003600012345',
    address: 'Str. Stefan cel Mare 45, Chisinau',
    website: 'https://techbuild.md',
    logo: '/placeholder.svg?height=80&width=80',
    email: 'contact@techbuild.md',
    phone: '+373 22 123 456',
    registrationDate: '2020-03-15',
    status: 'active',
    overallRating: 4.5,
    completedContracts: 12
  },
  {
    id: 'v2',
    name: 'Infrastructure Pro SA',
    idno: '1003600023456',
    address: 'Bd. Dacia 78, Chisinau',
    website: 'https://infrapro.md',
    logo: '/placeholder.svg?height=80&width=80',
    email: 'office@infrapro.md',
    phone: '+373 22 234 567',
    registrationDate: '2018-07-22',
    status: 'active',
    overallRating: 4.8,
    completedContracts: 28
  },
  {
    id: 'v3',
    name: 'GreenEnergy Construct',
    idno: '1003600034567',
    address: 'Str. Ismail 112, Chisinau',
    website: 'https://greenenergy.md',
    logo: '/placeholder.svg?height=80&width=80',
    email: 'info@greenenergy.md',
    phone: '+373 22 345 678',
    registrationDate: '2021-01-10',
    status: 'active',
    overallRating: 4.2,
    completedContracts: 7
  },
  {
    id: 'v4',
    name: 'ModernRoads SRL',
    idno: '1003600045678',
    address: 'Str. Calea Iesilor 23, Chisinau',
    website: 'https://modernroads.md',
    logo: '/placeholder.svg?height=80&width=80',
    email: 'contact@modernroads.md',
    phone: '+373 22 456 789',
    registrationDate: '2019-11-05',
    status: 'suspended',
    overallRating: 3.1,
    completedContracts: 5
  },
  {
    id: 'v5',
    name: 'AquaSystems Moldova',
    idno: '1003600056789',
    address: 'Str. Albisoara 88, Chisinau',
    website: 'https://aquasystems.md',
    logo: '/placeholder.svg?height=80&width=80',
    email: 'sales@aquasystems.md',
    phone: '+373 22 567 890',
    registrationDate: '2022-04-18',
    status: 'pending',
    overallRating: 0,
    completedContracts: 0
  }
]

export const workOffers: WorkOffer[] = [
  {
    id: 'wo1',
    title: 'Road Rehabilitation - National Route M2',
    description: 'Complete rehabilitation of 45km section of the M2 national road including asphalt replacement, drainage systems, and road markings.',
    category: 'Infrastructure',
    budget: 2500000,
    currency: 'MDL',
    deadline: '2026-06-30',
    publishedAt: '2026-04-15',
    status: 'open',
    location: 'Chisinau - Balti',
    requirements: ['ISO 9001 certification', 'Minimum 5 years experience', 'Equipment ownership proof'],
    submissionsCount: 3
  },
  {
    id: 'wo2',
    title: 'School Building Renovation - Lyceum Nr. 1',
    description: 'Complete interior and exterior renovation of the main building including electrical systems, heating, and accessibility features.',
    category: 'Construction',
    budget: 850000,
    currency: 'MDL',
    deadline: '2026-08-15',
    publishedAt: '2026-04-20',
    status: 'open',
    location: 'Chisinau',
    requirements: ['Construction license Class A', 'Safety certification'],
    submissionsCount: 5
  },
  {
    id: 'wo3',
    title: 'Water Supply Network Extension',
    description: 'Extension of municipal water supply network to cover new residential district with 2.5km of main pipeline.',
    category: 'Utilities',
    budget: 1200000,
    currency: 'MDL',
    deadline: '2026-05-30',
    publishedAt: '2026-03-10',
    status: 'closed',
    location: 'Chisinau - Durlesti',
    requirements: ['Utility works certification', 'Environmental compliance certificate'],
    submissionsCount: 4
  },
  {
    id: 'wo4',
    title: 'Solar Panel Installation - Government Complex',
    description: 'Installation of 500kW solar panel system on government administrative buildings with battery storage.',
    category: 'Energy',
    budget: 3200000,
    currency: 'MDL',
    deadline: '2026-09-30',
    publishedAt: '2026-05-01',
    status: 'open',
    location: 'Chisinau',
    requirements: ['Renewable energy certification', 'Electrical contractor license'],
    submissionsCount: 2
  },
  {
    id: 'wo5',
    title: 'Public Park Development',
    description: 'Development of new 5-hectare public park including landscaping, pathways, lighting, and recreational facilities.',
    category: 'Urban Development',
    budget: 1800000,
    currency: 'MDL',
    deadline: '2026-07-15',
    publishedAt: '2026-04-01',
    status: 'awarded',
    location: 'Chisinau - Botanica',
    requirements: ['Landscaping certification', 'Urban development experience'],
    submissionsCount: 6
  }
]

export const submissions: Submission[] = [
  {
    id: 's1',
    workOfferId: 'wo1',
    workOfferTitle: 'Road Rehabilitation - National Route M2',
    vendorId: 'v1',
    vendorName: 'TechBuild Solutions SRL',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    submittedAt: '2026-04-25',
    totalCost: 2350000,
    currency: 'MDL',
    status: 'under_review',
    fisaDeAchizitie: [
      { description: 'Asphalt materials', quantity: 4500, unitPrice: 320, totalPrice: 1440000 },
      { description: 'Labor costs', quantity: 1, unitPrice: 450000, totalPrice: 450000 },
      { description: 'Equipment rental', quantity: 30, unitPrice: 8000, totalPrice: 240000 },
      { description: 'Drainage materials', quantity: 1, unitPrice: 180000, totalPrice: 180000 },
      { description: 'Road markings', quantity: 1, unitPrice: 40000, totalPrice: 40000 }
    ]
  },
  {
    id: 's2',
    workOfferId: 'wo1',
    workOfferTitle: 'Road Rehabilitation - National Route M2',
    vendorId: 'v2',
    vendorName: 'Infrastructure Pro SA',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    submittedAt: '2026-04-28',
    totalCost: 2420000,
    currency: 'MDL',
    status: 'pending',
    fisaDeAchizitie: [
      { description: 'Premium asphalt', quantity: 4500, unitPrice: 350, totalPrice: 1575000 },
      { description: 'Specialized labor', quantity: 1, unitPrice: 480000, totalPrice: 480000 },
      { description: 'Heavy equipment', quantity: 25, unitPrice: 9200, totalPrice: 230000 },
      { description: 'Drainage system', quantity: 1, unitPrice: 95000, totalPrice: 95000 },
      { description: 'Markings and signs', quantity: 1, unitPrice: 40000, totalPrice: 40000 }
    ]
  },
  {
    id: 's3',
    workOfferId: 'wo2',
    workOfferTitle: 'School Building Renovation - Lyceum Nr. 1',
    vendorId: 'v1',
    vendorName: 'TechBuild Solutions SRL',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    submittedAt: '2026-04-30',
    totalCost: 780000,
    currency: 'MDL',
    status: 'accepted',
    fisaDeAchizitie: [
      { description: 'Building materials', quantity: 1, unitPrice: 350000, totalPrice: 350000 },
      { description: 'Electrical systems', quantity: 1, unitPrice: 180000, totalPrice: 180000 },
      { description: 'Heating system', quantity: 1, unitPrice: 150000, totalPrice: 150000 },
      { description: 'Labor', quantity: 1, unitPrice: 100000, totalPrice: 100000 }
    ]
  },
  {
    id: 's4',
    workOfferId: 'wo3',
    workOfferTitle: 'Water Supply Network Extension',
    vendorId: 'v5',
    vendorName: 'AquaSystems Moldova',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    submittedAt: '2026-03-25',
    totalCost: 1150000,
    currency: 'MDL',
    status: 'rejected',
    fisaDeAchizitie: [
      { description: 'Pipeline materials', quantity: 2500, unitPrice: 320, totalPrice: 800000 },
      { description: 'Excavation works', quantity: 1, unitPrice: 200000, totalPrice: 200000 },
      { description: 'Installation labor', quantity: 1, unitPrice: 150000, totalPrice: 150000 }
    ]
  },
  {
    id: 's5',
    workOfferId: 'wo4',
    workOfferTitle: 'Solar Panel Installation - Government Complex',
    vendorId: 'v3',
    vendorName: 'GreenEnergy Construct',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    submittedAt: '2026-05-08',
    totalCost: 3050000,
    currency: 'MDL',
    status: 'under_review',
    fisaDeAchizitie: [
      { description: 'Solar panels (500kW)', quantity: 1250, unitPrice: 1800, totalPrice: 2250000 },
      { description: 'Battery storage system', quantity: 1, unitPrice: 450000, totalPrice: 450000 },
      { description: 'Inverters and electronics', quantity: 1, unitPrice: 200000, totalPrice: 200000 },
      { description: 'Installation and wiring', quantity: 1, unitPrice: 150000, totalPrice: 150000 }
    ]
  }
]

export const contracts: Contract[] = [
  {
    id: 'c1',
    workOfferId: 'wo5',
    workOfferTitle: 'Public Park Development',
    vendorId: 'v2',
    vendorName: 'Infrastructure Pro SA',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    awardedAt: '2026-04-20',
    totalValue: 1750000,
    currency: 'MDL',
    status: 'active',
    rating: undefined,
    ratingComment: undefined
  },
  {
    id: 'c2',
    workOfferId: 'wo-old-1',
    workOfferTitle: 'Bridge Repair - Raut River',
    vendorId: 'v2',
    vendorName: 'Infrastructure Pro SA',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    awardedAt: '2025-08-15',
    completedAt: '2026-02-28',
    totalValue: 4200000,
    currency: 'MDL',
    status: 'completed',
    rating: 5,
    ratingComment: 'Excellent work quality. Completed ahead of schedule with superior materials.'
  },
  {
    id: 'c3',
    workOfferId: 'wo-old-2',
    workOfferTitle: 'Municipal Building HVAC Upgrade',
    vendorId: 'v1',
    vendorName: 'TechBuild Solutions SRL',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    awardedAt: '2025-10-01',
    completedAt: '2026-01-15',
    totalValue: 920000,
    currency: 'MDL',
    status: 'completed',
    rating: 4,
    ratingComment: 'Good work overall. Minor delays but final quality was satisfactory.'
  },
  {
    id: 'c4',
    workOfferId: 'wo-old-3',
    workOfferTitle: 'Street Lighting Modernization',
    vendorId: 'v3',
    vendorName: 'GreenEnergy Construct',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    awardedAt: '2025-11-20',
    completedAt: '2026-03-10',
    totalValue: 680000,
    currency: 'MDL',
    status: 'completed',
    rating: 4,
    ratingComment: 'Energy-efficient LED installation completed. Good communication throughout.'
  },
  {
    id: 'c5',
    workOfferId: 'wo-old-4',
    workOfferTitle: 'Parking Lot Construction',
    vendorId: 'v4',
    vendorName: 'ModernRoads SRL',
    vendorLogo: '/placeholder.svg?height=40&width=40',
    awardedAt: '2025-06-01',
    completedAt: '2025-12-15',
    totalValue: 520000,
    currency: 'MDL',
    status: 'terminated',
    rating: 2,
    ratingComment: 'Contract terminated due to quality issues and significant delays. Partial completion only.'
  }
]
