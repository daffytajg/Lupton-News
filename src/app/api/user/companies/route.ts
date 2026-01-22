// API endpoint for user-specific company management
// Each user has their own list of companies they're tracking

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - List companies for the current user
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
    const type = searchParams.get('type');
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');

    // Get user's company assignments
    const userCompanies = await prisma.userCompanyAssignment.findMany({
      where: { userId: session.user.id },
      include: {
        company: {
          include: {
            parentCompany: {
              select: { id: true, name: true },
            },
            subsidiaries: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    // Format and filter companies
    let companies = userCompanies.map((uc) => ({
      ...uc.company,
      sectors: JSON.parse(uc.company.sectors || '[]'),
      searchIdentifiers: JSON.parse(uc.company.searchIdentifiers || '[]'),
      keyContacts: JSON.parse(uc.company.keyContacts || '[]'),
      assignmentId: uc.id,
      isPrimary: uc.isPrimary,
    }));

    // Apply filters
    if (type) {
      companies = companies.filter((c) => c.type === type.toUpperCase());
    }

    if (sector) {
      companies = companies.filter((c) => c.sectors.includes(sector));
    }

    if (search) {
      const term = search.toLowerCase();
      companies = companies.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.shortName?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term)
      );
    }

    // Sort by name
    companies.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ companies });
  } catch (error: any) {
    console.error('Error fetching user companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add a company to user's list (either existing or new)
export async function POST(request: Request) {
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

    const body = await request.json();
    const {
      companyId, // If adding an existing company
      name,
      shortName,
      type = 'CUSTOMER',
      website,
      logo,
      stockTicker,
      stockExchange,
      headquarters,
      description,
      searchIdentifiers = [],
      sectors = [],
      keyContacts = [],

      isPrimary = false,
    } = body;

    let company;

    if (companyId) {
      // Adding an existing company to user's list
      company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }

      // Check if already assigned
      const existingAssignment = await prisma.userCompanyAssignment.findFirst({
        where: {
          userId: session.user.id,
          companyId: companyId,
        },
      });

      if (existingAssignment) {
        return NextResponse.json(
          { error: 'Company already in your list' },
          { status: 409 }
        );
      }
    } else {
      // Creating a new company
      if (!name) {
        return NextResponse.json(
          { error: 'Company name is required' },
          { status: 400 }
        );
      }

      // Generate a URL-friendly external ID
      const externalId = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if company already exists
      const existing = await prisma.company.findUnique({
        where: { externalId },
      });

      if (existing) {
        company = existing;
        
        // Check if already assigned to user
        const existingAssignment = await prisma.userCompanyAssignment.findFirst({
          where: {
            userId: session.user.id,
            companyId: existing.id,
          },
        });

        if (existingAssignment) {
          return NextResponse.json(
            { error: 'Company already in your list' },
            { status: 409 }
          );
        }
      } else {
        // Create new company
        company = await prisma.company.create({
          data: {
            externalId,
            name,
            shortName,
            type: type.toUpperCase(),
            website,
            logo,
            stockTicker,
            stockExchange,
            headquarters,
            description,
            searchIdentifiers: JSON.stringify(searchIdentifiers),
            sectors: JSON.stringify(sectors),
            keyContacts: JSON.stringify(keyContacts),
          },
        });
      }
    }

    // Create user-company assignment
    const assignment = await prisma.userCompanyAssignment.create({
      data: {
        userId: session.user.id,
        companyId: company.id,

        isPrimary,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({
      success: true,
      company: {
        ...assignment.company,
        sectors: JSON.parse(assignment.company.sectors || '[]'),
        searchIdentifiers: JSON.parse(assignment.company.searchIdentifiers || '[]'),
        keyContacts: JSON.parse(assignment.company.keyContacts || '[]'),
        assignmentId: assignment.id,

        isPrimary: assignment.isPrimary,
      },
    });
  } catch (error: any) {
    console.error('Error adding company:', error);
    return NextResponse.json(
      { error: 'Failed to add company', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove a company from user's list
export async function DELETE(request: Request) {
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
    const assignmentId = searchParams.get('assignmentId');
    const companyId = searchParams.get('companyId');

    if (!assignmentId && !companyId) {
      return NextResponse.json(
        { error: 'Assignment ID or Company ID is required' },
        { status: 400 }
      );
    }

    if (assignmentId) {
      // Delete by assignment ID
      await prisma.userCompanyAssignment.delete({
        where: { 
          id: assignmentId,
          userId: session.user.id, // Ensure user owns this assignment
        },
      });
    } else if (companyId) {
      // Delete by company ID for this user
      await prisma.userCompanyAssignment.deleteMany({
        where: {
          userId: session.user.id,
          companyId: companyId,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Company removed from your list' });
  } catch (error: any) {
    console.error('Error removing company:', error);
    return NextResponse.json(
      { error: 'Failed to remove company', details: error.message },
      { status: 500 }
    );
  }
}
