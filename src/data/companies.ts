import { Company, Sector } from '@/types';

// ============================================
// LUPTON ASSOCIATES REAL CUSTOMER & MANUFACTURER DATA
// Extracted from Sales_FY_2025.xlsx
// ============================================

// Sales Teams for notification routing
export interface SalesTeam {
  id: string;
  name: string;
  members?: string[];
  assignedCustomers: string[]; // Customer IDs
  totalVolume: number; // FY2025 sales volume
}

export const SALES_TEAMS: SalesTeam[] = [
  {
    id: 'team-john-walker',
    name: 'Team John Walker',
    assignedCustomers: ['ez-go-textron', 'club-car', 'snap-one', 'john-deere-commercial', 'john-deere-turf', 'taylor-dunn', 'navitas', 'cruise-car', 'polaris', 'tomberlin', 'star-ev', 'bintelli'],
    totalVolume: 45000000,
  },
  {
    id: 'team-jennings-harley',
    name: 'Team Jennings Harley',
    assignedCustomers: ['afl-telecommunications', 'panduit', 'molex', 'commscope'],
    totalVolume: 58000000,
  },
  {
    id: 'team-mike-laney',
    name: 'Team Mike Laney',
    assignedCustomers: ['kubota-mfg', 'howard-medical', 'briggs-stratton', 'mahindra', 'agco', 'komatsu-mining'],
    totalVolume: 18000000,
  },
  {
    id: 'team-chris-dunham',
    name: 'Team Chris Dunham',
    assignedCustomers: ['leonardo-drs', 'bluehalo', 'mercury-systems', 'aero-vironment', 'flir-teledyne', 'elbit', 'curtiss-wright'],
    totalVolume: 12000000,
  },
  {
    id: 'team-greg-johnson',
    name: 'Team Greg Johnson',
    assignedCustomers: ['northrop-grumman', 'l3harris', 'lockheed-martin', 'bae-systems', 'general-dynamics'],
    totalVolume: 9500000,
  },
  {
    id: 'team-greg-hebert',
    name: 'Team Greg Hebert',
    assignedCustomers: ['spacex', 'blue-origin', 'rocket-lab', 'astra-space'],
    totalVolume: 5500000,
  },
  {
    id: 'team-cass-roberts',
    name: 'Team Cass Roberts',
    assignedCustomers: ['john-deere-corp', 'stratacache', 'caterpillar', 'case-ih', 'ag-leader'],
    totalVolume: 8500000,
  },
  {
    id: 'team-cj-roberts',
    name: 'Team CJ Roberts',
    assignedCustomers: ['siemens-healthcare', 'werfen', 'smiths-medical', 'bd-medical'],
    totalVolume: 4200000,
  },
  {
    id: 'team-tom-osso',
    name: 'Team Tom Osso',
    assignedCustomers: ['carrier-global', 'trane-technologies', 'lennox', 'johnson-controls'],
    totalVolume: 3800000,
  },
  {
    id: 'team-luke-hinkle',
    name: 'Team Luke Hinkle',
    assignedCustomers: ['honeywell', 'emerson-electric', 'parker-hannifin', 'eaton-corp'],
    totalVolume: 4500000,
  },
  {
    id: 'team-bobby-ramirez',
    name: 'Team Bobby Ramirez',
    assignedCustomers: ['daikin-industries', 'mitsubishi-electric', 'panasonic-industrial', 'yaskawa'],
    totalVolume: 2800000,
  },
];

// ============================================
// MANUFACTURERS / PRINCIPALS (37 Total)
// These are companies Lupton Associates represents
// ============================================

export const MANUFACTURERS: Company[] = [
  // Precision Manufacturing
  {
    id: 'acdi-md',
    name: 'ACDI MD',
    type: 'manufacturer',
    sectors: ['medical-scientific', 'robotics-automation'],
    description: 'Precision medical device components',
    isActive: true,
    searchIdentifiers: ['ACDI', 'ACDI Medical', 'ACDI MD LLC'],
  },
  {
    id: 'ames-rubber',
    name: 'Ames Rubber Corporation',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'medical-scientific'],
    description: 'Precision rubber components and rollers',
    headquarters: 'Hamburg, NJ',
    isActive: true,
    searchIdentifiers: ['Ames Rubber', 'Ames Rubber Corp'],
  },
  {
    id: 'armstrong-rm',
    name: 'Armstrong RM',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Rubber and molded components',
    isActive: true,
    searchIdentifiers: ['Armstrong Rubber', 'Armstrong RM LLC'],
  },
  {
    id: 'aspen-systems',
    name: 'Aspen Systems Inc',
    type: 'manufacturer',
    sectors: ['datacenter', 'medical-scientific'],
    description: 'Thermal management and cooling solutions',
    headquarters: 'Marlborough, MA',
    isActive: true,
    searchIdentifiers: ['Aspen Systems', 'Aspen Thermal'],
  },
  {
    id: 'astron-stamping',
    name: 'Astron Stamping Corporation',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation', 'military-aerospace'],
    description: 'Metal stamping and precision components',
    isActive: true,
    searchIdentifiers: ['Astron Stamping', 'Astron Metal'],
  },
  {
    id: 'b-r-machining',
    name: 'B&R Machining & Fabrication',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'military-aerospace'],
    description: 'Precision machining and metal fabrication',
    isActive: true,
    searchIdentifiers: ['B&R Machining', 'B and R Machining', 'B&R Fab'],
  },
  {
    id: 'bardane',
    name: 'Bardane Manufacturing',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'heavy-trucks'],
    description: 'Custom machined components',
    isActive: true,
    searchIdentifiers: ['Bardane', 'Bardane Mfg'],
  },
  {
    id: 'bo-mer',
    name: 'Bo-Mer Plastics',
    type: 'manufacturer',
    sectors: ['medical-scientific', 'robotics-automation'],
    description: 'Injection molded plastics',
    isActive: true,
    searchIdentifiers: ['Bo-Mer', 'BoMer', 'Bo Mer Plastics'],
  },
  {
    id: 'britech-allentown',
    name: 'Britech Allentown',
    type: 'manufacturer',
    sectors: ['datacenter', 'robotics-automation'],
    description: 'Electronics manufacturing services',
    headquarters: 'Allentown, PA',
    isActive: true,
    searchIdentifiers: ['Britech', 'Britech EMS', 'Britech Allentown PA'],
  },
  {
    id: 'c-m-precision',
    name: 'C&M Precision Tech',
    type: 'manufacturer',
    sectors: ['military-aerospace', 'medical-scientific'],
    description: 'Precision machined aerospace components',
    isActive: true,
    searchIdentifiers: ['C&M Precision', 'C and M Precision', 'CM Precision'],
  },
  {
    id: 'cardinal-metalworks',
    name: 'Cardinal Metalworks',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Custom metal fabrication and assemblies',
    isActive: true,
    searchIdentifiers: ['Cardinal Metal', 'Cardinal Metalworks LLC'],
  },
  {
    id: 'clayens-parkway',
    name: 'Clayens (Parkway Products)',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'medical-scientific', 'datacenter'],
    description: 'Injection molded plastic components',
    isActive: true,
    searchIdentifiers: ['Clayens', 'Parkway Products', 'Clayens NP'],
  },
  {
    id: 'clow-stamping',
    name: 'Clow Stamping Company',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Metal stamping and progressive die manufacturing',
    isActive: true,
    searchIdentifiers: ['Clow Stamping', 'Clow Stamp'],
  },
  {
    id: 'commercial-plastics-mora',
    name: 'Commercial Plastics Mora',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'heavy-trucks'],
    description: 'Custom thermoforming and plastics',
    headquarters: 'Mora, MN',
    isActive: true,
    searchIdentifiers: ['Commercial Plastics', 'Commercial Plastics MN', 'CP Mora'],
  },
  {
    id: 'custom-profile-mi',
    name: 'Custom Profile Michigan',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Custom extrusions and profiles',
    headquarters: 'Michigan',
    isActive: true,
    searchIdentifiers: ['Custom Profile', 'Custom Profile MI', 'CPM Michigan'],
  },
  {
    id: 'dynamic-plastics',
    name: 'Dynamic Plastics Inc',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'medical-scientific'],
    description: 'Custom injection molding',
    isActive: true,
    searchIdentifiers: ['Dynamic Plastics', 'Dynamic Plastics Inc'],
  },
  {
    id: 'engent',
    name: 'Engent Inc',
    type: 'manufacturer',
    sectors: ['datacenter', 'robotics-automation'],
    description: 'Cable assemblies and wire harnesses',
    isActive: true,
    searchIdentifiers: ['Engent', 'Engent Cable', 'Engent Inc'],
  },
  {
    id: 'fes-sourcing',
    name: 'FES Sourcing',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation', 'military-aerospace'],
    description: 'Global sourcing and supply chain solutions',
    isActive: true,
    searchIdentifiers: ['FES Sourcing', 'FES Supply', 'FES'],
  },
  {
    id: 'hydrotube-enterprises',
    name: 'HydroTube Enterprises',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'military-aerospace'],
    description: 'Hydraulic tubing and assemblies',
    isActive: true,
    searchIdentifiers: ['HydroTube', 'Hydro Tube', 'HydroTube Enterprises'],
  },
  {
    id: 'ica-south',
    name: 'ICA South',
    type: 'manufacturer',
    sectors: ['datacenter', 'robotics-automation'],
    description: 'Electronics assembly and cable solutions',
    isActive: true,
    searchIdentifiers: ['ICA South', 'ICA Electronics', 'ICA'],
  },
  {
    id: 'innovative-packaging-ips',
    name: 'Innovative Packaging Solutions (IPS)',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'Custom packaging solutions',
    isActive: true,
    searchIdentifiers: ['Innovative Packaging', 'IPS Packaging', 'IPS'],
  },
  {
    id: 'jmc-tool',
    name: 'JMC Tool & Machine',
    type: 'manufacturer',
    sectors: ['military-aerospace', 'medical-scientific'],
    description: 'Precision CNC machining and tooling',
    isActive: true,
    searchIdentifiers: ['JMC Tool', 'JMC Machine', 'JMC Tool and Machine'],
  },
  {
    id: 'kepro',
    name: 'Kepro Circuit Systems',
    type: 'manufacturer',
    sectors: ['datacenter', 'robotics-automation', 'military-aerospace'],
    description: 'PCB prototyping and circuit systems',
    isActive: true,
    searchIdentifiers: ['Kepro', 'Kepro Circuit', 'Kepro PCB'],
  },
  {
    id: 'mfg-resource-group',
    name: 'Manufacturing Resource Group',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Contract manufacturing and assemblies',
    isActive: true,
    searchIdentifiers: ['Manufacturing Resource Group', 'MRG', 'MRG Manufacturing'],
  },
  {
    id: 'mcpherson-mfg',
    name: 'McPherson Manufacturing',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Metal fabrication and assemblies',
    isActive: true,
    searchIdentifiers: ['McPherson Manufacturing', 'McPherson Mfg', 'McPherson'],
  },
  {
    id: 'miller-metal-fab',
    name: 'Miller Metal Fabrication',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'military-aerospace'],
    description: 'Sheet metal fabrication and welding',
    isActive: true,
    searchIdentifiers: ['Miller Metal', 'Miller Metal Fab', 'Miller Fabrication'],
  },
  {
    id: 'offshore-molds',
    name: 'Offshore Molds Inc',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'heavy-trucks'],
    description: 'Injection molds and tooling',
    isActive: true,
    searchIdentifiers: ['Offshore Molds', 'Offshore Molds Inc'],
  },
  {
    id: 'pci-procoaters',
    name: 'PCI Procoaters',
    type: 'manufacturer',
    sectors: ['military-aerospace', 'robotics-automation'],
    description: 'Conformal coatings and surface treatments',
    isActive: true,
    searchIdentifiers: ['PCI Procoaters', 'PCI Coatings', 'Procoaters'],
  },
  {
    id: 'pgm',
    name: 'PGM Manufacturing',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Precision ground manufacturing',
    isActive: true,
    searchIdentifiers: ['PGM', 'PGM Manufacturing', 'PGM Mfg'],
  },
  {
    id: 'protac-industries',
    name: 'Protac Industries',
    type: 'manufacturer',
    sectors: ['military-aerospace', 'heavy-trucks'],
    description: 'Tactical and protective components',
    isActive: true,
    searchIdentifiers: ['Protac', 'Protac Industries', 'ProTac'],
  },
  {
    id: 'suspa',
    name: 'SUSPA Inc',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation', 'medical-scientific'],
    description: 'Gas springs, dampers, and hydraulic components',
    headquarters: 'Grand Rapids, MI',
    isActive: true,
    searchIdentifiers: ['SUSPA', 'SUSPA Inc', 'SUSPA Gas Springs'],
  },
  {
    id: 'tlf-graphics',
    name: 'TLF Graphics',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Graphic overlays, labels, and membrane switches',
    isActive: true,
    searchIdentifiers: ['TLF Graphics', 'TLF', 'TLF Labels'],
  },
  {
    id: 'tongrun-intl-bonham',
    name: 'Tongrun International Bonham',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Precision machined components',
    headquarters: 'Bonham, TX',
    isActive: true,
    searchIdentifiers: ['Tongrun', 'Tongrun International', 'Tongrun Bonham'],
  },
  {
    id: 'trident-precision',
    name: 'Trident Precision Manufacturing',
    type: 'manufacturer',
    sectors: ['military-aerospace', 'medical-scientific'],
    description: 'Precision machining for defense and medical',
    isActive: true,
    searchIdentifiers: ['Trident Precision', 'Trident Mfg', 'Trident Manufacturing'],
  },
  {
    id: 'usa-sealing',
    name: 'USA Sealing',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Seals, gaskets, and O-rings',
    isActive: true,
    searchIdentifiers: ['USA Sealing', 'USA Seals', 'US Sealing'],
  },
  {
    id: 'ultrafab',
    name: 'Ultrafab Inc',
    type: 'manufacturer',
    sectors: ['robotics-automation', 'heavy-trucks'],
    description: 'Weatherstripping and sealing systems',
    isActive: true,
    searchIdentifiers: ['Ultrafab', 'Ultrafab Inc', 'Ultra Fab'],
  },
  {
    id: 'whitehead-diecast',
    name: 'Whitehead Die Castings',
    type: 'manufacturer',
    sectors: ['heavy-trucks', 'robotics-automation', 'military-aerospace'],
    description: 'Aluminum and zinc die castings',
    isActive: true,
    searchIdentifiers: ['Whitehead Die', 'Whitehead Die Castings', 'Whitehead Castings'],
  },
];

// ============================================
// CUSTOMERS (Top ~80 by volume + Key Accounts)
// With proper disambiguation to avoid matching wrong companies
// ============================================

export const CUSTOMERS: Company[] = [
  // Datacenter & Telecommunications
  {
    id: 'afl-telecommunications',
    name: 'AFL Telecommunications',
    ticker: 'FUJI.T', // Subsidiary of Fujikura
    type: 'customer',
    sectors: ['datacenter'],
    description: 'Fiber optic cables, connectivity, and apparatus for telecom and enterprise networks',
    headquarters: 'Duncan, SC',
    isActive: true,
    assignedTo: ['team-jennings-harley'],
    searchIdentifiers: ['AFL', 'AFL Telecom', 'AFL Duncan', 'AFL Telecommunications LLC', 'AFL Global'],
    parentCompany: 'Fujikura Ltd',
    parentTicker: 'FUJI.T',
  },
  {
    id: 'panduit',
    name: 'Panduit Corporation',
    type: 'customer',
    sectors: ['datacenter'],
    description: 'Network infrastructure and electrical solutions',
    headquarters: 'Tinley Park, IL',
    isActive: true,
    assignedTo: ['team-jennings-harley'],
    searchIdentifiers: ['Panduit', 'Panduit Corp', 'Panduit Tinley Park'],
  },
  {
    id: 'snap-one',
    name: 'Snap One Holdings Corp',
    ticker: 'SNPO',
    type: 'customer',
    sectors: ['datacenter', 'robotics-automation'],
    description: 'Smart home technology and AV distribution',
    headquarters: 'Charlotte, NC',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Snap One', 'SnapOne', 'Snap One Holdings', 'Control4', 'OvrC'],
  },
  {
    id: 'stratacache',
    name: 'STRATACACHE',
    type: 'customer',
    sectors: ['datacenter', 'robotics-automation'],
    description: 'Digital signage and content delivery networks',
    headquarters: 'Dayton, OH',
    isActive: true,
    assignedTo: ['team-cass-roberts'],
    searchIdentifiers: ['STRATACACHE', 'Strata Cache', 'STRATACACHE Inc', 'STRATACACHE Dayton'],
  },
  {
    id: 'commscope',
    name: 'CommScope Holding Company',
    ticker: 'COMM',
    type: 'customer',
    sectors: ['datacenter'],
    description: 'Network infrastructure solutions for communications networks',
    headquarters: 'Hickory, NC',
    isActive: true,
    assignedTo: ['team-jennings-harley'],
    searchIdentifiers: ['CommScope', 'Comm Scope', 'CommScope Inc', 'CommScope Holdings'],
  },

  // Electric/Utility Vehicles - E-Z-GO / Textron
  {
    id: 'ez-go-textron',
    name: 'E-Z-GO Division of Textron',
    ticker: 'TXT',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Golf cars, personal transportation vehicles, and utility vehicles',
    headquarters: 'Fort Worth, TX',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['E-Z-GO', 'EZGO', 'EZ GO', 'E-Z-GO Textron', 'Textron E-Z-GO', 'EZGO Fort Worth'],
    parentCompany: 'Textron Inc',
    parentTicker: 'TXT',
  },
  {
    id: 'club-car',
    name: 'Club Car LLC',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Golf cars and utility vehicles',
    headquarters: 'Augusta, GA',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Club Car', 'ClubCar', 'Club Car Augusta', 'Club Car LLC', 'Club Car Vehicles'],
    parentCompany: 'Platinum Equity',
  },
  {
    id: 'polaris',
    name: 'Polaris Inc',
    ticker: 'PII',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Powersports vehicles including ATVs, side-by-sides, and electric vehicles',
    headquarters: 'Medina, MN',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Polaris', 'Polaris Industries', 'Polaris Inc', 'Polaris Medina', 'GEM Electric', 'Taylor-Dunn Polaris'],
  },
  {
    id: 'taylor-dunn',
    name: 'Taylor-Dunn Manufacturing',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Industrial electric vehicles and burden carriers',
    headquarters: 'Anaheim, CA',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Taylor-Dunn', 'Taylor Dunn', 'TaylorDunn'],
    parentCompany: 'Polaris Inc',
    parentTicker: 'PII',
  },
  {
    id: 'navitas',
    name: 'Navitas Vehicle Systems',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Electric vehicle drivetrain systems and controllers',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Navitas', 'Navitas Vehicle', 'Navitas Systems', 'Navitas EV'],
  },
  {
    id: 'cruise-car',
    name: 'Cruise Car Inc',
    type: 'customer',
    sectors: ['heavy-trucks'],
    description: 'Low speed electric vehicles and custom utility vehicles',
    headquarters: 'Sarasota, FL',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Cruise Car', 'CruiseCar', 'Cruise Car Inc', 'Cruise Car Sarasota'],
  },
  {
    id: 'tomberlin',
    name: 'Tomberlin Automotive Group',
    type: 'customer',
    sectors: ['heavy-trucks'],
    description: 'Low speed electric vehicles',
    headquarters: 'Evans, GA',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Tomberlin', 'Tomberlin Automotive', 'Tomberlin LSV', 'Tomberlin Evans'],
  },
  {
    id: 'star-ev',
    name: 'Star EV Corporation',
    type: 'customer',
    sectors: ['heavy-trucks'],
    description: 'Electric vehicles and golf carts',
    headquarters: 'Simpsonville, SC',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Star EV', 'StarEV', 'Star Electric Vehicles', 'Star EV Corp'],
  },
  {
    id: 'bintelli',
    name: 'Bintelli Electric Vehicles',
    type: 'customer',
    sectors: ['heavy-trucks'],
    description: 'Electric golf carts and LSVs',
    headquarters: 'Charleston, SC',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['Bintelli', 'Bintelli EV', 'Bintelli Electric', 'Bintelli Charleston'],
  },

  // Agriculture & Heavy Equipment
  {
    id: 'kubota-mfg',
    name: 'Kubota Manufacturing of America',
    ticker: '6326.T',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Tractors, construction equipment, and mowers',
    headquarters: 'Gainesville, GA',
    isActive: true,
    assignedTo: ['team-mike-laney'],
    searchIdentifiers: ['Kubota', 'Kubota Manufacturing', 'Kubota America', 'Kubota Gainesville', 'Kubota Tractor'],
    parentCompany: 'Kubota Corporation',
    parentTicker: '6326.T',
  },
  {
    id: 'john-deere-corp',
    name: 'John Deere Corporation',
    ticker: 'DE',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Agricultural, construction, and forestry machinery',
    headquarters: 'Moline, IL',
    isActive: true,
    assignedTo: ['team-cass-roberts'],
    searchIdentifiers: ['John Deere', 'Deere & Company', 'Deere Corp', 'JD Moline', 'John Deere Moline'],
  },
  {
    id: 'john-deere-commercial',
    name: 'John Deere Commercial Products',
    ticker: 'DE',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Commercial and consumer equipment division',
    headquarters: 'Grovetown, GA',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['John Deere Commercial', 'JD Commercial', 'John Deere Grovetown', 'Deere Commercial'],
    parentCompany: 'Deere & Company',
    parentTicker: 'DE',
  },
  {
    id: 'john-deere-turf',
    name: 'John Deere Turf Care',
    ticker: 'DE',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Turf care and golf course equipment',
    headquarters: 'Fuquay-Varina, NC',
    isActive: true,
    assignedTo: ['team-john-walker'],
    searchIdentifiers: ['John Deere Turf', 'JD Turf Care', 'John Deere Fuquay', 'Deere Turf'],
    parentCompany: 'Deere & Company',
    parentTicker: 'DE',
  },
  {
    id: 'agco',
    name: 'AGCO Corporation',
    ticker: 'AGCO',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Agricultural equipment manufacturer (Massey Ferguson, Fendt, Challenger)',
    headquarters: 'Duluth, GA',
    isActive: true,
    assignedTo: ['team-mike-laney'],
    searchIdentifiers: ['AGCO', 'AGCO Corp', 'Massey Ferguson', 'Fendt', 'Challenger', 'AGCO Duluth'],
  },
  {
    id: 'mahindra',
    name: 'Mahindra USA',
    type: 'customer',
    sectors: ['heavy-trucks'],
    description: 'Tractors and utility vehicles',
    headquarters: 'Houston, TX',
    isActive: true,
    assignedTo: ['team-mike-laney'],
    searchIdentifiers: ['Mahindra', 'Mahindra USA', 'Mahindra Tractors', 'Mahindra Ag'],
    parentCompany: 'Mahindra Group',
  },
  {
    id: 'briggs-stratton',
    name: 'Briggs & Stratton',
    ticker: 'BGG',
    type: 'customer',
    sectors: ['heavy-trucks', 'robotics-automation'],
    description: 'Small engines and outdoor power equipment',
    headquarters: 'Wauwatosa, WI',
    isActive: true,
    assignedTo: ['team-mike-laney'],
    searchIdentifiers: ['Briggs & Stratton', 'Briggs Stratton', 'B&S Engines', 'Briggs Wauwatosa'],
  },
  {
    id: 'caterpillar',
    name: 'Caterpillar Inc',
    ticker: 'CAT',
    type: 'customer',
    sectors: ['heavy-trucks', 'military-aerospace'],
    description: 'Construction and mining equipment, diesel engines',
    headquarters: 'Irving, TX',
    isActive: true,
    assignedTo: ['team-cass-roberts'],
    searchIdentifiers: ['Caterpillar', 'CAT', 'Cat Inc', 'Caterpillar Inc', 'Caterpillar Irving'],
  },
  {
    id: 'komatsu-mining',
    name: 'Komatsu Mining Corp',
    ticker: '6301.T',
    type: 'customer',
    sectors: ['heavy-trucks'],
    description: 'Mining and construction equipment',
    headquarters: 'Milwaukee, WI',
    isActive: true,
    assignedTo: ['team-mike-laney'],
    searchIdentifiers: ['Komatsu', 'Komatsu Mining', 'Komatsu America', 'Joy Global'],
    parentCompany: 'Komatsu Ltd',
    parentTicker: '6301.T',
  },

  // Medical & Healthcare
  {
    id: 'howard-medical',
    name: 'Howard Medical Company',
    type: 'customer',
    sectors: ['medical-scientific'],
    description: 'Medical furniture, carts, and healthcare equipment',
    headquarters: 'Ellisville, MS',
    isActive: true,
    assignedTo: ['team-mike-laney'],
    searchIdentifiers: ['Howard Medical', 'Howard Medical Company', 'Howard Medical Ellisville', 'Howard Med'],
  },
  {
    id: 'siemens-healthcare',
    name: 'Siemens Healthineers',
    ticker: 'SHL.DE',
    type: 'customer',
    sectors: ['medical-scientific'],
    description: 'Medical imaging, laboratory diagnostics, and point-of-care testing',
    headquarters: 'Malvern, PA',
    isActive: true,
    assignedTo: ['team-cj-roberts'],
    searchIdentifiers: ['Siemens Healthineers', 'Siemens Healthcare', 'Siemens Medical', 'Siemens Malvern'],
    parentCompany: 'Siemens AG',
    parentTicker: 'SIE.DE',
  },
  {
    id: 'werfen',
    name: 'Werfen',
    type: 'customer',
    sectors: ['medical-scientific'],
    description: 'In-vitro diagnostics and hemostasis',
    headquarters: 'Bedford, MA',
    isActive: true,
    assignedTo: ['team-cj-roberts'],
    searchIdentifiers: ['Werfen', 'Instrumentation Laboratory', 'IL Diagnostics', 'Werfen Bedford'],
  },
  {
    id: 'smiths-medical',
    name: 'Smiths Medical',
    type: 'customer',
    sectors: ['medical-scientific'],
    description: 'Medical devices for infusion, vascular access, and vital care',
    headquarters: 'Minneapolis, MN',
    isActive: true,
    assignedTo: ['team-cj-roberts'],
    searchIdentifiers: ['Smiths Medical', 'Smiths Med', 'Smiths Group Medical', 'Smiths Minneapolis'],
    parentCompany: 'ICU Medical Inc',
    parentTicker: 'ICUI',
  },
  {
    id: 'bd-medical',
    name: 'Becton Dickinson',
    ticker: 'BDX',
    type: 'customer',
    sectors: ['medical-scientific'],
    description: 'Medical technology, devices, and laboratory equipment',
    headquarters: 'Franklin Lakes, NJ',
    isActive: true,
    assignedTo: ['team-cj-roberts'],
    searchIdentifiers: ['BD', 'Becton Dickinson', 'BD Medical', 'BD Franklin Lakes'],
  },

  // Defense & Aerospace
  {
    id: 'northrop-grumman',
    name: 'Northrop Grumman Corporation',
    ticker: 'NOC',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Aerospace and defense technology systems',
    headquarters: 'Falls Church, VA',
    isActive: true,
    assignedTo: ['team-greg-johnson'],
    searchIdentifiers: ['Northrop Grumman', 'Northrop', 'NOC', 'NGC', 'Northrop Falls Church'],
  },
  {
    id: 'l3harris',
    name: 'L3Harris Technologies',
    ticker: 'LHX',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Defense electronics, communication systems, and avionics',
    headquarters: 'Melbourne, FL',
    isActive: true,
    assignedTo: ['team-greg-johnson'],
    searchIdentifiers: ['L3Harris', 'L3 Harris', 'LHX', 'L3Harris Melbourne', 'Harris Corp'],
  },
  {
    id: 'lockheed-martin',
    name: 'Lockheed Martin Corporation',
    ticker: 'LMT',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Aerospace, defense, arms, security, and advanced technologies',
    headquarters: 'Bethesda, MD',
    isActive: true,
    assignedTo: ['team-greg-johnson'],
    searchIdentifiers: ['Lockheed Martin', 'Lockheed', 'LMT', 'LM Aero', 'Lockheed Bethesda'],
  },
  {
    id: 'spacex',
    name: 'Space Exploration Technologies Corp',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Space launch services, spacecraft, and satellite internet',
    headquarters: 'Hawthorne, CA',
    isActive: true,
    assignedTo: ['team-greg-hebert'],
    searchIdentifiers: ['SpaceX', 'Space X', 'Space Exploration Technologies', 'SpaceX Hawthorne', 'Starlink'],
  },
  {
    id: 'leonardo-drs',
    name: 'Leonardo DRS',
    ticker: 'DRS',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Defense electronics and sensing systems',
    headquarters: 'Arlington, VA',
    isActive: true,
    assignedTo: ['team-chris-dunham'],
    searchIdentifiers: ['Leonardo DRS', 'DRS Technologies', 'DRS Defense', 'Leonardo Defense', 'DRS Arlington'],
    parentCompany: 'Leonardo S.p.A.',
    parentTicker: 'LDO.MI',
  },
  {
    id: 'bluehalo',
    name: 'BlueHalo',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Defense technology including directed energy and space systems',
    headquarters: 'Arlington, VA',
    isActive: true,
    assignedTo: ['team-chris-dunham'],
    searchIdentifiers: ['BlueHalo', 'Blue Halo', 'BlueHalo LLC', 'AEgis Technologies'],
  },
  {
    id: 'mercury-systems',
    name: 'Mercury Systems',
    ticker: 'MRCY',
    type: 'customer',
    sectors: ['military-aerospace', 'datacenter'],
    description: 'Secure processing subsystems for defense and intelligence',
    headquarters: 'Andover, MA',
    isActive: true,
    assignedTo: ['team-chris-dunham'],
    searchIdentifiers: ['Mercury Systems', 'Mercury Defense', 'MRCY', 'Mercury Andover'],
  },
  {
    id: 'aero-vironment',
    name: 'AeroVironment Inc',
    ticker: 'AVAV',
    type: 'customer',
    sectors: ['military-aerospace', 'robotics-automation'],
    description: 'Unmanned aircraft systems and tactical missile systems',
    headquarters: 'Arlington, VA',
    isActive: true,
    assignedTo: ['team-chris-dunham'],
    searchIdentifiers: ['AeroVironment', 'Aero Vironment', 'AVAV', 'AV Drones', 'Switchblade'],
  },
  {
    id: 'flir-teledyne',
    name: 'Teledyne FLIR',
    ticker: 'TDY',
    type: 'customer',
    sectors: ['military-aerospace', 'robotics-automation'],
    description: 'Thermal imaging and sensing technologies',
    headquarters: 'Wilsonville, OR',
    isActive: true,
    assignedTo: ['team-chris-dunham'],
    searchIdentifiers: ['FLIR', 'Teledyne FLIR', 'FLIR Systems', 'Teledyne Thermal'],
    parentCompany: 'Teledyne Technologies',
    parentTicker: 'TDY',
  },
  {
    id: 'elbit',
    name: 'Elbit Systems of America',
    ticker: 'ESLT.TA',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Defense electronics, C4ISR, and unmanned systems',
    headquarters: 'Fort Worth, TX',
    isActive: true,
    assignedTo: ['team-chris-dunham'],
    searchIdentifiers: ['Elbit', 'Elbit Systems', 'Elbit America', 'Elbit Fort Worth'],
    parentCompany: 'Elbit Systems Ltd',
    parentTicker: 'ESLT.TA',
  },
  {
    id: 'curtiss-wright',
    name: 'Curtiss-Wright Corporation',
    ticker: 'CW',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Engineered components for aerospace and defense',
    headquarters: 'Davidson, NC',
    isActive: true,
    assignedTo: ['team-chris-dunham'],
    searchIdentifiers: ['Curtiss-Wright', 'Curtiss Wright', 'CW Corp', 'Curtiss Davidson'],
  },
  {
    id: 'bae-systems',
    name: 'BAE Systems Inc',
    ticker: 'BA.L',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Defense, aerospace, and security solutions',
    headquarters: 'Falls Church, VA',
    isActive: true,
    assignedTo: ['team-greg-johnson'],
    searchIdentifiers: ['BAE Systems', 'BAE', 'BAE Inc', 'BAE America', 'BAE Falls Church'],
    parentCompany: 'BAE Systems plc',
    parentTicker: 'BA.L',
  },
  {
    id: 'general-dynamics',
    name: 'General Dynamics Corporation',
    ticker: 'GD',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Aerospace and defense conglomerate',
    headquarters: 'Reston, VA',
    isActive: true,
    assignedTo: ['team-greg-johnson'],
    searchIdentifiers: ['General Dynamics', 'GD', 'GD Corp', 'GDIT', 'General Dynamics Reston'],
  },
  {
    id: 'blue-origin',
    name: 'Blue Origin LLC',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Space launch vehicles and propulsion systems',
    headquarters: 'Kent, WA',
    isActive: true,
    assignedTo: ['team-greg-hebert'],
    searchIdentifiers: ['Blue Origin', 'BlueOrigin', 'Blue Origin Kent', 'New Shepard', 'New Glenn'],
  },
  {
    id: 'rocket-lab',
    name: 'Rocket Lab USA',
    ticker: 'RKLB',
    type: 'customer',
    sectors: ['military-aerospace'],
    description: 'Small satellite launch services and spacecraft',
    headquarters: 'Long Beach, CA',
    isActive: true,
    assignedTo: ['team-greg-hebert'],
    searchIdentifiers: ['Rocket Lab', 'RocketLab', 'RKLB', 'Electron Rocket', 'Neutron'],
  },

  // Industrial & HVAC
  {
    id: 'carrier-global',
    name: 'Carrier Global Corporation',
    ticker: 'CARR',
    type: 'customer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'HVAC, refrigeration, fire, and security solutions',
    headquarters: 'Palm Beach Gardens, FL',
    isActive: true,
    assignedTo: ['team-tom-osso'],
    searchIdentifiers: ['Carrier', 'Carrier Global', 'Carrier HVAC', 'Carrier Palm Beach'],
  },
  {
    id: 'trane-technologies',
    name: 'Trane Technologies',
    ticker: 'TT',
    type: 'customer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'HVAC and refrigeration solutions',
    headquarters: 'Davidson, NC',
    isActive: true,
    assignedTo: ['team-tom-osso'],
    searchIdentifiers: ['Trane', 'Trane Technologies', 'Ingersoll Rand Climate', 'Trane Davidson'],
  },
  {
    id: 'lennox',
    name: 'Lennox International',
    ticker: 'LII',
    type: 'customer',
    sectors: ['robotics-automation'],
    description: 'Heating, ventilation, and air conditioning',
    headquarters: 'Richardson, TX',
    isActive: true,
    assignedTo: ['team-tom-osso'],
    searchIdentifiers: ['Lennox', 'Lennox International', 'Lennox HVAC', 'Lennox Richardson'],
  },
  {
    id: 'johnson-controls',
    name: 'Johnson Controls International',
    ticker: 'JCI',
    type: 'customer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'Building automation, HVAC, and fire safety',
    headquarters: 'Cork, Ireland',
    isActive: true,
    assignedTo: ['team-tom-osso'],
    searchIdentifiers: ['Johnson Controls', 'JCI', 'Johnson Controls Intl', 'Tyco'],
  },
  {
    id: 'honeywell',
    name: 'Honeywell International',
    ticker: 'HON',
    type: 'customer',
    sectors: ['robotics-automation', 'military-aerospace'],
    description: 'Aerospace, building technologies, and industrial automation',
    headquarters: 'Charlotte, NC',
    isActive: true,
    assignedTo: ['team-luke-hinkle'],
    searchIdentifiers: ['Honeywell', 'HON', 'Honeywell Intl', 'Honeywell Charlotte', 'Honeywell Aerospace'],
  },
  {
    id: 'emerson-electric',
    name: 'Emerson Electric Co',
    ticker: 'EMR',
    type: 'customer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'Industrial automation and commercial solutions',
    headquarters: 'St. Louis, MO',
    isActive: true,
    assignedTo: ['team-luke-hinkle'],
    searchIdentifiers: ['Emerson', 'Emerson Electric', 'EMR', 'Emerson St Louis'],
  },
  {
    id: 'parker-hannifin',
    name: 'Parker Hannifin Corporation',
    ticker: 'PH',
    type: 'customer',
    sectors: ['robotics-automation', 'military-aerospace'],
    description: 'Motion and control technologies',
    headquarters: 'Cleveland, OH',
    isActive: true,
    assignedTo: ['team-luke-hinkle'],
    searchIdentifiers: ['Parker Hannifin', 'Parker', 'PH Corp', 'Parker Cleveland'],
  },
  {
    id: 'eaton-corp',
    name: 'Eaton Corporation',
    ticker: 'ETN',
    type: 'customer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'Power management and electrical components',
    headquarters: 'Dublin, Ireland',
    isActive: true,
    assignedTo: ['team-luke-hinkle'],
    searchIdentifiers: ['Eaton', 'Eaton Corp', 'ETN', 'Eaton Electrical', 'Eaton Power'],
  },
  {
    id: 'daikin-industries',
    name: 'Daikin Industries',
    ticker: '6367.T',
    type: 'customer',
    sectors: ['robotics-automation'],
    description: 'HVAC and refrigeration manufacturer',
    headquarters: 'Osaka, Japan',
    isActive: true,
    assignedTo: ['team-bobby-ramirez'],
    searchIdentifiers: ['Daikin', 'Daikin Industries', 'Daikin HVAC', 'Daikin America'],
  },
  {
    id: 'mitsubishi-electric',
    name: 'Mitsubishi Electric Corporation',
    ticker: '6503.T',
    type: 'customer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'Electrical and electronic equipment manufacturer',
    headquarters: 'Tokyo, Japan',
    isActive: true,
    assignedTo: ['team-bobby-ramirez'],
    searchIdentifiers: ['Mitsubishi Electric', 'MELCO', 'Mitsubishi HVAC', 'Mitsubishi Automation'],
  },
  {
    id: 'panasonic-industrial',
    name: 'Panasonic Industrial Devices',
    ticker: '6752.T',
    type: 'customer',
    sectors: ['robotics-automation', 'datacenter'],
    description: 'Industrial electronic components and systems',
    isActive: true,
    assignedTo: ['team-bobby-ramirez'],
    searchIdentifiers: ['Panasonic Industrial', 'Panasonic Devices', 'Panasonic ID', 'PIDS'],
    parentCompany: 'Panasonic Holdings',
    parentTicker: '6752.T',
  },
  {
    id: 'yaskawa',
    name: 'Yaskawa America',
    ticker: '6506.T',
    type: 'customer',
    sectors: ['robotics-automation'],
    description: 'Industrial robots, motion control, and drives',
    headquarters: 'Waukegan, IL',
    isActive: true,
    assignedTo: ['team-bobby-ramirez'],
    searchIdentifiers: ['Yaskawa', 'Yaskawa America', 'Yaskawa Motoman', 'Yaskawa Waukegan'],
    parentCompany: 'Yaskawa Electric Corporation',
    parentTicker: '6506.T',
  },
];

// Combined COMPANIES array for backward compatibility
export const COMPANIES: Company[] = [...MANUFACTURERS, ...CUSTOMERS];

// ============================================
// HELPER FUNCTIONS WITH DISAMBIGUATION
// ============================================

/**
 * Get companies by sector
 */
export function getCompaniesBySector(sector: Sector): Company[] {
  return COMPANIES.filter(c => c.sectors.includes(sector) && c.isActive);
}

/**
 * Get company by ID
 */
export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find(c => c.id === id);
}

/**
 * Get companies by type
 */
export function getCompaniesByType(type: Company['type']): Company[] {
  return COMPANIES.filter(c => c.type === type && c.isActive);
}

/**
 * Get all company tickers for stock tracking
 */
export function getCompanyTickers(): string[] {
  return COMPANIES
    .filter(c => c.ticker && c.isActive)
    .map(c => c.ticker as string);
}

/**
 * Search companies with disambiguation support
 * This prevents matching wrong companies with similar names
 */
export function searchCompanies(query: string): Company[] {
  const lowerQuery = query.toLowerCase();
  return COMPANIES.filter(c => {
    // Check primary fields
    if (c.name.toLowerCase().includes(lowerQuery)) return true;
    if (c.ticker?.toLowerCase().includes(lowerQuery)) return true;
    if (c.description?.toLowerCase().includes(lowerQuery)) return true;

    // Check search identifiers for better matching
    if (c.searchIdentifiers?.some(id => id.toLowerCase().includes(lowerQuery))) return true;

    return false;
  });
}

/**
 * Find company by any identifier (name, ticker, search identifiers)
 * Uses disambiguation logic to find the correct company
 */
export function findCompanyByIdentifier(identifier: string): Company | undefined {
  const lowerIdentifier = identifier.toLowerCase().trim();

  // Exact matches first (highest confidence)
  const exactMatch = COMPANIES.find(c =>
    c.name.toLowerCase() === lowerIdentifier ||
    c.ticker?.toLowerCase() === lowerIdentifier ||
    c.searchIdentifiers?.some(id => id.toLowerCase() === lowerIdentifier)
  );
  if (exactMatch) return exactMatch;

  // Partial matches (lower confidence)
  return COMPANIES.find(c =>
    c.name.toLowerCase().includes(lowerIdentifier) ||
    c.searchIdentifiers?.some(id => id.toLowerCase().includes(lowerIdentifier))
  );
}

/**
 * Find all companies mentioned in a text (for news article matching)
 * Uses search identifiers for accurate matching
 */
export function findCompaniesInText(text: string): Company[] {
  const lowerText = text.toLowerCase();
  const matches: Company[] = [];

  for (const company of COMPANIES) {
    // Check all search identifiers
    const identifiers = [
      company.name,
      company.ticker,
      ...(company.searchIdentifiers || [])
    ].filter(Boolean) as string[];

    for (const identifier of identifiers) {
      // Use word boundary check to avoid partial matches
      const pattern = new RegExp(`\\b${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(text)) {
        if (!matches.includes(company)) {
          matches.push(company);
        }
        break; // Found a match, no need to check other identifiers
      }
    }
  }

  return matches;
}

/**
 * Get sales team by ID
 */
export function getSalesTeamById(teamId: string): SalesTeam | undefined {
  return SALES_TEAMS.find(t => t.id === teamId);
}

/**
 * Get sales teams assigned to a company
 */
export function getSalesTeamsForCompany(companyId: string): SalesTeam[] {
  const company = getCompanyById(companyId);
  if (!company?.assignedTo) return [];

  return SALES_TEAMS.filter(t => company.assignedTo?.includes(t.id));
}

/**
 * Get all customers assigned to a sales team
 */
export function getCustomersForTeam(teamId: string): Company[] {
  const team = getSalesTeamById(teamId);
  if (!team) return [];

  return team.assignedCustomers.map(id => getCompanyById(id)).filter(Boolean) as Company[];
}
