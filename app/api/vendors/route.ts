import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        // This tells Prisma to execute the LEFT JOIN and COUNT
        _count: {
          select: {
            contracts: {
            
            },
          },
        },
      },
    });

    const formattedVendors = vendors.map((vendor) => {
      const { _count, ...vendorData } = vendor;
      
      return {
        ...vendorData,
        // Map the count to the completedContracts property your frontend expects
        completedContracts: _count.contracts, 
      };
    });

    return NextResponse.json(formattedVendors, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to retrieve vendors." },
      { status: 500 }
    );
  }
}