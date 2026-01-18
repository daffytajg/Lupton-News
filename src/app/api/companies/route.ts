// API endpoint for managing companies (CRUD operations)
// Supports manufacturers, principals, OEMs, and customers

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all companies with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // manufacturer, principal, oem, customer
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');

    const where: any = {};

    if (type) {
      where.type = type.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortName: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        parentCompany: {
          select: { id: true, name: true },
        },
        subsidiaries: {
          select: { id: true, name: true },
        },
      },
    });

    // Parse JSON fields and filter by sector if needed
    const formattedCompanies = companies
      .map((company) => ({
        ...company,
        sectors: JSON.parse(company.sectors || '[]'),
        searchIdentifiers: JSON.parse(company.searchIdentifiers || '[]'),
        keyContacts: JSON.parse(company.keyContacts || '[]'),
      }))
      .filter((company) => {
        if (sector) {
          return company.sectors.includes(sector);
        }
        return true;
      });

    return NextResponse.json({ companies: formattedCompanies });
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new company
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      shortName,
      type = 'CUSTOMER',
      website,
      stockTicker,
      stockExchange,
      headquarters,
      description,
      searchIdentifiers = [],
      sectors = [],
      keyContacts = [],
      parentCompanyId,
    } = body;

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
      return NextResponse.json(
        { error: 'A company with this name already exists' },
        { status: 409 }
      );
    }

    const company = await prisma.company.create({
      data: {
        externalId,
        name,
        shortName,
        type: type.toUpperCase(),
        website,
        stockTicker,
        stockExchange,
        headquarters,
        description,
        searchIdentifiers: JSON.stringify(searchIdentifiers),
        sectors: JSON.stringify(sectors),
        keyContacts: JSON.stringify(keyContacts),
        parentCompanyId,
      },
    });

    return NextResponse.json({
      success: true,
      company: {
        ...company,
        sectors: JSON.parse(company.sectors || '[]'),
        searchIdentifiers: JSON.parse(company.searchIdentifiers || '[]'),
        keyContacts: JSON.parse(company.keyContacts || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update an existing company
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      shortName,
      type,
      website,
      stockTicker,
      stockExchange,
      headquarters,
      description,
      searchIdentifiers,
      sectors,
      keyContacts,
      parentCompanyId,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (shortName !== undefined) updateData.shortName = shortName;
    if (type !== undefined) updateData.type = type.toUpperCase();
    if (website !== undefined) updateData.website = website;
    if (stockTicker !== undefined) updateData.stockTicker = stockTicker;
    if (stockExchange !== undefined) updateData.stockExchange = stockExchange;
    if (headquarters !== undefined) updateData.headquarters = headquarters;
    if (description !== undefined) updateData.description = description;
    if (searchIdentifiers !== undefined)
      updateData.searchIdentifiers = JSON.stringify(searchIdentifiers);
    if (sectors !== undefined) updateData.sectors = JSON.stringify(sectors);
    if (keyContacts !== undefined)
      updateData.keyContacts = JSON.stringify(keyContacts);
    if (parentCompanyId !== undefined)
      updateData.parentCompanyId = parentCompanyId;

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      company: {
        ...company,
        sectors: JSON.parse(company.sectors || '[]'),
        searchIdentifiers: JSON.parse(company.searchIdentifiers || '[]'),
        keyContacts: JSON.parse(company.keyContacts || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove a company
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Company deleted' });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company', details: error.message },
      { status: 500 }
    );
  }
}
