'use client'

import { useState, useEffect } from 'react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Search, Star, Building2, Calendar, FileText, Filter } from 'lucide-react'
import { contracts as initialContracts } from '@/lib/mock-data'
import { Contract } from '@/lib/types'
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

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. UI & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState('');

  // 3. Fetch Data on Mount
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/contracts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contracts from the server.');
        }
        
        const data = await response.json();

        // Transform the DB data to match your UI's expected structure
        const formattedContracts: Contract[] = data.map((contract: any) => ({
          ...contract,
          // Handle potential nulls from the database safely
          workOfferTitle: contract.workOfferTitle || 'Untitled Offer',
          vendorName: contract.vendorName || 'Unknown Vendor',
          status: contract.status || 'unknown',
          // Prisma Decimals come as strings/objects in JSON, parse them to numbers
          totalValue: parseFloat(contract.totalValue) || 0, 
        }));

        setContracts(formattedContracts);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);
  

  // 4. Derived & Filtered Data
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.workOfferTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredContracts.reduce((sum, c) => sum + c.totalValue, 0);
  const activeCount = contracts.filter(c => c.status === 'active').length;
  const completedCount = contracts.filter(c => c.status === 'completed').length;
  
  // Safe average calculation (avoids dividing by zero)
  const ratedContracts = contracts.filter(c => c.rating && c.rating > 0);
  const avgRating = ratedContracts.length > 0 
    ? ratedContracts.reduce((sum, c) => sum + Number(c.rating || 0), 0) / ratedContracts.length 
    : 0;
  console.log(avgRating)

  // 5. Handlers
  const handleRateContract = (contract: Contract) => {
    setSelectedContract(contract);
    setNewRating(contract.rating || 0);
    setRatingComment(contract.ratingComment || '');
    setRatingDialogOpen(true);
  };

  const handleSaveRating = () => {
    if (selectedContract) {
      // Note: This only updates the local state! 
      // You will eventually need a fetch('/api/contracts/rate', { method: 'POST', ... }) here to save to the DB.
      setContracts(prev => prev.map(c => 
        c.id === selectedContract.id 
          ? { ...c, rating: newRating, ratingComment }
          : c
      ));
      setRatingDialogOpen(false);
      setSelectedContract(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">Manage awarded contracts and rate vendor performance</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">{avgRating.toFixed(2)} </span>
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Contracts</CardTitle>
              <CardDescription>
                {filteredContracts.length} contracts • {formatCurrency(totalValue)} total value
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contracts..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
<Table>
            <TableHeader>
              <TableRow>
                {/* 1. Set explicit max-widths for text-heavy columns */}
                <TableHead className="w-[200px] sm:w-[300px]">Contract</TableHead>
                <TableHead className="w-[120px] sm:w-[180px]">Vendor</TableHead>
                {/* 2. Prevent wrapping for dates, values, and actions */}
                <TableHead className="whitespace-nowrap">Value</TableHead>
                <TableHead className="whitespace-nowrap">Awarded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="whitespace-nowrap">Rating</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  
                  {/* Contract Column */}
                  <TableCell className="max-w-[200px] sm:max-w-[300px]">
                    <div className="flex items-center gap-3">
                      {/* shrink-0 prevents the icon from squishing */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="size-5 text-primary" />
                      </div>
                      {/* min-w-0 is required for truncate to work inside a flex container */}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate" title={contract.workOfferTitle}>
                          {contract.workOfferTitle}
                        </p>
                        <p className="text-xs text-muted-foreground truncate" title={contract.id}>
                          ID: {contract.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Vendor Column */}
                  <TableCell className="max-w-[120px] sm:max-w-[180px]">
                    <Link 
                      href={`/vendors/${contract.vendorId}`}
                      className="block text-primary hover:underline truncate"
                      title={contract.vendorName}
                    >
                      {contract.vendorName}
                    </Link>
                  </TableCell>

                  {/* Value Column */}
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatCurrency(contract.totalValue, contract.currency)}
                  </TableCell>

                  {/* Awarded / Completed Column */}
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="size-3 shrink-0" />
                      <span className="text-sm">
                        {contract.awardedAt ? formatDate(contract.awardedAt) : 'N/A'}
                      </span>
                    </div>
                    {contract.completedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Completed: {formatDate(contract.completedAt)}
                      </p>
                    )}
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    <ContractStatusBadge status={contract.status} />
                  </TableCell>

                  {/* Rating Column */}
                  <TableCell className="whitespace-nowrap min-w-[100px]">
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
                      <span className="text-sm text-muted-foreground">Not rated</span>
                    )}
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right whitespace-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRateContract(contract)}
                      disabled={contract.status === 'active'}
                    >
                      {contract.rating ? 'Edit Rating' : 'Rate'}
                    </Button>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredContracts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="size-12 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium">No contracts found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Vendor Performance</DialogTitle>
            <DialogDescription>
              {selectedContract && (
                <span>
                  Rate {selectedContract.vendorName} for their work on {selectedContract.workOfferTitle}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`size-8 ${
                        star <= newRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/30 hover:text-yellow-400/50'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comments</Label>
              <Textarea
                id="comment"
                placeholder="Provide feedback about the vendor's performance..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRating} disabled={newRating === 0}>
              Save Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
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
