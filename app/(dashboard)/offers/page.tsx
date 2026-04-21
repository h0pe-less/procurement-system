'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  FileText, 
  Filter,
  Users,
  DollarSign,
  Clock,
  ExternalLink
} from 'lucide-react'
import { workOffers as initialOffers } from '@/lib/mock-data'
import { WorkOffer } from '@/lib/types'
import Link from 'next/link'

function formatCurrency(amount: number, currency: string = 'MDL') {
  return new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ro-MD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getDaysRemaining(deadline: string) {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function OffersPage() {
  const [offers, setOffers] = useState<WorkOffer[]>(initialOffers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedOffer, setSelectedOffer] = useState<WorkOffer | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const categories = [...new Set(offers.map(o => o.category))]

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || offer.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const openOffers = offers.filter(o => o.status === 'open').length
  const totalBudget = offers.reduce((sum, o) => sum + o.budget, 0)
  const totalSubmissions = offers.reduce((sum, o) => sum + o.submissionsCount, 0)

  const handleViewDetails = (offer: WorkOffer) => {
    setSelectedOffer(offer)
    setDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Work Offers</h1>
          <p className="text-muted-foreground">Manage and publish public procurement tenders</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          New Work Offer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open for Bidding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{openOffers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="awarded">Awarded</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOffers.map((offer) => {
          const daysRemaining = getDaysRemaining(offer.deadline)
          return (
            <Card key={offer.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <OfferStatusBadge status={offer.status} />
                  <Badge variant="outline">{offer.category}</Badge>
                </div>
                <CardTitle className="mt-2 line-clamp-2 text-lg">{offer.title}</CardTitle>
                <CardDescription className="line-clamp-2">{offer.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span className="font-medium">{formatCurrency(offer.budget, offer.currency)}</span>
                    <span className="text-muted-foreground">budget</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>{offer.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>Deadline: {formatDate(offer.deadline)}</span>
                    {offer.status === 'open' && daysRemaining > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {daysRemaining}d left
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="size-4 text-muted-foreground" />
                    <span>{offer.submissionsCount} submissions</span>
                  </div>
                </div>
              </CardContent>
              <div className="flex gap-2 border-t p-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewDetails(offer)}
                >
                  View Details
                </Button>
                <Link href={`/submissions?offerId=${offer.id}`} className="flex-1">
                  <Button variant="default" className="w-full">
                    View Submissions
                  </Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredOffers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="size-12 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-medium">No work offers found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedOffer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <OfferStatusBadge status={selectedOffer.status} />
                  <Badge variant="outline">{selectedOffer.category}</Badge>
                </div>
                <DialogTitle className="text-xl">{selectedOffer.title}</DialogTitle>
                <DialogDescription>{selectedOffer.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Budget</p>
                    <p className="text-lg font-semibold">{formatCurrency(selectedOffer.budget, selectedOffer.currency)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {selectedOffer.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Published</p>
                    <p>{formatDate(selectedOffer.publishedAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                    <p className="flex items-center gap-2">
                      {formatDate(selectedOffer.deadline)}
                      {selectedOffer.status === 'open' && getDaysRemaining(selectedOffer.deadline) > 0 && (
                        <Badge variant="secondary">{getDaysRemaining(selectedOffer.deadline)} days left</Badge>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Requirements</p>
                  <ul className="space-y-2">
                    {selectedOffer.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 rounded-full bg-primary" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Submissions Received</p>
                      <p className="text-2xl font-bold">{selectedOffer.submissionsCount}</p>
                    </div>
                    <Link href={`/submissions?offerId=${selectedOffer.id}`}>
                      <Button>
                        View All Submissions
                        <ExternalLink className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OfferStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    open: { label: 'Open', variant: 'default', className: 'bg-chart-2 text-white' },
    closed: { label: 'Closed', variant: 'secondary' },
    awarded: { label: 'Awarded', variant: 'default', className: 'bg-primary' },
    cancelled: { label: 'Cancelled', variant: 'destructive' }
  }
  const { label, variant, className } = config[status] || { label: status, variant: 'secondary' as const }
  return <Badge variant={variant} className={className}>{label}</Badge>
}
