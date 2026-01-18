// API endpoint to sync companies from static data to database
// This imports companies from the data/companies.ts file into the database

import { NextResponse } from 'next/server';
import { MANUFACTURERS, CUSTOMERS } from '@/data/companies';

export async function POST(request: Request) {
  // Check if database is configured
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Database not configured. Sync requires a database connection.' },
      { status: 503 }
    );
  }

  try {
    // Dynamic import to avoid loading Prisma when not needed
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };

    // Combine all companies
    const allCompanies = [...MANUFACTURERS, ...CUSTOMERS];

    for (const company of allCompanies) {
      try {
        // Map type to uppercase
        const dbType = company.type.toUpperCase();

        // Check if company exists
        const existing = await prisma.company.findUnique({
          where: { externalId: company.id },
        });

        const companyData = {
          name: company.name,
          shortName: company.name.split(' ')[0], // Simple short name
          type: dbType,
          website: company.website || null,
          stockTicker: company.ticker || null,
          headquarters: company.headquarters || null,
          description: company.description || null,
          searchIdentifiers: JSON.stringify(company.searchIdentifiers || []),
          sectors: JSON.stringify(company.sectors || []),
          keyContacts: JSON.stringify([]),
        };

        if (existing) {
          await prisma.company.update({
            where: { externalId: company.id },
            data: companyData,
          });
          results.updated++;
        } else {
          await prisma.company.create({
            data: {
              externalId: company.id,
              ...companyData,
            },
          });
          results.created++;
        }
      } catch (err: any) {
        results.errors.push(`${company.name}: ${err.message}`);
      }
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: `Synced ${results.created + results.updated} companies`,
      ...results,
    });
  } catch (error: any) {
    console.error('Error syncing companies:', error);
    return NextResponse.json(
      { error: 'Failed to sync companies', details: error.message },
      { status: 500 }
    );
  }
}
