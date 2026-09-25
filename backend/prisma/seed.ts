import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AnekEk realistic seed data population...');

  // Clean existing tables (in correct order of foreign keys)
  await prisma.transaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.workerEarning.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.voteOption.deleteMany();
  await prisma.voteProposal.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.workerSkill.deleteMany();
  await prisma.workerVerification.deleteMany();
  await prisma.cooperativeMembership.deleteMany();
  await prisma.cooperativeFund.deleteMany();
  await prisma.cooperative.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Services
  console.log('Creating Services...');
  const servicesData = [
    {
      name: 'plumbing',
      titleEn: 'Plumbing & Pipe Repair',
      titleHi: 'नल और पाइप मरम्मत',
      emoji: '🚰',
      category: 'Technical',
      baseRate: 350.0,
      descriptionEn: 'Leak fixes, pipe installations, tap fittings, and bathroom plumbing by verified tradespeople.',
      descriptionHi: 'सत्यापित कारीगरों द्वारा रिसाव की मरम्मत, पाइप स्थापना और नल फिटिंग।',
      isSpecialized: false,
    },
    {
      name: 'electrical',
      titleEn: 'Electrical Repair & Wiring',
      titleHi: 'बिजली मरम्मत और वायरिंग',
      emoji: '⚡',
      category: 'Technical',
      baseRate: 300.0,
      descriptionEn: 'Short circuits, switchboard repair, appliance wiring, and fan installation by certified electricians.',
      descriptionHi: 'प्रमाणित इलेक्ट्रीशियन द्वारा शॉर्ट सर्किट, स्विचबोर्ड मरम्मत और पंखा लगाना।',
      isSpecialized: false,
    },
    {
      name: 'carpentry',
      titleEn: 'Carpentry & Furniture Fitting',
      titleHi: 'बढ़ईगीरी और फर्नीचर फिटिंग',
      emoji: '🪚',
      category: 'Technical',
      baseRate: 400.0,
      descriptionEn: 'Custom woodwork, hinge repairs, locks, modular fittings, and furniture restoration.',
      descriptionHi: 'कस्टम लकड़ी का काम, काज मरम्मत, ताले और फर्नीचर की मरम्मत।',
      isSpecialized: false,
    },
    {
      name: 'appliance',
      titleEn: 'Appliance Repair',
      titleHi: 'उपकरण मरम्मत',
      emoji: '🔧',
      category: 'Technical',
      baseRate: 450.0,
      descriptionEn: 'Washing machines, microwave ovens, water purifiers (RO), and geyser diagnostics.',
      descriptionHi: 'वॉशिंग मशीन, माइक्रोवेव ओवन, आरओ और गीजर की मरम्मत।',
      isSpecialized: false,
    },
    {
      name: 'cleaning',
      titleEn: 'Home Cleaning & Sanitization',
      titleHi: 'घर की सफाई और स्वच्छता',
      emoji: '🧹',
      category: 'Household',
      baseRate: 350.0,
      descriptionEn: 'Deep cleaning, regular upkeep, kitchen degreasing, and move-in/out service.',
      descriptionHi: 'गहन सफाई, नियमित रखरखाव, रसोई की सफाई और रहने योग्य तैयारी।',
      isSpecialized: false,
    },
    {
      name: 'cooking',
      titleEn: 'Cooking & Meal Prep',
      titleHi: 'खाना बनाना और भोजन तैयारी',
      emoji: '🍳',
      category: 'Household',
      baseRate: 280.0,
      descriptionEn: 'Home-style everyday cooking, balanced dietary meals, and family feast preparations.',
      descriptionHi: 'घर जैसा स्वादिष्ट भोजन, संतुलित आहार और पारिवारिक अवसरों के लिए खाना।',
      isSpecialized: false,
    },
    {
      name: 'eldercare',
      titleEn: 'Elder Care & Companionship',
      titleHi: 'बुजुर्गों की देखभाल और साथ',
      emoji: '🧓',
      category: 'Care',
      baseRate: 500.0,
      descriptionEn: 'Gentle companionship, mobility support, medication reminders, and vital checks.',
      descriptionHi: 'सहानुभूतिपूर्ण देखभाल, गतिशीलता सहायता, दवा याद दिलाना और स्वास्थ्य निगरानी।',
      isSpecialized: true,
    },
    {
      name: 'childcare',
      titleEn: 'Childcare & Babysitting',
      titleHi: 'शिशु देखभाल और बेबीसिटिंग',
      emoji: '👶',
      category: 'Care',
      baseRate: 350.0,
      descriptionEn: 'Police background-checked, trusted care for toddlers and school-age children.',
      descriptionHi: 'पुलिस चरित्र-सत्यापित, बच्चों के लिए सुरक्षित और विश्वसनीय देखभाल।',
      isSpecialized: true,
    },
    {
      name: 'gardening',
      titleEn: 'Gardening & Landscaping',
      titleHi: 'बागवानी और हरियाली',
      emoji: '🌱',
      category: 'Household',
      baseRate: 260.0,
      descriptionEn: 'Lawn trimming, potting, plant nourishment, and terrace garden maintenance.',
      descriptionHi: 'पौधों की छंटाई, खाद डालना और छत के बगीचे की देखभाल।',
      isSpecialized: false,
    },
    {
      name: 'painting',
      titleEn: 'Home Painting & Touch-up',
      titleHi: 'घर की रंगाई और पुट्टी',
      emoji: '🎨',
      category: 'Household',
      baseRate: 400.0,
      descriptionEn: 'Interior wall painting, waterproof coating, dampness treatment, and door varnish.',
      descriptionHi: 'दीवारों की रंगाई, वॉटरप्रूफ कोटिंग, सीलन उपचार और दरवाजों की पॉलिश।',
      isSpecialized: false,
    },
    {
      name: 'tutoring',
      titleEn: 'Tutoring & Homework Help',
      titleHi: 'ट्यूशन और होमवर्क सहायता',
      emoji: '📚',
      category: 'Household',
      baseRate: 400.0,
      descriptionEn: 'Maths, science, and languages for school-age students by qualified educators.',
      descriptionHi: 'गणित, विज्ञान और भाषा विषयों के लिए व्यक्तिगत ट्यूशन।',
      isSpecialized: false,
    },
    {
      name: 'laundry',
      titleEn: 'Laundry & Ironing',
      titleHi: 'कपड़े धोना और इस्त्री करना',
      emoji: '🧺',
      category: 'Household',
      baseRate: 250.0,
      descriptionEn: 'Fabric-safe wash, stain removal, steam ironing, and door-to-door delivery.',
      descriptionHi: 'कपड़ों की सुरक्षित धुलाई, दाग हटाना और स्टीम प्रेस।',
      isSpecialized: false,
    },
  ];

  const createdServices: Record<string, any> = {};
  for (const s of servicesData) {
    const service = await prisma.service.create({ data: s });
    createdServices[s.name] = service;
  }

  // 2. Create Primary Cooperative & Fund
  console.log('Creating Cooperative & Fund...');
  const coop = await prisma.cooperative.create({
    data: {
      name: 'Maharashtra Shramik Swavalamban Federation',
      registrationCode: 'MH-COOP-FED-2026-089',
      region: 'Mumbai Metropolitan Region',
      description: 'Democratically managed gig worker cooperative federation representing tradespeople, care providers, and domestic technicians.',
      commissionPct: 10.0,
      welfareSharePct: 30.0,
      insuranceSharePct: 30.0,
      reinvestSharePct: 20.0,
      dividendSharePct: 20.0,
      memberCount: 1240,
      fund: {
        create: {
          totalPlatformGross: 184500.0,
          totalCommission: 18450.0,
          welfarePool: 5535.0,
          insurancePool: 5535.0,
          reinvestmentPool: 3690.0,
          dividendPool: 3690.0,
        },
      },
    },
  });

  // 3. Create Seed Users & Worker Profiles
  console.log('Creating Seed Workers & Profiles...');
  const workersSeed = [
    {
      name: 'Rekha Sharma',
      phone: '9876543210',
      email: 'worker@anekek.demo',
      serviceKey: 'cleaning',
      locality: 'Powai, Mumbai',
      lat: 19.1176,
      lng: 72.9060,
      experience: 6,
      rating: 4.9,
      ratingsCount: 147,
      basePrice: 350,
      queuePos: 1,
      fairRotation: 94,
      shg: 'Andheri Domestic Workers Collective',
      skills: ['cleaning', 'cooking'],
      hasCert: false,
    },
    {
      name: 'Suresh Yadav',
      phone: '9820011223',
      email: 'suresh.yadav@anekek.demo',
      serviceKey: 'electrical',
      locality: 'Chandivali, Mumbai',
      lat: 19.1120,
      lng: 72.8980,
      experience: 9,
      rating: 4.8,
      ratingsCount: 215,
      basePrice: 300,
      queuePos: 2,
      fairRotation: 88,
      shg: 'Maharashtra Bijli Shramik Sangh',
      skills: ['electrical', 'appliance'],
      hasCert: false,
    },
    {
      name: 'Sunita Verma',
      phone: '9833445566',
      email: 'sunita.verma@anekek.demo',
      serviceKey: 'eldercare',
      locality: 'Hiranandani, Powai',
      lat: 19.1190,
      lng: 72.9080,
      experience: 5,
      rating: 5.0,
      ratingsCount: 98,
      basePrice: 500,
      queuePos: 3,
      fairRotation: 91,
      shg: 'Asha Seva Sahakari Samiti',
      skills: ['eldercare', 'childcare'],
      hasCert: true,
    },
    {
      name: 'Ramesh Kumar',
      phone: '9819988776',
      email: 'ramesh.kumar@anekek.demo',
      serviceKey: 'plumbing',
      locality: 'Vikhroli West, Mumbai',
      lat: 19.1100,
      lng: 72.9190,
      experience: 8,
      rating: 4.8,
      ratingsCount: 164,
      basePrice: 350,
      queuePos: 4,
      fairRotation: 82,
      shg: 'Mumbai Jal-Shramik Federation',
      skills: ['plumbing'],
      hasCert: false,
    },
    {
      name: 'Imran Khan',
      phone: '9870123456',
      email: 'imran.khan@anekek.demo',
      serviceKey: 'carpentry',
      locality: 'Kanjurmarg West, Mumbai',
      lat: 19.1250,
      lng: 72.9280,
      experience: 11,
      rating: 4.9,
      ratingsCount: 180,
      basePrice: 400,
      queuePos: 5,
      fairRotation: 85,
      shg: 'Maharashtra Kashtakari Sanghatana',
      skills: ['carpentry', 'painting'],
      hasCert: false,
    },
    {
      name: 'Meena Patel',
      phone: '9845012345',
      email: 'meena.patel@anekek.demo',
      serviceKey: 'cooking',
      locality: 'Powai, Mumbai',
      lat: 19.1210,
      lng: 72.9040,
      experience: 7,
      rating: 4.7,
      ratingsCount: 112,
      basePrice: 280,
      queuePos: 6,
      fairRotation: 79,
      shg: 'Mahila Rasoi Sahakari Samiti',
      skills: ['cooking'],
      hasCert: false,
    },
    {
      name: 'Arjun Verma',
      phone: '9867011223',
      email: 'arjun.verma@anekek.demo',
      serviceKey: 'appliance',
      locality: 'Saki Naka, Andheri',
      lat: 19.1050,
      lng: 72.8870,
      experience: 6,
      rating: 4.8,
      ratingsCount: 130,
      basePrice: 450,
      queuePos: 7,
      fairRotation: 89,
      shg: 'Technical Service Workers Union',
      skills: ['appliance', 'electrical'],
      hasCert: false,
    },
    {
      name: 'Asha Bai',
      phone: '9811223344',
      email: 'asha.bai@anekek.demo',
      serviceKey: 'childcare',
      locality: 'Chandivali, Mumbai',
      lat: 19.1140,
      lng: 72.8990,
      experience: 8,
      rating: 4.9,
      ratingsCount: 142,
      basePrice: 350,
      queuePos: 8,
      fairRotation: 96,
      shg: 'SEWA Mumbai Chapter',
      skills: ['childcare', 'eldercare'],
      hasCert: true,
    },
  ];

  const createdWorkers: any[] = [];

  for (const w of workersSeed) {
    const user = await prisma.user.create({
      data: {
        name: w.name,
        phone: w.phone,
        email: w.email,
        role: 'WORKER',
        locale: 'en',
      },
    });

    const primarySvc = createdServices[w.serviceKey];

    const workerProfile = await prisma.workerProfile.create({
      data: {
        userId: user.id,
        locality: w.locality,
        city: 'Mumbai',
        lat: w.lat,
        lng: w.lng,
        experienceYears: w.experience,
        basePrice: w.basePrice,
        isAvailable: true,
        queuePosition: w.queuePos,
        fairRotationPoints: w.fairRotation,
        ownershipShare: 0.08,
        completedJobsCount: w.ratingsCount,
        averageRating: w.rating,
        ratingsCount: w.ratingsCount,
        primaryServiceId: primarySvc?.id,
      },
    });

    createdWorkers.push({ ...workerProfile, user });

    // Cooperative membership
    await prisma.cooperativeMembership.create({
      data: {
        workerId: workerProfile.id,
        cooperativeId: coop.id,
        memberStatus: 'ACTIVE',
        shgAffiliation: w.shg,
      },
    });

    // Verifications
    await prisma.workerVerification.create({
      data: {
        workerId: workerProfile.id,
        verificationType: 'AADHAAR_KYC',
        status: 'VERIFIED',
        documentMasked: `XXXX-XXXX-${w.phone.slice(-4)}`,
        verifiedAt: new Date(),
        notes: 'e-KYC Verified via Digilocker & e-Shram linkage',
      },
    });

    await prisma.workerVerification.create({
      data: {
        workerId: workerProfile.id,
        verificationType: 'SHG_UNION',
        status: 'VERIFIED',
        documentMasked: `SHG-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        verifiedAt: new Date(),
        notes: `Affiliated with ${w.shg}`,
      },
    });

    if (w.hasCert) {
      await prisma.workerVerification.create({
        data: {
          workerId: workerProfile.id,
          verificationType: 'POLICE_BACKGROUND',
          status: 'VERIFIED',
          documentMasked: 'PB-POLICE-VERIFIED-2026',
          verifiedAt: new Date(),
          notes: 'Character verification and background check validated',
        },
      });
    }

    // Skills
    for (const sk of w.skills) {
      const s = createdServices[sk];
      if (s) {
        await prisma.workerSkill.create({
          data: {
            workerId: workerProfile.id,
            serviceId: s.id,
            experienceYrs: w.experience,
            isVerified: true,
          },
        });
      }
    }
  }

  // 4. Create Customers
  console.log('Creating Customers...');
  const customerUser = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      phone: '9123456789',
      email: 'customer@anekek.demo',
      role: 'CUSTOMER',
      locale: 'en',
    },
  });

  const customerProfile = await prisma.customerProfile.create({
    data: {
      userId: customerUser.id,
      locality: 'Powai',
      city: 'Mumbai',
      lat: 19.1180,
      lng: 72.9055,
      address: 'B-402, Lake Homes, Powai, Mumbai - 400076',
    },
  });

  // Secondary Customer
  const customer2 = await prisma.user.create({
    data: {
      name: 'Anand Rao',
      phone: '9111222333',
      email: 'anand.rao@anekek.demo',
      role: 'CUSTOMER',
      locale: 'en',
    },
  });

  const customerProfile2 = await prisma.customerProfile.create({
    data: {
      userId: customer2.id,
      locality: 'Chandivali',
      city: 'Mumbai',
      lat: 19.1130,
      lng: 72.8995,
      address: 'Flat 1204, Nahar Amrit Shakti, Chandivali, Mumbai',
    },
  });

  // 5. Create Admin Accounts
  console.log('Creating Admin Users...');
  await prisma.user.create({
    data: {
      name: 'SIH Evaluator / Platform Admin',
      phone: '9999988888',
      email: 'admin@anekek.demo',
      role: 'PLATFORM_ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Rajesh Nair (Cooperative Secretary)',
      phone: '9999977777',
      email: 'coop@anekek.demo',
      role: 'COOP_ADMIN',
    },
  });

  // 6. Create Seed Bookings
  console.log('Creating Seed Bookings...');
  const rekha = createdWorkers[0]; // Rekha Sharma (Cleaning)
  const suresh = createdWorkers[1]; // Suresh Yadav (Electrical)

  // Booking 1: In Progress / Confirmed
  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-9041',
      customerId: customerProfile.id,
      workerId: rekha.id,
      serviceId: createdServices.cleaning.id,
      status: 'ON_THE_WAY',
      scheduledDate: 'Today',
      scheduledTime: '4:00 PM',
      serviceAddress: 'B-402, Lake Homes, Powai, Mumbai',
      instructions: 'Gate code 2214. Please ring the main buzzer.',
      basePrice: 350.0,
      distanceKm: 0.6,
      distanceFee: 0.0,
      totalAmount: 350.0,
      workerEarning: 315.0,
      commissionAmount: 35.0,
      commissionPct: 10.0,
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
      chat: {
        create: {
          messages: {
            create: [
              {
                senderId: rekha.userId,
                message: "Namaste! I am on my way, will reach by 4:00 PM.",
              },
              {
                senderId: customerUser.id,
                message: "Sounds great Rekha ji, gate code is 2214.",
              },
              {
                senderId: rekha.userId,
                message: "Thank you, arrived at building gate.",
              },
            ],
          },
        },
      },
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      transactionRef: 'UPI-DEMO-98124801',
      amount: 350.0,
      method: 'UPI',
      upiId: 'priyasharma@okhdfcbank',
      status: 'SUCCESS',
      isDemo: true,
      transactions: {
        create: [
          {
            type: 'CUSTOMER_PAYMENT',
            amount: 350.0,
            description: 'Customer paid ₹350 via Demo UPI',
          },
          {
            type: 'WORKER_CREDIT',
            amount: 315.0,
            description: 'Worker earning credited ₹315',
          },
          {
            type: 'COOP_COMMISSION',
            amount: 35.0,
            description: 'Cooperative received 10% commission ₹35',
          },
        ],
      },
    },
  });

  // Booking 2: Completed with Reviews
  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-8812',
      customerId: customerProfile.id,
      workerId: rekha.id,
      serviceId: createdServices.cleaning.id,
      status: 'COMPLETED',
      scheduledDate: '27 Aug 2026',
      scheduledTime: '10:00 AM',
      serviceAddress: 'B-402, Lake Homes, Powai, Mumbai',
      instructions: '2BHK Deep cleaning',
      basePrice: 650.0,
      distanceKm: 0.6,
      distanceFee: 0.0,
      totalAmount: 650.0,
      workerEarning: 585.0,
      commissionAmount: 65.0,
      commissionPct: 10.0,
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
    },
  });

  await prisma.review.create({
    data: {
      bookingId: booking2.id,
      reviewerId: customerUser.id,
      workerId: rekha.id,
      rating: 5,
      comment: 'Rekha was on time and did a fantastic deep clean — will definitely book again!',
    },
  });

  await prisma.workerEarning.create({
    data: {
      workerId: rekha.id,
      bookingId: booking2.id,
      grossAmount: 650.0,
      commissionDeducted: 65.0,
      netEarnings: 585.0,
      welfareContribution: 19.5,
      dividendAccrued: 13.0,
      payoutStatus: 'CREDITED',
    },
  });

  // Booking 3: Completed by Suresh
  const booking3 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-7910',
      customerId: customerProfile.id,
      workerId: suresh.id,
      serviceId: createdServices.electrical.id,
      status: 'COMPLETED',
      scheduledDate: '22 Aug 2026',
      scheduledTime: '2:30 PM',
      serviceAddress: 'B-402, Lake Homes, Powai, Mumbai',
      instructions: 'Living room fan regulator spark and switch replacement.',
      basePrice: 300.0,
      distanceKm: 1.1,
      distanceFee: 0.0,
      totalAmount: 300.0,
      workerEarning: 270.0,
      commissionAmount: 30.0,
      commissionPct: 10.0,
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CASH',
    },
  });

  await prisma.review.create({
    data: {
      bookingId: booking3.id,
      reviewerId: customerUser.id,
      workerId: suresh.id,
      rating: 5,
      comment: 'Suresh replaced the sparking switchboard safely and quickly. Very honest pricing.',
    },
  });

  // 7. Create Democratic Voting Proposals
  console.log('Creating Democratic Governance Proposals...');
  const proposal1 = await prisma.voteProposal.create({
    data: {
      cooperativeId: coop.id,
      title: 'Should the cooperative increase the emergency worker welfare fund contribution from 2% to 3%?',
      tag: 'Welfare Expansion',
      description: 'Proposed by member council to expand emergency accident and health cover pool after seasonal monsoon claims. The additional 1% is transferred directly into member welfare, not retained as platform profit.',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalEligible: 40,
      votesCastCount: 26,
      options: {
        create: [
          { label: 'Yes, approve welfare increase', voteCount: 17, percentage: 65.0 },
          { label: 'No, keep current allocation', voteCount: 9, percentage: 35.0 },
        ],
      },
    },
  });

  const proposal2 = await prisma.voteProposal.create({
    data: {
      cooperativeId: coop.id,
      title: 'Temporary 10% lower minimum booking price in Chandivali to stimulate local demand?',
      tag: 'Demand Strategy',
      description: 'Bookings in Chandivali cluster have dropped 18% compared to Powai. A temporary promotional co-op rate is proposed to rebuild household demand before it affects worker rotation queues.',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalEligible: 40,
      votesCastCount: 21,
      options: {
        create: [
          { label: 'Yes, lower it temporarily', voteCount: 15, percentage: 71.0 },
          { label: 'No, keep current rate', voteCount: 6, percentage: 29.0 },
        ],
      },
    },
  });

  const proposal3 = await prisma.voteProposal.create({
    data: {
      cooperativeId: coop.id,
      title: 'Increase Elder Care hourly rates by 8% in Powai cluster?',
      tag: 'Fair Wage Top-Up',
      description: 'Elder care visits in Powai are averaging 4.2 hours per slot instead of the standard 3 hours. This proposal raises base rates so caregiver remuneration directly mirrors real time spent.',
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      totalEligible: 40,
      votesCastCount: 31,
      options: {
        create: [
          { label: 'Yes, approve fair wage top-up', voteCount: 26, percentage: 84.0 },
          { label: 'No, retain current rate', voteCount: 5, percentage: 16.0 },
        ],
      },
    },
  });

  // 8. Create Member Ideas & Problems
  console.log('Creating Member Ideas & Problems...');
  await prisma.idea.create({
    data: {
      cooperativeId: coop.id,
      authorId: rekha.userId,
      type: 'IDEA',
      category: 'Pricing & Commission',
      title: 'Add a rain-day insurance top-up for outdoor jobs',
      description: 'During heavy monsoon weeks in Mumbai, outdoor gardeners, repair technicians, and cleaners face transit blockages. We should establish a micro-buffer grant from the insurance pool.',
      supportCount: 24,
      status: 'UNDER_REVIEW',
    },
  });

  await prisma.idea.create({
    data: {
      cooperativeId: coop.id,
      authorId: suresh.userId,
      type: 'PROBLEM',
      category: 'Safety',
      title: 'Unsafe electrical earthing in older Chandivali residential towers',
      description: 'Technicians are frequently encountering ungrounded high-load sockets. The cooperative should provide standard tester kits to all certified electricians.',
      supportCount: 19,
      status: 'IN_PROGRESS',
    },
  });

  await prisma.idea.create({
    data: {
      cooperativeId: coop.id,
      authorId: rekha.userId,
      type: 'IDEA',
      category: 'Technology',
      title: 'Let workers set custom "not available" breaks directly in the dashboard',
      description: 'Giving worker-owners flexible shift toggling without hurting their fair-rotation score helps maintain family care balance.',
      supportCount: 37,
      status: 'OPEN',
    },
  });

  // 9. Initial Notifications for Seed Users
  console.log('Creating Initial Notifications...');
  await prisma.notification.create({
    data: {
      userId: rekha.userId,
      title: 'Active Booking Assigned',
      message: 'You have an active booking today with Priya Sharma at 4:00 PM for Home Cleaning.',
      type: 'BOOKING',
    },
  });

  await prisma.notification.create({
    data: {
      userId: rekha.userId,
      title: 'New Cooperative Vote Open',
      message: 'Vote on Proposal: Increase emergency worker welfare fund from 2% to 3%.',
      type: 'VOTE',
    },
  });

  await prisma.notification.create({
    data: {
      userId: customerUser.id,
      title: 'Worker On The Way',
      message: 'Rekha Sharma has marked status "On the way" for your 4:00 PM booking.',
      type: 'BOOKING',
    },
  });

  console.log('✅ Realistic seed data successfully populated for AnekEk!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
