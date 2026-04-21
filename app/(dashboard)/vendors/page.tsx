'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Vendor } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Users,
  Star,
  Building2,
  ExternalLink,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react'
import { vendors } from '@/lib/mock-data'
import Link from 'next/link'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ro-MD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function VendorsPage() {
const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Filter States (You would attach these to your input/select UI)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 3. The Fetch Logic
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendors');
        
        if (!response.ok) {
          throw new Error("Failed to fetch vendors from the server.");
        }
        
        const data = await response.json();
        setVendors(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []); // The empty array ensures this only runs once when the page loads

  // 4. Your Filtering Logic
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.idno.includes(searchQuery) ||
      vendor.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeVendors = vendors.length
  console.log(vendors)
  const totalContracts = 260
  const avgRating = vendors.filter(v => Number(v.rating) > 0).reduce((sum, v, _, arr) => sum + Number(v.rating) / arr.length, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
        <p className="text-muted-foreground">Manage registered vendors and view their profiles</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{activeVendors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, IDNO, or address..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vendors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage src={vendor.logo} alt={vendor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {vendor.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{vendor.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">IDNO: {vendor.idno}</p>
                  </div>
                </div>
                <VendorStatusBadge status={vendor.status} />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{vendor.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Since {formatDate(vendor.registrationDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{vendor.completedContracts} completed contracts</span>
                </div>
                {vendor.overallRating > 0 && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          star <= Math.round(vendor.overallRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium">{vendor.overallRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="border-t p-4">
              <Link href={`/vendors/${vendor.id}`}>
                <Button variant="outline" className="w-full">
                  View Profile
                  <ExternalLink className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="size-12 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-medium">No vendors found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
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
