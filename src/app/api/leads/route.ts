import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Get all leads with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (sector) {
      where.sector = sector;
    }

    const [leads, total] = await Promise.all([
      prisma.prospectLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.prospectLead.count({ where }),
    ]);

    // Get stats
    const stats = await prisma.prospectLead.groupBy({
      by: ['status'],
      _count: true,
    });

    return NextResponse.json({
      leads,
      total,
      stats: stats.reduce((acc, s) => {
        acc[s.status] = s._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// Create a new lead manually
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      companyName,
      website,
      sector,
      territory,
      notes,
      estimatedValue,
    } = body;

    if (!companyName || !sector) {
      return NextResponse.json(
        { error: 'Company name and sector are required' },
        { status: 400 }
      );
    }

    const lead = await prisma.prospectLead.create({
      data: {
        companyName,
        website,
        sourceType: 'manual',
        sector,
        territory,
        estimatedValue,
        notes,
        status: 'new',
      },
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

// Update lead status or assign to user
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, status, assignedUserId, notes } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (assignedUserId) {
      updateData.assignedUserId = assignedUserId;
      updateData.assignedAt = new Date();
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const lead = await prisma.prospectLead.update({
      where: { id: leadId },
      data: updateData,
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
