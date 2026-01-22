// API endpoint to search all companies (for adding to user's list)
// This returns all companies in the system, not just user-specific ones

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get user's existing company IDs
    const userAssignments = await prisma.userCompanyAssignment.findMany({
      where: { userId: session.user.id },
      select: { companyId: true },
    });
    const userCompanyIds = userAssignments.map((a) => a.companyId);

    // Search companies
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { shortName: { contains: search, mode: 'insensitive' } },
          { stockTicker: { contains: search, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    // Mark which companies are already in user's list
    const formattedCompanies = companies.map((company) => ({
      ...company,
      sectors: JSON.parse(company.sectors || '[]'),
      searchIdentifiers: JSON.parse(company.searchIdentifiers || '[]'),
      keyContacts: JSON.parse(company.keyContacts || '[]'),
      isInUserList: userCompanyIds.includes(company.id),
    }));

    return NextResponse.json({ companies: formattedCompanies });
  } catch (error: any) {
    console.error('Error searching companies:', error);
    return NextResponse.json(
      { error: 'Failed to search companies', details: error.message },
      { status: 500 }
    );
  }
}
