export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Brand & Nav
    brandName: 'AnekEk',
    coopSub: 'WORKER-OWNED COOPERATIVE',
    bookService: 'Book a Service',
    joinWorker: 'Join as a Worker',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    hiWorker: 'Hi, Worker 👋',
    demoMode: 'DEMO MODE',
    switchRole: 'Switch Demo Persona',

    // Hero
    eyebrow: 'A Worker-Owned Cooperative Platform',
    heroQuote: '"Fair for the hands that work. Trusted by the homes that call."',
    heroSub: 'AnekEk connects households and communities with verified, worker-owned service providers — where every worker holds a real stake in the platform, not just a listing on it.',
    enterLocation: 'Enter your location (e.g. Powai, Mumbai)',
    findServices: 'Find Services',
    useLiveLocation: 'Use Live Location',
    locatingGps: 'Locating you precisely via GPS...',
    gpsSuccess: 'Location verified: Powai, Mumbai (Live GPS)',

    // Stat Strip
    statWorkers: 'Worker-Owners',
    statCollectives: 'Collectives',
    statCommission: 'Avg. Commission',
    statCities: 'Cities',

    // Services
    servicesLabel: 'What We Offer',
    servicesTitle: 'Services You Can Trust',
    servicesSub: 'Every provider below is a verified co-owner of AnekEk.',
    workerOwned: 'Worker-Owned',
    startingAt: 'Starting at',

    // How It Works (Requirement 47)
    howTitle: 'How AnekEk Works',
    howSub: 'A community-first model where gig workers co-own their digital marketplace.',
    step1Title: 'Worker joins cooperative',
    step1Desc: 'Tradespeople, technicians, cleaners, and caregivers register through local SHGs or Labour Federations.',
    step2Title: 'Worker gets verified',
    step2Desc: 'Aadhaar e-KYC and trade skill certifications verified with masked privacy protection.',
    step3Title: 'Customer requests service',
    step3Desc: 'Households pick a trade service, preferred date & time slot, with distance-aware scheduling.',
    step4Title: 'AnekEk intelligently matches workers',
    step4Desc: 'Explainable AI balances verified skill, geographic proximity, and fair rotation queues.',
    step5Title: 'Worker completes job',
    step5Desc: 'Worker arrives, starts, completes task with masked in-app chat & call communication.',
    step6Title: 'Transparent payment distribution',
    step6Desc: 'Direct UPI demo settlement with 90% going straight to the worker without hidden charges.',
    step7Title: 'Cooperative value returned to community',
    step7Desc: '10% low commission is pooled into emergency welfare, health insurance, and member dividends.',

    // Pricing transparency
    pricingTitle: 'One Booking. Shared Value.',
    pricingSub: 'Complete transparency: see exactly where every rupee of your booking goes.',
    customerPays: 'Customer Pays',
    workerEarns: 'Worker Base Earning',
    coopCommission: 'Cooperative Share (10%)',
    welfarePool: 'Emergency Worker Welfare',
    insurancePool: 'Health & Accident Insurance',
    reinvestPool: 'Equipment & Collective Tools',
    dividendPool: 'Year-End Member Dividend',

    // Worker Dashboard Tabs
    tabDashboard: 'Dashboard',
    tabBookings: 'Bookings',
    tabRating: 'My Rating',
    tabVote: 'Vote & Decisions',
    tabIdeas: 'Ideas & Problems',

    // Customer Dashboard Tabs
    tabOverview: 'Overview',
    tabCurrent: 'Current Booking',
    tabHistory: 'Booking History',
    tabQueries: 'My Queries & Disputes',

    // Statuses
    statusRequested: 'Requested',
    statusAccepted: 'Accepted',
    statusOnTheWay: 'On The Way',
    statusStarted: 'Work Started',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    statusDisputed: 'Disputed',

    // Actions
    accept: 'Accept',
    reject: 'Reject',
    markOnWay: 'Mark: On The Way',
    markStarted: 'Mark: Started',
    markCompleted: 'Mark: Completed',
    rateWorker: 'Rate Worker',
    raiseDispute: 'Raise Dispute',
    chat: 'Chat',
    call: 'Masked Call',
  },
  hi: {
    // Brand & Nav
    brandName: 'अनेकेक',
    coopSub: 'श्रमिक-स्वामित्व वाली सहकारी संस्था',
    bookService: 'सेवा बुक करें',
    joinWorker: 'कार्यकर्ता के रूप में जुड़ें',
    login: 'लॉग इन करें',
    signup: 'साइन अप करें',
    logout: 'लॉग आउट',
    hiWorker: 'नमस्ते, श्रमिक साथी 👋',
    demoMode: 'डेमो मोड',
    switchRole: 'डेमो खाता बदलें',

    // Hero
    eyebrow: 'श्रमिक-स्वामित्व वाला सहकारी मंच',
    heroQuote: '"काम करने वाले हाथों के लिए न्याय। बुलाने वाले घरों का सच्चा विश्वास।"',
    heroSub: 'अनेकेक परिवारों और समुदायों को सत्यापित, श्रमिक-स्वामित्व वाले सेवा प्रदाताओं से जोड़ता है — जहाँ प्रत्येक श्रमिक मंच का सह-मालिक है, केवल एक लिस्टिंग नहीं।',
    enterLocation: 'अपना स्थान दर्ज करें (उदा. पवई, मुंबई)',
    findServices: 'सेवाएं खोजें',
    useLiveLocation: 'लाइव लोकेशन का उपयोग करें',
    locatingGps: 'जीपीएस के माध्यम से आपका स्थान खोजा जा रहा है...',
    gpsSuccess: 'स्थान सत्यापित: पवई, मुंबई (लाइव जीपीएस)',

    // Stat Strip
    statWorkers: 'श्रमिक-मालिक',
    statCollectives: 'सहकारी समूह',
    statCommission: 'औसत कमीशन',
    statCities: 'शहर',

    // Services
    servicesLabel: 'हमारी सेवाएं',
    servicesTitle: 'भरोसेमंद घरेलू व सामुदायिक सेवाएं',
    servicesSub: 'नीचे दिया गया प्रत्येक सेवा प्रदाता अनेकेक का सत्यापित सह-मालिक है।',
    workerOwned: 'श्रमिक-स्वामित्व',
    startingAt: 'शुरुआती दर',

    // How It Works (Requirement 47)
    howTitle: 'अनेकेक कैसे काम करता है',
    howSub: 'एक समुदाय-प्रथम मॉडल जहाँ गिग श्रमिक अपने डिजिटल बाज़ार के सह-मालिक हैं।',
    step1Title: 'श्रमिक सहकारी से जुड़ते हैं',
    step1Desc: 'कारीगर, सफाईकर्मी और देखभालकर्ता स्थानीय एसएचजी या श्रम महासंघों के माध्यम से पंजीकरण करते हैं।',
    step2Title: 'श्रमिक का सत्यापन होता है',
    step2Desc: 'आधार ई-केवाईसी और ट्रेड प्रमाणन सुरक्षित गोपनीयता के साथ सत्यापित किए जाते हैं।',
    step3Title: 'ग्राहक सेवा का अनुरोध करते हैं',
    step3Desc: 'परिवार अपनी जरूरत की सेवा, पसंदीदा दिन और समय चुनकर आसानी से अनुरोध दर्ज करते हैं।',
    step4Title: 'अनेकेक पारदर्शी रूप से मैच करता है',
    step4Desc: 'एआई कौशल, निकटतम दूरी और निष्पक्ष रोटेशन को मिलाकर काम का न्यायसंगत वितरण करता है।',
    step5Title: 'श्रमिक काम पूरा करते हैं',
    step5Desc: 'मास्क्ड सुरक्षित संचार के साथ श्रमिक समय पर पहुँचकर कुशलतापूर्वक काम पूरा करते हैं।',
    step6Title: 'पारदर्शी भुगतान वितरण',
    step6Desc: 'सीधा यूपीआई निपटान जिसमें 90% राशि बिना किसी छिपे शुल्क के सीधे श्रमिक को मिलती है।',
    step7Title: 'सहकारी मूल्य का समुदाय में पुनर्निवेश',
    step7Desc: '10% न्यूनतम कमीशन श्रमिक आपातकालीन कल्याण, बीमा और वार्षिक लाभांश में लौटता है।',

    // Pricing transparency
    pricingTitle: 'एक बुकिंग। साझा समृद्धि।',
    pricingSub: 'पूर्ण पारदर्शिता: देखें कि आपकी बुकिंग का प्रत्येक रुपया कहाँ जाता है।',
    customerPays: 'ग्राहक भुगतान',
    workerEarns: 'श्रमिक की शुद्ध कमाई',
    coopCommission: 'सहकारी अंश (10%)',
    welfarePool: 'आपातकालीन श्रमिक कल्याण',
    insurancePool: 'स्वास्थ्य एवं दुर्घटना बीमा',
    reinvestPool: 'सामूहिक उपकरण एवं विकास',
    dividendPool: 'वार्षिक सदस्य लाभांश',

    // Worker Dashboard Tabs
    tabDashboard: 'डैशबोर्ड',
    tabBookings: 'बुकिंग्स',
    tabRating: 'मेरी रेटिंग',
    tabVote: 'मतदान और निर्णय',
    tabIdeas: 'विचार और समस्याएं',

    // Customer Dashboard Tabs
    tabOverview: 'अवलोकन',
    tabCurrent: 'वर्तमान बुकिंग',
    tabHistory: 'बुकिंग इतिहास',
    tabQueries: 'मेरे प्रश्न और विवाद',

    // Statuses
    statusRequested: 'अनुरोधित',
    statusAccepted: 'स्वीकृत',
    statusOnTheWay: 'रास्ते में हैं',
    statusStarted: 'कार्य शुरू हुआ',
    statusCompleted: 'पूर्ण हुआ',
    statusCancelled: 'रद्द किया गया',
    statusDisputed: 'विवादित',

    // Actions
    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    markOnWay: 'चिह्नित करें: रास्ते में हैं',
    markStarted: 'चिह्नित करें: शुरू हुआ',
    markCompleted: 'चिह्नित करें: पूरा हुआ',
    rateWorker: 'रेटिंग दें',
    raiseDispute: 'शिकायत दर्ज करें',
    chat: 'बातचीत करें',
    call: 'सुरक्षित कॉल',
  },
};
