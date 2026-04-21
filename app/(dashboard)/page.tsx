import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  ClipboardList, 
  Building2, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { workOffers, submissions, contracts, vendors } from '@/lib/mock-data'
import Link from 'next/link'

function formatCurrency(amount: number, currency: string = 'MDL') {
  return new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export default function DashboardPage() {
  const openOffers = workOffers.filter(o => o.status === 'open').length
  const pendingSubmissions = submissions.filter(s => s.status === 'pending' || s.status === 'under_review').length
  const activeContracts = contracts.filter(c => c.status === 'active').length
  const activeVendors = vendors.filter(v => v.status === 'active').length

  const totalContractValue = contracts.reduce((sum, c) => sum + c.totalValue, 0)
  const recentSubmissions = submissions.slice(0, 5)
  const recentContracts = contracts.slice(0, 4)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of procurement activities and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Offers</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOffers}</div>
            <p className="text-xs text-muted-foreground">
              {workOffers.length} total work offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
            <ClipboardList className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              {submissions.length} total submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Contracts</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalContractValue)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Vendors</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVendors}</div>
            <p className="text-xs text-muted-foreground">
              {vendors.length} registered vendors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest vendor submissions for review</CardDescription>
              </div>
              <Link 
                href="/submissions" 
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{submission.vendorName}</p>
                    <p className="text-xs text-muted-foreground truncate">{submission.workOfferTitle}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatCurrency(submission.totalCost)}</span>
                    <SubmissionStatusBadge status={submission.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contracts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contract Overview</CardTitle>
                <CardDescription>Recent contracts and their status</CardDescription>
              </div>
              <Link 
                href="/contracts" 
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContracts.map((contract) => (
                <div key={contract.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contract.workOfferTitle}</p>
                    <p className="text-xs text-muted-foreground truncate">{contract.vendorName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {contract.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{contract.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    )}
                    <ContractStatusBadge status={contract.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/offers" className="group">
              <div className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Work Offer</p>
                  <p className="text-xs text-muted-foreground">Publish a new tender</p>
                </div>
              </div>
            </Link>
            <Link href="/submissions" className="group">
              <div className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                  <ClipboardList className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Review Submissions</p>
                  <p className="text-xs text-muted-foreground">{pendingSubmissions} pending</p>
                </div>
              </div>
            </Link>
            <Link href="/contracts" className="group">
              <div className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Rate Vendors</p>
                  <p className="text-xs text-muted-foreground">Evaluate completed work</p>
                </div>
              </div>
            </Link>
            <Link href="/vendors" className="group">
              <div className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-5/10 text-chart-5">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Manage Vendors</p>
                  <p className="text-xs text-muted-foreground">{vendors.length} registered</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SubmissionStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pending', variant: 'secondary' },
    under_review: { label: 'In Review', variant: 'outline' },
    accepted: { label: 'Accepted', variant: 'default' },
    rejected: { label: 'Rejected', variant: 'destructive' }
  }
  const { label, variant } = config[status] || { label: status, variant: 'secondary' as const }
  return <Badge variant={variant} className="text-xs">{label}</Badge>
}

function ContractStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    active: { label: 'Active', variant: 'default' },
    completed: { label: 'Completed', variant: 'secondary' },
    terminated: { label: 'Terminated', variant: 'destructive' }
  }
  const { label, variant } = config[status] || { label: status, variant: 'secondary' as const }
  return <Badge variant={variant} className="text-xs">{label}</Badge>
}
