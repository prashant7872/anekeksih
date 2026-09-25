import { prisma } from '../prisma';

export async function runSeed() {
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
    {
      name: 'transport',
      titleEn: 'Transport & Errands',
      titleHi: 'परिवहन और स्थानीय कार्य',
      emoji: '🚗',
      category: 'Household',
      baseRate: 220.0,
      descriptionEn: 'Local grocery pickups, document courier, safe transit, and senior citizen rides.',
      descriptionHi: 'किराना सामान लाना, दस्तावेज वितरण और बुजुर्गों के लिए स्थानीय सवारी।',
      isSpecialized: false,
    },
  ];

  const createdServices: Record<string, any> = {};
  for (const s of servicesData) {
    const service = await prisma.service.create({ data: s });
    createdServices[s.name] = service;
  }

  // 2. Create Primary Cooperative & Fund
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
  const customerUser = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      phone: '9892012345',
      email: 'customer@anekek.demo',
      role: 'CUSTOMER',
      locale: 'en',
    },
  });

  const customerProfile = await prisma.customerProfile.create({
    data: {
      userId: customerUser.id,
      locality: 'Powai, Mumbai',
      city: 'Mumbai',
      lat: 19.1197,
      lng: 72.9050,
      address: 'Flat 402, Lake Homes, Powai, Mumbai - 400076',
    },
  });

  // Admin User
  await prisma.user.create({
    data: {
      name: 'Federation Board Admin',
      phone: '9800099900',
      email: 'admin@anekek.demo',
      role: 'PLATFORM_ADMIN',
      locale: 'en',
    },
  });

  // 5. Create Seed Bookings with History & Active Job
  const rekhaWorker = createdWorkers.find((w) => w.user.name === 'Rekha Sharma');
  const sureshWorker = createdWorkers.find((w) => w.user.name === 'Suresh Yadav');
  const sunitaWorker = createdWorkers.find((w) => w.user.name === 'Sunita Verma');

  // Active Job: Rekha Sharma - In Progress
  const activeBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-9041',
      customerId: customerProfile.id,
      workerId: rekhaWorker.id,
      serviceId: createdServices['cleaning'].id,
      status: 'ON_THE_WAY',
      scheduledDate: 'Today',
      scheduledTime: '4:00 PM',
      serviceAddress: 'Flat 402, Lake Homes, Powai',
      instructions: 'Gate code is 2214. Ring doorbell once.',
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
                senderId: rekhaWorker.userId,
                message: "Hi! I'm on my way, should reach by 4:00 PM.",
                isRead: true,
              },
              {
                senderId: customerUser.id,
                message: "Sounds good, I'll be home. Gate code is 2214.",
                isRead: true,
              },
              {
                senderId: rekhaWorker.userId,
                message: 'Got it, thank you!',
                isRead: true,
              },
            ],
          },
        },
      },
    },
  });

  // Payment for Active Job
  const pay1 = await prisma.payment.create({
    data: {
      bookingId: activeBooking.id,
      transactionRef: 'UPI-DEMO-TXN-882109',
      amount: 350.0,
      method: 'UPI',
      upiId: 'priyasharma@okhdfcbank',
      status: 'SUCCESS',
      isDemo: true,
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        paymentId: pay1.id,
        type: 'CUSTOMER_PAYMENT',
        amount: 350.0,
        description: 'Demo UPI received for Booking #BK-2026-9041',
      },
      {
        paymentId: pay1.id,
        type: 'WORKER_CREDIT',
        amount: 315.0,
        description: 'Direct credit to Rekha Sharma bank account',
      },
      {
        paymentId: pay1.id,
        type: 'COOP_COMMISSION',
        amount: 35.0,
        description: '10% cooperative collective allocation',
      },
    ],
  });

  // Completed History Bookings
  const comp1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-8712',
      customerId: customerProfile.id,
      workerId: sureshWorker.id,
      serviceId: createdServices['electrical'].id,
      status: 'COMPLETED',
      scheduledDate: '22 Aug 2026',
      scheduledTime: '2:30 PM',
      serviceAddress: 'Flat 402, Lake Homes, Powai',
      basePrice: 300.0,
      distanceKm: 1.1,
      distanceFee: 0.0,
      totalAmount: 300.0,
      workerEarning: 270.0,
      commissionAmount: 30.0,
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
      reviews: {
        create: {
          reviewerId: customerUser.id,
          workerId: sureshWorker.id,
          rating: 5,
          comment: 'Suresh arrived quickly and fixed the MCB tripping problem safely.',
        },
      },
    },
  });

  const comp2 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-8540',
      customerId: customerProfile.id,
      workerId: sunitaWorker.id,
      serviceId: createdServices['eldercare'].id,
      status: 'COMPLETED',
      scheduledDate: '24 Aug 2026',
      scheduledTime: '10:00 AM',
      serviceAddress: 'Flat 402, Lake Homes, Powai',
      basePrice: 500.0,
      distanceKm: 1.8,
      distanceFee: 16.0,
      totalAmount: 516.0,
      workerEarning: 464.0,
      commissionAmount: 52.0,
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
      reviews: {
        create: {
          reviewerId: customerUser.id,
          workerId: sunitaWorker.id,
          rating: 5,
          comment: 'Very patient and caring during the elder care visit. Highly recommend.',
        },
      },
    },
  });

  // 6. Cooperative Voting Proposals
  const p1 = await prisma.voteProposal.create({
    data: {
      cooperativeId: coop.id,
      title: 'Should the cooperative increase the emergency worker welfare fund contribution from 2% to 3%?',
      tag: 'WELFARE POOL',
      description: 'Proposed by the member council to expand emergency hospitalisation and accident aid after monsoon-season claims.',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalEligible: 40,
      votesCastCount: 24,
      status: 'ACTIVE',
      options: {
        create: [
          { label: 'Yes, approve increase to 3%', voteCount: 14, percentage: 58.3 },
          { label: 'No, keep at current 2%', voteCount: 10, percentage: 41.7 },
          { label: 'Abstain', voteCount: 0, percentage: 0.0 },
        ],
      },
    },
  });

  const p2 = await prisma.voteProposal.create({
    data: {
      cooperativeId: coop.id,
      title: 'Lower minimum booking price in Chandivali by 10% for off-peak hours?',
      tag: 'PRICE ADJUSTMENT',
      description: 'Demand in Chandivali dropped 18% during afternoon slots. A temporary incentive is proposed to boost worker bookings.',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalEligible: 40,
      votesCastCount: 18,
      status: 'ACTIVE',
      options: {
        create: [
          { label: 'Yes, lower off-peak rate', voteCount: 13, percentage: 72.2 },
          { label: 'No, maintain standard rate', voteCount: 5, percentage: 27.8 },
        ],
      },
    },
  });

  const p3 = await prisma.voteProposal.create({
    data: {
      cooperativeId: coop.id,
      title: 'Increase Elder Care hourly rates by 8% across Powai zone?',
      tag: 'CARE TARIFF',
      description: 'Caregiver visits in Powai frequently involve specialized mobility support exceeding standard hours. Pay adjustment reflects actual care workload.',
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      totalEligible: 40,
      votesCastCount: 22,
      status: 'ACTIVE',
      options: {
        create: [
          { label: 'Yes, approve 8% increase', voteCount: 18, percentage: 81.8 },
          { label: 'No, keep current rate', voteCount: 4, percentage: 18.2 },
        ],
      },
    },
  });

  // 7. Collective Ideas & Problem Reports
  await prisma.idea.createMany({
    data: [
      {
        cooperativeId: coop.id,
        authorId: rekhaWorker.userId,
        type: 'IDEA',
        category: 'Pricing & Commission',
        title: 'Add a rain-day insurance top-up for outdoor jobs',
        description: 'During severe monsoon days, technicians and cleaners travel with difficulty. A small automatic weather allowance should be provided from the welfare pool.',
        supportCount: 24,
        status: 'UNDER_REVIEW',
      },
      {
        cooperativeId: coop.id,
        authorId: sureshWorker.userId,
        type: 'PROBLEM',
        category: 'Safety',
        title: 'Unsafe parking and loose high-voltage cables near Saki Naka junction',
        description: 'Electricians visiting society basements report loose junction boxes. Need cooperative safety advisory sent to society managers.',
        supportCount: 11,
        status: 'OPEN',
      },
      {
        cooperativeId: coop.id,
        authorId: sunitaWorker.userId,
        type: 'IDEA',
        category: 'Technology',
        title: 'Let workers set a "not available" quiet window without rotation penalty',
        description: 'Allow us to pause bookings for family emergencies or rest days without lowering our fair rotation queue priority.',
        supportCount: 37,
        status: 'RESOLVED',
      },
    ],
  });

  // 8. Sample Customer Dispute
  await prisma.dispute.create({
    data: {
      bookingId: comp1.id,
      customerId: customerProfile.id,
      category: 'Payment / Refund',
      description: 'Duplicate deduction alert received on bank SMS during UPI checkout. Please reconcile ledger.',
      status: 'RESOLVED',
      resolution: 'Reconciled in federation settlement ledger. Single charge of ₹300 verified. Bank trace reference provided to customer.',
    },
  });

  console.log('✅ AnekEk database seeded successfully with realistic data!');
}
