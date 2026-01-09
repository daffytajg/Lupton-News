import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Lupton Associates team members (18 users)
const LUPTON_TEAM = [
  // Executives
  { name: 'Alan Lupton II', email: 'alan@luptons.com', role: 'EXECUTIVE', team: 'Executive' },
  { name: 'Tom Lupton', email: 'tom@luptons.com', role: 'EXECUTIVE', team: 'Executive' },
  
  // Sales Team - Datacenter
  { name: 'Mike Johnson', email: 'mike.johnson@luptons.com', role: 'SALES', team: 'Datacenter' },
  { name: 'Sarah Chen', email: 'sarah.chen@luptons.com', role: 'SALES', team: 'Datacenter' },
  
  // Sales Team - Military & Aerospace
  { name: 'David Martinez', email: 'david.martinez@luptons.com', role: 'SALES', team: 'Military & Aerospace' },
  { name: 'Jennifer Williams', email: 'jennifer.williams@luptons.com', role: 'SALES', team: 'Military & Aerospace' },
  { name: 'Robert Taylor', email: 'robert.taylor@luptons.com', role: 'SALES', team: 'Military & Aerospace' },
  
  // Sales Team - Heavy Trucks
  { name: 'James Anderson', email: 'james.anderson@luptons.com', role: 'SALES', team: 'Heavy Trucks' },
  { name: 'Lisa Thompson', email: 'lisa.thompson@luptons.com', role: 'SALES', team: 'Heavy Trucks' },
  { name: 'Chris Davis', email: 'chris.davis@luptons.com', role: 'SALES', team: 'Heavy Trucks' },
  
  // Sales Team - Medical & Scientific
  { name: 'Amanda Wilson', email: 'amanda.wilson@luptons.com', role: 'SALES', team: 'Medical & Scientific' },
  { name: 'Kevin Brown', email: 'kevin.brown@luptons.com', role: 'SALES', team: 'Medical & Scientific' },
  
  // Sales Team - Robotics & Automation
  { name: 'Michelle Garcia', email: 'michelle.garcia@luptons.com', role: 'SALES', team: 'Robotics & Automation' },
  { name: 'Daniel Lee', email: 'daniel.lee@luptons.com', role: 'SALES', team: 'Robotics & Automation' },
  { name: 'Rachel Kim', email: 'rachel.kim@luptons.com', role: 'SALES', team: 'Robotics & Automation' },
  
  // Admin & Support
  { name: 'Emily Parker', email: 'emily.parker@luptons.com', role: 'ADMIN', team: 'Operations' },
  { name: 'Mark Stevens', email: 'mark.stevens@luptons.com', role: 'VIEWER', team: 'Operations' },
  { name: 'Nicole Adams', email: 'nicole.adams@luptons.com', role: 'VIEWER', team: 'Operations' },
];

// Company data
const COMPANIES_DATA = [
  // Manufacturers (Principals)
  { externalId: 'nvidia', name: 'NVIDIA', shortName: 'NVIDIA', type: 'MANUFACTURER', stockTicker: 'NVDA', sectors: ['datacenter'] },
  { externalId: 'intel', name: 'Intel', shortName: 'Intel', type: 'MANUFACTURER', stockTicker: 'INTC', sectors: ['datacenter'] },
  { externalId: 'amd', name: 'AMD', shortName: 'AMD', type: 'MANUFACTURER', stockTicker: 'AMD', sectors: ['datacenter'] },
  { externalId: 'vertiv', name: 'Vertiv', shortName: 'Vertiv', type: 'MANUFACTURER', stockTicker: 'VRT', sectors: ['datacenter'] },
  { externalId: 'supermicro', name: 'Super Micro Computer', shortName: 'Supermicro', type: 'MANUFACTURER', stockTicker: 'SMCI', sectors: ['datacenter'] },
  
  { externalId: 'lockheed', name: 'Lockheed Martin', shortName: 'Lockheed', type: 'MANUFACTURER', stockTicker: 'LMT', sectors: ['military-aerospace'] },
  { externalId: 'rtx', name: 'RTX Corporation', shortName: 'RTX', type: 'MANUFACTURER', stockTicker: 'RTX', sectors: ['military-aerospace'] },
  { externalId: 'northrop', name: 'Northrop Grumman', shortName: 'Northrop', type: 'MANUFACTURER', stockTicker: 'NOC', sectors: ['military-aerospace'] },
  { externalId: 'boeing', name: 'Boeing', shortName: 'Boeing', type: 'MANUFACTURER', stockTicker: 'BA', sectors: ['military-aerospace'] },
  { externalId: 'l3harris', name: 'L3Harris Technologies', shortName: 'L3Harris', type: 'MANUFACTURER', stockTicker: 'LHX', sectors: ['military-aerospace'] },
  
  { externalId: 'paccar', name: 'PACCAR', shortName: 'PACCAR', type: 'MANUFACTURER', stockTicker: 'PCAR', sectors: ['heavy-trucks'] },
  { externalId: 'daimler-truck', name: 'Daimler Truck', shortName: 'Daimler', type: 'MANUFACTURER', stockTicker: 'DTG', sectors: ['heavy-trucks'] },
  { externalId: 'volvo-trucks', name: 'Volvo Trucks', shortName: 'Volvo', type: 'MANUFACTURER', stockTicker: 'VOLV-B', sectors: ['heavy-trucks'] },
  { externalId: 'cummins', name: 'Cummins', shortName: 'Cummins', type: 'MANUFACTURER', stockTicker: 'CMI', sectors: ['heavy-trucks'] },
  
  { externalId: 'medtronic', name: 'Medtronic', shortName: 'Medtronic', type: 'MANUFACTURER', stockTicker: 'MDT', sectors: ['medical-scientific'] },
  { externalId: 'thermo-fisher', name: 'Thermo Fisher Scientific', shortName: 'Thermo Fisher', type: 'MANUFACTURER', stockTicker: 'TMO', sectors: ['medical-scientific'] },
  { externalId: 'intuitive', name: 'Intuitive Surgical', shortName: 'Intuitive', type: 'MANUFACTURER', stockTicker: 'ISRG', sectors: ['medical-scientific', 'robotics-automation'] },
  
  { externalId: 'fanuc', name: 'FANUC', shortName: 'FANUC', type: 'MANUFACTURER', stockTicker: '6954', sectors: ['robotics-automation'] },
  { externalId: 'abb', name: 'ABB', shortName: 'ABB', type: 'MANUFACTURER', stockTicker: 'ABB', sectors: ['robotics-automation'] },
  { externalId: 'rockwell', name: 'Rockwell Automation', shortName: 'Rockwell', type: 'MANUFACTURER', stockTicker: 'ROK', sectors: ['robotics-automation'] },
  { externalId: 'cognex', name: 'Cognex', shortName: 'Cognex', type: 'MANUFACTURER', stockTicker: 'CGNX', sectors: ['robotics-automation'] },
  { externalId: 'keyence', name: 'Keyence', shortName: 'Keyence', type: 'MANUFACTURER', stockTicker: '6861', sectors: ['robotics-automation'] },
  
  // Customers
  { externalId: 'amazon-aws', name: 'Amazon Web Services', shortName: 'AWS', type: 'CUSTOMER', stockTicker: 'AMZN', sectors: ['datacenter'] },
  { externalId: 'microsoft-azure', name: 'Microsoft Azure', shortName: 'Azure', type: 'CUSTOMER', stockTicker: 'MSFT', sectors: ['datacenter'] },
  { externalId: 'google-cloud', name: 'Google Cloud', shortName: 'GCP', type: 'CUSTOMER', stockTicker: 'GOOGL', sectors: ['datacenter'] },
  { externalId: 'meta', name: 'Meta Platforms', shortName: 'Meta', type: 'CUSTOMER', stockTicker: 'META', sectors: ['datacenter'] },
  
  { externalId: 'us-dod', name: 'U.S. Department of Defense', shortName: 'DoD', type: 'CUSTOMER', sectors: ['military-aerospace'] },
  { externalId: 'us-navy', name: 'U.S. Navy', shortName: 'Navy', type: 'CUSTOMER', sectors: ['military-aerospace'] },
  { externalId: 'us-airforce', name: 'U.S. Air Force', shortName: 'USAF', type: 'CUSTOMER', sectors: ['military-aerospace'] },
  
  { externalId: 'jb-hunt', name: 'J.B. Hunt Transport', shortName: 'J.B. Hunt', type: 'CUSTOMER', stockTicker: 'JBHT', sectors: ['heavy-trucks'] },
  { externalId: 'schneider', name: 'Schneider National', shortName: 'Schneider', type: 'CUSTOMER', stockTicker: 'SNDR', sectors: ['heavy-trucks'] },
  { externalId: 'werner', name: 'Werner Enterprises', shortName: 'Werner', type: 'CUSTOMER', stockTicker: 'WERN', sectors: ['heavy-trucks'] },
  
  { externalId: 'mayo-clinic', name: 'Mayo Clinic', shortName: 'Mayo', type: 'CUSTOMER', sectors: ['medical-scientific'] },
  { externalId: 'cleveland-clinic', name: 'Cleveland Clinic', shortName: 'Cleveland', type: 'CUSTOMER', sectors: ['medical-scientific'] },
  { externalId: 'johns-hopkins', name: 'Johns Hopkins Medicine', shortName: 'Hopkins', type: 'CUSTOMER', sectors: ['medical-scientific'] },
  
  { externalId: 'tesla', name: 'Tesla', shortName: 'Tesla', type: 'CUSTOMER', stockTicker: 'TSLA', sectors: ['robotics-automation'] },
  { externalId: 'gm', name: 'General Motors', shortName: 'GM', type: 'CUSTOMER', stockTicker: 'GM', sectors: ['robotics-automation'] },
  { externalId: 'ford', name: 'Ford Motor Company', shortName: 'Ford', type: 'CUSTOMER', stockTicker: 'F', sectors: ['robotics-automation'] },
];

// Team to sector mapping
const TEAM_SECTORS: Record<string, string[]> = {
  'Executive': ['datacenter', 'military-aerospace', 'heavy-trucks', 'medical-scientific', 'robotics-automation'],
  'Datacenter': ['datacenter'],
  'Military & Aerospace': ['military-aerospace'],
  'Heavy Trucks': ['heavy-trucks'],
  'Medical & Scientific': ['medical-scientific'],
  'Robotics & Automation': ['robotics-automation'],
  'Operations': ['datacenter', 'military-aerospace', 'heavy-trucks', 'medical-scientific', 'robotics-automation'],
};

async function main() {
  console.log('🌱 Starting database seed...');

  // Create teams
  console.log('Creating teams...');
  const teams: Record<string, any> = {};
  const teamNames = Array.from(new Set(LUPTON_TEAM.map(u => u.team)));
  
  for (const teamName of teamNames) {
    const teamId = teamName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const team = await prisma.team.upsert({
      where: { id: teamId },
      update: {},
      create: {
        id: teamId,
        name: teamName,
        description: `${teamName} team at Lupton Associates`,
      },
    });
    teams[teamName] = team;
  }
  console.log(`✅ Created ${Object.keys(teams).length} teams`);

  // Create users with default password
  console.log('Creating users...');
  const defaultPassword = await bcrypt.hash('lupton2026', 12);
  
  for (const userData of LUPTON_TEAM) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: defaultPassword,
        role: userData.role,
        teamId: teams[userData.team].id,
      },
    });

    // Create user preferences
    const sectors = TEAM_SECTORS[userData.team] || [];
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        emailEnabled: true,
        emailFrequency: userData.role === 'EXECUTIVE' ? 'twice-daily' : 'daily',
        emailTime: '07:00',
        minRelevanceScore: userData.role === 'EXECUTIVE' ? 70 : 60,
        pushEnabled: true,
        pushBreakingOnly: userData.role === 'VIEWER',
        alertPriorityThreshold: userData.role === 'EXECUTIVE' ? 'medium' : 'high',
        followedSectors: JSON.stringify(sectors),
        notificationCategories: JSON.stringify([
          'government-contracts',
          'mergers-acquisitions',
          'c-suite',
          'quarterly-filings',
          'new-construction',
        ]),
      },
    });

    console.log(`  ✅ Created user: ${userData.name} (${userData.email})`);
  }
  console.log(`✅ Created ${LUPTON_TEAM.length} users`);

  // Create companies
  console.log('Creating companies...');
  for (const companyData of COMPANIES_DATA) {
    await prisma.company.upsert({
      where: { externalId: companyData.externalId },
      update: {},
      create: {
        externalId: companyData.externalId,
        name: companyData.name,
        shortName: companyData.shortName,
        type: companyData.type,
        stockTicker: companyData.stockTicker,
        sectors: JSON.stringify(companyData.sectors),
        searchIdentifiers: JSON.stringify([
          companyData.name.toLowerCase(),
          companyData.shortName?.toLowerCase(),
          companyData.stockTicker?.toLowerCase(),
        ].filter(Boolean)),
      },
    });
  }
  console.log(`✅ Created ${COMPANIES_DATA.length} companies`);

  // Assign companies to users based on their team
  console.log('Assigning companies to users...');
  const users = await prisma.user.findMany({ include: { team: true } });
  const companies = await prisma.company.findMany();

  for (const user of users) {
    if (!user.team) continue;
    
    const teamSectors = TEAM_SECTORS[user.team.name] || [];
    const relevantCompanies = companies.filter(c => {
      const companySectors = JSON.parse(c.sectors || '[]');
      return companySectors.some((s: string) => teamSectors.includes(s));
    });

    // Assign first 5-10 relevant companies to each user
    const assignCount = user.role === 'EXECUTIVE' ? 10 : 5;
    for (const company of relevantCompanies.slice(0, assignCount)) {
      await prisma.userCompanyAssignment.upsert({
        where: {
          userId_companyId: {
            userId: user.id,
            companyId: company.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          companyId: company.id,
          isPrimary: relevantCompanies.indexOf(company) < 3,
        },
      });
    }
  }
  console.log('✅ Company assignments complete');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📧 Default login credentials:');
  console.log('   Email: alan@luptons.com (or any team member email)');
  console.log('   Password: lupton2026');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
