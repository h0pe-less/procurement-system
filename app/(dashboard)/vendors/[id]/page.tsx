import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Building2,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  FileText,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import { vendors, contracts, submissions } from '@/lib/mock-data'
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

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vendor = vendors.find(v => v.id === id)

  if (!vendor) {
    notFound()
  }

  const vendorContracts = contracts.filter(c => c.vendorId === id)
  const vendorSubmissions = submissions.filter(s => s.vendorId === id)
  const totalContractValue = vendorContracts.reduce((sum, c) => sum + c.totalValue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendors">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendor Profile</h1>
          <p className="text-muted-foreground">View vendor details and history</p>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="size-20">
                <AvatarImage src={vendor.logo} alt={vendor.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {vendor.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{vendor.name}</h2>
                  <VendorStatusBadge status={vendor.status} />
                </div>
                <p className="text-muted-foreground">IDNO: {vendor.idno}</p>
                {vendor.overallRating > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-5 ${
                          star <= Math.round(vendor.overallRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-lg font-semibold">{vendor.overallRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">overall rating</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{vendor.completedContracts}</p>
                <p className="text-xs text-muted-foreground">Contracts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{vendorSubmissions.length}</p>
                <p className="text-xs text-muted-foreground">Submissions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatCurrency(totalContractValue)}</p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{vendor.overallRating > 0 ? vendor.overallRating.toFixed(1) : 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contact Info */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{vendor.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Phone className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{vendor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{vendor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Globe className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <a 
                  href={vendor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {vendor.website.replace('https://', '')}
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for History */}
      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contracts">
            <Building2 className="mr-2 size-4" />
            Contracts ({vendorContracts.length})
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <FileText className="mr-2 size-4" />
            Submissions ({vendorSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contract History</CardTitle>
              <CardDescription>All contracts awarded to this vendor</CardDescription>
            </CardHeader>
            <CardContent>
              {vendorContracts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Awarded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell>
                          <p className="font-medium">{contract.workOfferTitle}</p>
                          <p className="text-xs text-muted-foreground">ID: {contract.id}</p>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(contract.totalValue, contract.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="size-3" />
                            <span className="text-sm">{formatDate(contract.awardedAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ContractStatusBadge status={contract.status} />
                        </TableCell>
                        <TableCell>
                          {contract.rating ? (
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`size-4 ${
                                    star <= contract.rating!
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Building2 className="size-12 text-muted-foreground/30" />
                  <p className="mt-4 text-lg font-medium">No contracts yet</p>
                  <p className="text-sm text-muted-foreground">This vendor has not been awarded any contracts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
              <CardDescription>All submissions made by this vendor</CardDescription>
            </CardHeader>
            <CardContent>
              {vendorSubmissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Offer</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <p className="font-medium">{submission.workOfferTitle}</p>
                          <p className="text-xs text-muted-foreground">ID: {submission.id}</p>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="size-12 text-muted-foreground/30" />
                  <p className="mt-4 text-lg font-medium">No submissions yet</p>
                  <p className="text-sm text-muted-foreground">This vendor has not made any submissions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rating Reviews Section */}
      {vendorContracts.filter(c => c.rating && c.ratingComment).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>Feedback from completed contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorContracts
                .filter(c => c.rating && c.ratingComment)
                .map((contract) => (
                  <div key={contract.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{contract.workOfferTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          Completed on {contract.completedAt ? formatDate(contract.completedAt) : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-4 ${
                              star <= contract.rating!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{contract.ratingComment}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function VendorStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    active: { label: 'Active', variant: 'default', className: 'bg-chart-2 text-white' },
    suspended: { label: 'Suspended', variant: 'destructive' },
    pending: { label: 'Pending', variant: 'secondary', className: 'bg-chart-4 text-white' }
  }
  const { label, variant, className } = config[status] || { label: status, variant: 'secondary' as const }
  return <Badge variant={variant} className={className}>{label}</Badge>
}

function ContractStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    active: { label: 'Active', variant: 'default', className: 'bg-primary' },
    completed: { label: 'Completed', variant: 'secondary', className: 'bg-chart-2 text-white' },
    terminated: { label: 'Terminated', variant: 'destructive' }
  }
  const { label, variant, className } = config[status] || { label: status, variant: 'secondary' as const }
  return <Badge variant={variant} className={className}>{label}</Badge>
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
