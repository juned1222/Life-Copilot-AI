export interface CampusRoom {
  id: string;
  name: string;
  code: string; // e.g. "Lab 116", "Room 102", "CV-Raman-Lab"
  blockId: 'block-a' | 'block-b' | 'block-c';
  blockName: string;
  floor: 0 | 1 | 2; // 0 = Ground Floor, 1 = 1st Floor (10x), 2 = 2nd Floor (20x)
  floorLabel: string;
  category: 'lab' | 'classroom' | 'office' | 'facility' | 'hall';
  categoryLabel: string;
  lat: number;
  lng: number;
  description: string;
  directionsFromEntrance: string[];
  features: string[];
  timings?: string;
  incharge?: string;
  nearbyRooms?: string[];
}

export const ACROPOLIS_CAMPUS_ROOMS: CampusRoom[] = [
  // ==========================================
  // --- BLOCK B (Second Block) ---
  // ==========================================
  {
    id: 'b-lab-116',
    name: 'Lab 116 (Advanced Programming & Embedded Systems Lab)',
    code: 'Lab 116',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 1,
    floorLabel: '1st Floor (10x Series)',
    category: 'lab',
    categoryLabel: 'Computer & Hardware Lab',
    lat: 22.8224,
    lng: 75.9427,
    description: 'High-configuration 60-seat Linux & IoT workstations lab for Second & Third year practicals in Block B.',
    directionsFromEntrance: [
      'Enter through Acropolis Gate 1 and walk 120m straight past the central fountain to Block B (Second Block).',
      'Walk into Block B via the Central Quadrangle Porch (next to the Nescafe coffee stall).',
      'Take the East central staircase up 1 flight to the 1st Floor (10x series corridor).',
      'Turn right at the corridor past C.V. Raman Physics Lab (Room 115).',
      'Lab 116 is immediately on your left with double glass doors and biometric access.'
    ],
    features: ['60 Intel Core i7 Systems', 'Dual Displays', 'Embedded IoT Boards', 'Fully Air Conditioned', 'Power Backup'],
    timings: '8:30 AM - 5:00 PM',
    incharge: 'Prof. S. Sharma (Lab Coordinator)',
    nearbyRooms: ['C.V. Raman Lab (115)', 'Room 117 (Tutorial Room)', 'Block B Faculty Cabin B-12']
  },
  {
    id: 'b-cv-raman-lab',
    name: 'C.V. Raman Physics & Optics Research Lab',
    code: 'Room 115 (CV Raman Lab)',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 1,
    floorLabel: '1st Floor (10x Series)',
    category: 'lab',
    categoryLabel: 'Physics Research Lab',
    lat: 22.8223,
    lng: 75.9426,
    description: 'Premier optical spectrometry, laser diffraction, and fundamental physics experimental apparatus center.',
    directionsFromEntrance: [
      'Enter Block B (Second Block) from the front porch near Nescafe counter.',
      'Head up the primary central staircase to the 1st Floor (10x Series).',
      'Take an immediate right into the Applied Sciences & Physics wing.',
      'C.V. Raman Lab is located at Room 115, right before Lab 116.'
    ],
    features: ['Spectrometers', 'Helium-Neon Lasers', 'Dark Room Chamber', 'Newton Ring Apparatus'],
    timings: '9:00 AM - 4:30 PM',
    incharge: 'Dr. R. K. Verma (Head of Physics)',
    nearbyRooms: ['Lab 116', 'Physics Dark Room 115-B', 'Faculty Room 114']
  },
  {
    id: 'b-cad-cam-lab',
    name: 'Robotics, Mechatronics & CAD/CAM Lab',
    code: 'Room 12 (CAD Lab)',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'lab',
    categoryLabel: 'Mechanical CAD Lab',
    lat: 22.8222,
    lng: 75.9425,
    description: 'Advanced 3D modeling, AutoCAD, SolidWorks, and 3D printing fabrication lab.',
    directionsFromEntrance: [
      'Enter Block B Ground Floor through the main sliding entrance.',
      'Walk straight along the ground floor corridor towards the West workshop wing.',
      'Room 12 is located on the right side next to the Mechanical Workshop.'
    ],
    features: ['3D Printers', 'SolidWorks & CATIA Licences', 'Robotic Arm Kits', 'CNC Simulator'],
    timings: '9:00 AM - 5:00 PM',
    incharge: 'Prof. M. Patel'
  },
  {
    id: 'b-workshop-10',
    name: 'Mechanical Engineering Workshop & Foundry Section',
    code: 'Room 10 (Workshop)',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'lab',
    categoryLabel: 'Mechanical Workshop',
    lat: 22.8221,
    lng: 75.9424,
    description: 'Carpentry, welding, fitting, foundry and smithy shops for first and second year engineering workshops.',
    directionsFromEntrance: [
      'Proceed to the rear ground floor shed of Block B.',
      'Room 10 has wide industrial roll-up shutter access.'
    ],
    features: ['Lathe Machines', 'Welding Bays', 'Carpentry Benches', 'Safety Gear Section'],
    timings: '8:30 AM - 4:30 PM',
    incharge: 'Er. R. S. Rathore'
  },
  {
    id: 'b-auditorium',
    name: 'Acropolis Central Auditorium & Seminar Hall',
    code: 'Audi B (Ground Floor)',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'hall',
    categoryLabel: 'Central Auditorium',
    lat: 22.8221,
    lng: 75.9427,
    description: '600-seater air conditioned main auditorium for guest lectures, hackathons, and cultural fests.',
    directionsFromEntrance: [
      'Walk to Block B front entrance.',
      'Turn left at the atrium; large acoustic mahogany doors mark the Auditorium entrance.'
    ],
    features: ['600 Seating Capacity', 'Surround Sound', 'Dual 4K Projectors', 'Green Rooms'],
    timings: 'Event Based'
  },
  {
    id: 'b-room-117',
    name: 'Data Structures & Algorithms Lab',
    code: 'Lab 117',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 1,
    floorLabel: '1st Floor (10x Series)',
    category: 'lab',
    categoryLabel: 'Software Programming Lab',
    lat: 22.8225,
    lng: 75.9427,
    description: 'Software development lab dedicated to DSA practicals, competitive programming, and code reviews.',
    directionsFromEntrance: [
      'Block B, 1st Floor East corridor.',
      'Directly adjacent to Lab 116 on the left hallway.'
    ],
    features: ['50 Workstations', 'C++/Java/Python Compilers', 'LAN Intranet'],
    timings: '8:30 AM - 5:00 PM'
  },
  {
    id: 'b-room-204',
    name: 'Lecture Hall 204 (Mechanical & Civil Division)',
    code: 'Room 204',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 2,
    floorLabel: '2nd Floor (20x Series)',
    category: 'classroom',
    categoryLabel: 'Smart Classroom',
    lat: 22.8223,
    lng: 75.9425,
    description: 'Tiered acoustic smart classroom with interactive digital board and mic amplification.',
    directionsFromEntrance: [
      'Enter Block B, proceed up the stairs to 2nd Floor (20x series).',
      'Walk along the South corridor; Room 204 is the 4th classroom on your right.'
    ],
    features: ['Tiered Seating', 'Interactive Smartboard', 'Microphone System', 'PA Speaker'],
    timings: '8:30 AM - 4:30 PM'
  },
  {
    id: 'b-room-206',
    name: 'Computer Networks & Cybersecurity Lab',
    code: 'Room 206',
    blockId: 'block-b',
    blockName: 'Block B (Second Block)',
    floor: 2,
    floorLabel: '2nd Floor (20x Series)',
    category: 'lab',
    categoryLabel: 'Networking Lab',
    lat: 22.8224,
    lng: 75.9426,
    description: 'Cisco Packet Tracer simulation pods, router switches rack, and ethical hacking practice sandbox.',
    directionsFromEntrance: [
      'Block B, 2nd Floor North wing.',
      'Take stairs near Nescafe porch to top level; Room 206 is on the right corner.'
    ],
    features: ['Hardware Router Rack', 'Packet Analyzers', 'Air Conditioned'],
    timings: '9:00 AM - 5:00 PM'
  },

  // ==========================================
  // --- BLOCK A (First Block - CSE, IT, Admin & Principal) ---
  // ==========================================
  {
    id: 'a-director-office',
    name: 'Director & Principal Secretariat',
    code: 'Room 01 (Director Office)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'office',
    categoryLabel: 'Administrative Directorate',
    lat: 22.8228,
    lng: 75.9421,
    description: 'Executive chamber of the College Director and Principal for institutional governance and approvals.',
    directionsFromEntrance: [
      'Enter Block A through the main central portico on Ground Floor.',
      'Directly to the right of the reception fountain.'
    ],
    features: ['Executive Meeting Room', 'Official Seal & Dispatches'],
    timings: '10:00 AM - 5:00 PM'
  },
  {
    id: 'a-first-aid',
    name: 'Campus Health & First Aid Infirmary',
    code: 'Room 02 (Medical Center)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'facility',
    categoryLabel: 'Medical Care',
    lat: 22.8228,
    lng: 75.9420,
    description: 'On-duty medical officer, first-aid response, rest beds, and emergency ambulance dispatch.',
    directionsFromEntrance: [
      'Ground floor Block A, located right beside the main entrance ramp for emergency stretcher access.'
    ],
    features: ['Resting Beds', 'Basic Diagnostics', 'Emergency First-Aid', 'Free Consultations'],
    timings: '8:30 AM - 5:00 PM'
  },
  {
    id: 'a-student-section',
    name: 'Student Section & Scholarship Desk',
    code: 'Room 04 (Registrar Section)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'office',
    categoryLabel: 'Student Affairs & Fees',
    lat: 22.8228,
    lng: 75.9421,
    description: 'Bonafide certificates, fees submission, university scholarship verification, and ID cards.',
    directionsFromEntrance: [
      'Enter Block A main lobby on the Ground Floor.',
      'Turn immediate right after the security desk.',
      'Counters 1 through 4 handle all student documents and fee receipts.'
    ],
    features: ['Fee Counters', 'Scholarship Verification', 'Bus Pass Counter', 'Bonafide Issuance'],
    timings: '9:00 AM - 4:00 PM'
  },
  {
    id: 'a-canteen-ground',
    name: 'Manasvi Central Food Canteen (Ground Floor)',
    code: 'Canteen Ground (0x)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'facility',
    categoryLabel: 'Campus Canteen',
    lat: 22.8229,
    lng: 75.9422,
    description: 'Main college food court serving Baked Samosa, Poha, meals, and snacks.',
    directionsFromEntrance: [
      'Walk to the rear ground floor courtyard of Block A.',
      'Follow the open arcade corridor; large glass doors open directly into the canteen.'
    ],
    features: ['Indoor Seating for 250', 'UPI Billing', 'Fresh Juice Counter'],
    timings: '8:00 AM - 5:30 PM'
  },
  {
    id: 'a-turing-lab',
    name: 'Alan Turing Supercomputing & AI Lab',
    code: 'Room 102 (Turing Lab)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 1,
    floorLabel: '1st Floor (10x Series)',
    category: 'lab',
    categoryLabel: 'AI & Data Science Lab',
    lat: 22.8230,
    lng: 75.9423,
    description: 'NVIDIA GPU accelerated workstation lab dedicated to Deep Learning, AI projects, and Big Data.',
    directionsFromEntrance: [
      'Enter Block A (First Block) through the main administrative porch.',
      'Head up the grand staircase right next to the reception to the 1st Floor.',
      'Turn left into the Computer Science Department hallway.',
      'Room 102 (Turing Lab) is on your left with glass partition windows.'
    ],
    features: ['NVIDIA RTX 4080 Workstations', 'CUDA Support', 'Gigabit Fibre LAN', 'High-Speed Cloud Gateway'],
    timings: '8:30 AM - 5:30 PM',
    incharge: 'Dr. A. K. Jain (CSE HOD)'
  },
  {
    id: 'a-hod-cse',
    name: 'HOD Office - Computer Science & Engineering',
    code: 'Room 105 (HOD CSE)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 1,
    floorLabel: '1st Floor (10x Series)',
    category: 'office',
    categoryLabel: 'Department Head Office',
    lat: 22.8229,
    lng: 75.9422,
    description: 'Office of Head of Computer Science Department, student counseling and academic approvals.',
    directionsFromEntrance: [
      'Take the main staircase in Block A to the 1st Floor.',
      'Walk straight along the CSE wing; Room 105 is situated opposite Tutorial Room 106.'
    ],
    features: ['Student Consultation Desk', 'Department Records', 'Academic Advisory'],
    timings: '9:30 AM - 4:30 PM'
  },
  {
    id: 'a-placement-cell',
    name: 'Career Resource Development (CRD Placement Cell)',
    code: 'Room 210 (CRD Cell)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 2,
    floorLabel: '2nd Floor (20x Series)',
    category: 'office',
    categoryLabel: 'Training & Placements',
    lat: 22.8229,
    lng: 75.9424,
    description: 'Corporate recruitment interview suites, GD rooms, aptitude testing centers, and resume reviews.',
    directionsFromEntrance: [
      'Take the Block A lift or central staircase up to the 2nd Floor (20x series).',
      'Follow signs for "CRD & Training Cell" towards the North wing.',
      'Room 210 is adjacent to the GD Conference Hall 211.'
    ],
    features: ['4 Mock Interview Cubicles', 'GD Round Table Room', 'Corporate Visitor Lounge'],
    timings: '9:00 AM - 6:00 PM',
    incharge: 'Dr. V. K. Mandloi (Director CRD)'
  },
  {
    id: 'a-room-215',
    name: 'Innovation & Patent Incubation Cell',
    code: 'Room 215 (Incubation)',
    blockId: 'block-a',
    blockName: 'Block A (First Block - Admin & CSE)',
    floor: 2,
    floorLabel: '2nd Floor (20x Series)',
    category: 'office',
    categoryLabel: 'Incubation Center',
    lat: 22.8231,
    lng: 75.9425,
    description: 'Student startup accelerator, patent filing support desk, and prototyping support fund.',
    directionsFromEntrance: [
      'Block A, 2nd Floor South wing corridor.',
      'Adjacent to CRD Placement office.'
    ],
    features: ['High-speed Wi-Fi', 'Brainstorming Lounge', 'Mentorship Pods'],
    timings: '9:00 AM - 6:00 PM'
  },

  // ==========================================
  // --- BLOCK C (Third Block - Library, EC, Electrical & Exam Cell) ---
  // ==========================================
  {
    id: 'c-exam-cell',
    name: 'Confidential Examination Controller Cell',
    code: 'Room 08 (Exam Cell)',
    blockId: 'block-c',
    blockName: 'Block C (Third Block - Library & EC)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'office',
    categoryLabel: 'Examination Cell',
    lat: 22.8216,
    lng: 75.9420,
    description: 'University RGPV examination form submissions, hall tickets, re-evaluations, and grade sheets.',
    directionsFromEntrance: [
      'Enter Block C Ground Floor, proceed down the main hallway.',
      'Room 08 is at the intersection of the administrative corridor.'
    ],
    features: ['Form Verification', 'RGPV Portal Access', 'Mark Sheet Section'],
    timings: '10:00 AM - 4:00 PM'
  },
  {
    id: 'c-chemistry-lab',
    name: 'Applied Chemistry & Environmental Science Lab',
    code: 'Room 11 (Chemistry Lab)',
    blockId: 'block-c',
    blockName: 'Block C (Third Block - Library & EC)',
    floor: 0,
    floorLabel: 'Ground Floor (0x Series)',
    category: 'lab',
    categoryLabel: 'Chemistry Lab',
    lat: 22.8215,
    lng: 75.9421,
    description: 'Chemical titration benches, water analysis kit, fume hoods, and spectrophotometer equipment.',
    directionsFromEntrance: [
      'Block C Ground Floor East wing.',
      'Room 11 is next to the First-Year faculty lounge.'
    ],
    features: ['Fume Hood', 'Chemical Reagents Safety Cabinet', 'Eye Wash Stations'],
    timings: '9:00 AM - 4:30 PM'
  },
  {
    id: 'c-central-library',
    name: 'Acropolis Central Library & Digital Reading Room',
    code: 'Library (Floor 1 & 2)',
    blockId: 'block-c',
    blockName: 'Block C (Third Block - Library & EC)',
    floor: 1,
    floorLabel: '1st & 2nd Floor (10x/20x)',
    category: 'facility',
    categoryLabel: 'Central Library',
    lat: 22.8217,
    lng: 75.9421,
    description: 'Over 65,000 engineering titles, IEEE journal terminals, and quiet study reading halls.',
    directionsFromEntrance: [
      'Walk 150m South of Block A towards the lush green garden quadrangle to Block C.',
      'Enter Block C through the turnstiles and take the elevator or central stairs to Floor 1.',
      'Scan your student ID card barcode at the automated library gate.'
    ],
    features: ['65,000+ Books', 'IEEE Xplore Terminals', 'Digital Delnet Repository', 'Quiet Zone for 300'],
    timings: '8:00 AM - 7:00 PM',
    incharge: 'Chief Librarian Desk'
  },
  {
    id: 'c-iot-lab',
    name: 'Electronics, VLSI & Embedded IoT Lab',
    code: 'Room 108 (VLSI Lab)',
    blockId: 'block-c',
    blockName: 'Block C (Third Block - Library & EC)',
    floor: 1,
    floorLabel: '1st Floor (10x Series)',
    category: 'lab',
    categoryLabel: 'Electronics & VLSI Lab',
    lat: 22.8218,
    lng: 75.9422,
    description: 'Cadence EDA tools, FPGA kits, DSO oscilloscopes, and PCB prototype fabrication benches.',
    directionsFromEntrance: [
      'Go to Block C 1st Floor (10x Series).',
      'Follow the Electronics Department corridor; Room 108 is directly opposite the Faculty Staff Room.'
    ],
    features: ['Digital Storage Oscilloscopes', 'FPGA Trainer Boards', 'Soldering Stations', 'Cadence Suite'],
    timings: '9:00 AM - 5:00 PM'
  },
  {
    id: 'c-seminar-hall',
    name: 'Swami Vivekananda Seminar Hall',
    code: 'Room 201 (Seminar Hall)',
    blockId: 'block-c',
    blockName: 'Block C (Third Block - Library & EC)',
    floor: 2,
    floorLabel: '2nd Floor (20x Series)',
    category: 'hall',
    categoryLabel: 'Conference Hall',
    lat: 22.8217,
    lng: 75.9423,
    description: '200-seat acoustic conference hall for departmental symposiums and technical paper presentations.',
    directionsFromEntrance: [
      'Take the Block C elevator or stairs to the 2nd Floor (20x Series).',
      'Room 201 is on the central wing overlooking the campus sports ground.'
    ],
    features: ['200 Seater', 'Central Air Conditioning', 'Video Conferencing Facility'],
    timings: '8:30 AM - 5:00 PM'
  },
  {
    id: 'c-room-203',
    name: 'Digital Signal Processing (DSP) & Microwave Lab',
    code: 'Room 203',
    blockId: 'block-c',
    blockName: 'Block C (Third Block - Library & EC)',
    floor: 2,
    floorLabel: '2nd Floor (20x Series)',
    category: 'lab',
    categoryLabel: 'EC Engineering Lab',
    lat: 22.8218,
    lng: 75.9424,
    description: 'MATLAB DSP toolboxes, microwave test benches, antenna design transmitters, and spectrum analyzers.',
    directionsFromEntrance: [
      'Block C, 2nd Floor.',
      'Turn left past the library upper balcony; Room 203 is on the corner.'
    ],
    features: ['MATLAB Licenses', 'Microwave Benches', 'Antenna Trainers'],
    timings: '9:00 AM - 5:00 PM'
  }
];
