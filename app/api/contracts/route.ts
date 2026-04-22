import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: Request) {
  try {
    // 1. Get the URL parameters for optional filtering
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const vendorIdFilter = searchParams.get('vendorId');

    // 2. Build the query object dynamically
    const whereClause: any = {};
    if (statusFilter && statusFilter !== 'all') whereClause.status = statusFilter;
    if (vendorIdFilter) whereClause.vendorId = vendorIdFilter;

    // 3. Fetch the contracts from the database
    const contracts = await prisma.contract.findMany({
      where: whereClause,
      include: {
        vendor: {
          select: {
            name: true,
            idno: true,
          }
        }
      },
      orderBy: {
        completedAt: 'desc',
      }
    });

    // 4. Format the result to flatten the vendor name
    const formattedContracts = contracts.map((contract) => {
      const { vendor, ...contractData } = contract;
      console.log(contractData)
      
      return {
        ...contractData,
        vendorName: vendor?.name || 'Unknown Vendor',
        // BUG 2 FIXED: Changed key to vendorIdno so it doesn't overwrite vendorId
        vendorIdno: vendor?.idno || null, 
      };
    });

    // 5. Return the formatted data
    return NextResponse.json(formattedContracts, { status: 200 });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to retrieve contracts from the database." },
      { status: 500 }
    );
  }
}
