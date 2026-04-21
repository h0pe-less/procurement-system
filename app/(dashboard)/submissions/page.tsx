'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  Search, 
  Filter, 
  ClipboardList,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Building2
} from 'lucide-react'
import { submissions as initialSubmissions, workOffers } from '@/lib/mock-data'
import { Submission } from '@/lib/types'
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

export default function SubmissionsPage() {
  const searchParams = useSearchParams()
  const offerIdParam = searchParams.get('offerId')

  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [offerFilter, setOfferFilter] = useState<string>(offerIdParam || 'all')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  useEffect(() => {
    if (offerIdParam) {
      setOfferFilter(offerIdParam)
    }
  }, [offerIdParam])

  const uniqueOffers = [...new Map(submissions.map(s => [s.workOfferId, { id: s.workOfferId, title: s.workOfferTitle }])).values()]

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.workOfferTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter
    const matchesOffer = offerFilter === 'all' || submission.workOfferId === offerFilter
    return matchesSearch && matchesStatus && matchesOffer
  })

  const pendingCount = submissions.filter(s => s.status === 'pending').length
  const reviewCount = submissions.filter(s => s.status === 'under_review').length
  const acceptedCount = submissions.filter(s => s.status === 'accepted').length

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission)
    setDetailsDialogOpen(true)
  }

  const handleUpdateStatus = (submissionId: string, newStatus: 'pending' | 'under_review' | 'accepted' | 'rejected') => {
    setSubmissions(prev => prev.map(s => 
      s.id === submissionId ? { ...s, status: newStatus } : s
    ))
    if (selectedSubmission?.id === submissionId) {
      setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">Review vendor submissions and acquisition forms</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{reviewCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{acceptedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>{filteredSubmissions.length} submissions found</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={offerFilter} onValueChange={setOfferFilter}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Work Offer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Offers</SelectItem>
                  {uniqueOffers.map(offer => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.title.length > 30 ? offer.title.slice(0, 30) + '...' : offer.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Work Offer</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <Link 
                          href={`/vendors/${submission.vendorId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {submission.vendorName}
                        </Link>
                        <p className="text-xs text-muted-foreground">ID: {submission.vendorId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[200px] truncate">{submission.workOfferTitle}</p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(submission.totalCost, submission.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="size-3" />
                      <span className="text-sm">{formatDate(submission.submittedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SubmissionStatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(submission)}
                      >
                        <Eye className="mr-1 size-4" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSubmissions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="size-12 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium">No submissions found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <SubmissionStatusBadge status={selectedSubmission.status} />
                </div>
                <DialogTitle>Submission Details</DialogTitle>
                <DialogDescription>
                  Submitted by {selectedSubmission.vendorName} for {selectedSubmission.workOfferTitle}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Total Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{formatCurrency(selectedSubmission.totalCost, selectedSubmission.currency)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Submitted</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{formatDate(selectedSubmission.submittedAt)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{selectedSubmission.fisaDeAchizitie.length}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Fisa de Achizitie */}
                <Accordion type="single" collapsible defaultValue="fisa">
                  <AccordionItem value="fisa">
                    <AccordionTrigger className="text-base font-semibold">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="size-5" />
                        Fisa de Achizitie (Acquisition Form)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                              <TableHead className="text-right">Unit Price</TableHead>
                              <TableHead className="text-right">Total Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedSubmission.fisaDeAchizitie.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(item.totalPrice)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={3} className="font-semibold">Total</TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(selectedSubmission.totalCost, selectedSubmission.currency)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Vendor Info */}
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-semibold">Vendor Information</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="size-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedSubmission.vendorName}</p>
                        <p className="text-sm text-muted-foreground">ID: {selectedSubmission.vendorId}</p>
                      </div>
                    </div>
                    <Link href={`/vendors/${selectedSubmission.vendorId}`}>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </Link>
                  </div>
                </div>

                {/* Actions */}
                {(selectedSubmission.status === 'pending' || selectedSubmission.status === 'under_review') && (
                  <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">Review Actions</p>
                      <p className="text-sm text-muted-foreground">Update the submission status</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedSubmission.status === 'pending' && (
                        <Button 
                          variant="outline"
                          onClick={() => handleUpdateStatus(selectedSubmission.id, 'under_review')}
                        >
                          Start Review
                        </Button>
                      )}
                      <Button 
                        variant="destructive"
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                      >
                        <XCircle className="mr-2 size-4" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'accepted')}
                        className="bg-chart-2 hover:bg-chart-2/90"
                      >
                        <CheckCircle2 className="mr-2 size-4" />
                        Accept
                      </Button>
                    </div>
                  </div>
                )}
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

function SubmissionStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    pending: { label: 'Pending', variant: 'secondary', className: 'bg-chart-4 text-white' },
    under_review: { label: 'Under Review', variant: 'outline', className: 'border-primary text-primary' },
    accepted: { label: 'Accepted', variant: 'default', className: 'bg-chart-2 text-white' },
    rejected: { label: 'Rejected', variant: 'destructive' }
  }
  const { label, variant, className } = config[status] || { label: status, variant: 'secondary' as const }
  return <Badge variant={variant} className={className}>{label}</Badge>
}
