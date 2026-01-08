import { NextRequest, NextResponse } from 'next/server';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserPreferences,
  addTaggedCompany,
  removeTaggedCompany,
  getUserRelevantCompanies,
  getSentArticleStats,
  UserPreferences,
} from '@/lib/userPreferences';
import { getCompanyById } from '@/data/companies';

// GET - List all users or get specific user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  try {
    // Get specific user by ID
    if (userId) {
      const user = getUserById(userId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      const relevantCompanies = getUserRelevantCompanies(userId);
      const sentStats = getSentArticleStats(userId);

      return NextResponse.json({
        success: true,
        user: {
          ...user,
          relevantCompanyCount: relevantCompanies.length,
          sentArticleStats: sentStats,
        },
      });
    }

    // Get specific user by email
    if (email) {
      const user = getUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, user });
    }

    // List all users
    const users = getAllUsers();
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        assignedCustomerCount: user.assignedCustomers.length,
        taggedCompanyCount: user.taggedCompanies.length,
        emailEnabled: user.emailPreferences.enabled,
      })),
      total: users.length,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// PUT - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updated = updateUserPreferences(userId, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updated,
      message: 'User preferences updated successfully',
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update user preferences' },
      { status: 500 }
    );
  }
}

// POST - Tag/untag companies for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, companyId } = body;

    if (!userId || !companyId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Company ID are required' },
        { status: 400 }
      );
    }

    // Verify company exists
    const company = getCompanyById(companyId);
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'tagCompany': {
        const success = addTaggedCompany(userId, companyId);
        if (!success) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: `Company "${company.name}" added to your followed companies`,
        });
      }

      case 'untagCompany': {
        const success = removeTaggedCompany(userId, companyId);
        if (!success) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: `Company "${company.name}" removed from your followed companies`,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: tagCompany or untagCompany' },
          { status: 400 }
        );
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update company tags' },
      { status: 500 }
    );
  }
}
