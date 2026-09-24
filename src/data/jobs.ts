import { JobCardData, Language } from '../types';

export interface RawJobDefinition {
  id: string;
  category: string;
  qp_code?: string;                      // e.g. ELE/Q1000
  sector?: string;                       // e.g. Electronics & Hardware
  iconName: 'lightbulb' | 'scissors' | 'wrench' | 'hammer' | 'bike' | 'sun' | 'tractor' | 'shield';
  nsqf_level: 1 | 2 | 3;
  base_stars: number;
  base_match_score: number;
  keywords: string[];
  title: Record<Language, string>;
  wage: Record<Language, string>;
  duration: Record<Language, string>;
  summary: Record<Language, string>;
  duties: Record<Language, string[]>;
  tools: Record<Language, string[]>;
  centre_name: Record<Language, string>;
  centre_address: Record<Language, string>;
  contact_person: Record<Language, string>;
  phone: string;
  helpline: string;
  stipend: Record<Language, string>;
  // Optional NSQF matcher enrichment (populated when API data is available)
  skill_gaps?: string[];
  qp_competencies?: string[];
  video_demo: {
    video_title: Record<Language, string>;
    scene_descriptions: Record<Language, string[]>;
    key_takeaway: Record<Language, string>;
  };
}

export const ALL_JOBS: RawJobDefinition[] = [
  {
    id: 'job_electrician',
    category: 'Electrical & Power',
    iconName: 'lightbulb',
    nsqf_level: 3,
    base_stars: 4,
    base_match_score: 92,
    keywords: ['electric', 'wire', 'current', 'motor', 'fan', 'light', 'wiring', 'மின்சாரம்', 'கம்பளி', 'மோட்டார்', 'மின்சார', 'बिजली', 'वायरिंग', 'करंट', 'मोटर'],
    title: {
      tamil: 'மின்சார தொழிலாளி (Electrician)',
      hindi: 'बिजली मिस्त्री (Electrician)',
      english: 'Electrician & Wireman',
    },
    wage: {
      tamil: '₹600 - ₹950 தினசரி',
      hindi: '₹600 - ₹950 प्रतिदिन',
      english: '₹600 - ₹950 per day',
    },
    duration: {
      tamil: '45 நாட்கள் (இலவச பயிற்சி)',
      hindi: '45 दिन (मुफ्त प्रशिक्षण)',
      english: '45 Days (Free Training)',
    },
    summary: {
      tamil: 'வீடுகள் மற்றும் கடைகளில் வயரிங், சுவிட்ச் பலகைகள், மோட்டார்கள் மற்றும் மின் இணைப்புகளைப் பழுதுபார்த்தல்.',
      hindi: 'घरों और दुकानों में वायरिंग, स्विच बोर्ड, पंखे, मोटर ठीक करना एवं नया कनेक्शन लगाना।',
      english: 'Home & commercial electrical wiring, circuit breakers, fan and motor repair, safety earthing.',
    },
    duties: {
      tamil: [
        'வீட்டு மின் வயரிங் மற்றும் பழுதுபார்த்தல்',
        'சுவிட்ச் போர்டு, மின்விசிறி மற்றும் மோட்டார் பொருத்துதல்',
        'பாதுகாப்பான எர்த்திங் மற்றும் மின் விபத்து தடுப்பு',
      ],
      hindi: [
        'घरेलू वायरिंग और खराबी की जांच',
        'स्विच बोर्ड, पंखा व मोटर इंस्टॉलेशन',
        'अर्थिंग और सुरक्षा उपकरणों का प्रयोग',
      ],
      english: [
        'Domestic electrical wiring and repairs',
        'Installation of switchboards, fans, and motors',
        'Safety earthing and circuit troubleshooting',
      ],
    },
    tools: {
      tamil: ['இலவச ஸ்க்ரூடிரைவர் கிட்', 'டெஸ்டர் & மல்டிமீட்டர்', 'பாதுகாப்பு கையுறைகள் மற்றும் காலணி'],
      hindi: ['मुफ्त स्क्रूड्राइवर किट', 'टेस्टर एवं मल्टीमीटर', 'सुरक्षा दस्ताने और जूते'],
      english: ['Free screwdriver toolkit', 'Voltage tester & multimeter', 'Safety gloves and insulated shoes'],
    },
    centre_name: {
      tamil: 'அரசு தொழிற்பயிற்சி மற்றும் திறன் மேம்பாட்டு மையம் (PMKK)',
      hindi: 'राजकीय कौशल विकास एवं प्रशिक्षण केंद्र (PMKK)',
      english: 'Govt Model Skill Development Centre (PMKK)',
    },
    centre_address: {
      tamil: 'மாவட்ட ஆட்சியர் அலுவலக சாலை, தொழிற்பேட்டை அருகில்',
      hindi: 'जिला कलेक्ट्रेट मार्ग, औद्योगिक क्षेत्र के पास',
      english: 'District Collectorate Road, Near Industrial Area',
    },
    contact_person: {
      tamil: 'திரு. கே. ராஜேந்திரன் (பயிற்சி ஒருங்கிணைப்பாளர்)',
      hindi: 'श्री के. राजेश (प्रशिक्षण अधिकारी)',
      english: 'Shri K. Rajesh (Training Coordinator)',
    },
    phone: '98401 23456',
    helpline: '1800-425-2424',
    stipend: {
      tamil: 'பயிற்சியின் போது தினசரி ₹150 உதவித்தொகை + மதிய உணவு',
      hindi: 'प्रशिक्षण के दौरान ₹150 दैनिक भत्ता + दोपहर का भोजन',
      english: '₹150 daily stipend during training + free lunch',
    },
    video_demo: {
      video_title: {
        tamil: '30 வினாடி நேரடி வேலை மாதிரி காட்சி',
        hindi: '30 सेकंड का कार्य प्रदर्शन',
        english: '30-Second Job Demonstration',
      },
      scene_descriptions: {
        tamil: [
          'காட்சி 1: புதிய வீடுகளில் குழாய் வழியாக வயர் இழுத்தல் மற்றும் டெஸ்டர் பரிசோதனை.',
          'காட்சி 2: சுவிட்ச் பலகையை பாதுகாப்பாக சுவரில் பொருத்துதல்.',
          'காட்சி 3: மின்விசிறி இயங்குவதை சரிபார்த்து வாடிக்கையாளரிடம் ஒப்படைத்தல்.',
        ],
        hindi: [
          'दृश्य 1: पाइप में तार डालना और टेस्टर से वोल्टेज नापना।',
          'दृश्य 2: स्विच बोर्ड को सुरक्षित रूप से दीवार पर कसना।',
          'दृश्य 3: कनेक्शन चालू करके काम पूरा करना।',
        ],
        english: [
          'Scene 1: Pulling wires safely through conduit and testing voltage.',
          'Scene 2: Installing switchboard with proper grounding.',
          'Scene 3: Verifying circuit operation and customer handover.',
        ],
      },
      key_takeaway: {
        tamil: 'சுயதொழில் மற்றும் கட்டுமான நிறுவனங்களில் நிரந்தர வேலை வாய்ப்பு.',
        hindi: 'स्वयं का काम या निजी कंपनियों में तुरंत रोजगार के अवसर।',
        english: 'Immediate self-employment and contractor opportunities.',
      },
    },
  },
  {
    id: 'job_tailor',
    category: 'Apparel & Fashion',
    iconName: 'scissors',
    nsqf_level: 2,
    base_stars: 4,
    base_match_score: 88,
    keywords: ['tailor', 'stitch', 'sew', 'cloth', 'dress', 'shirt', 'தையல்', 'துணி', 'சட்டை', 'தையல்காரர்', 'दर्जी', 'सिलाई', 'कपड़ा', 'सूट'],
    title: {
      tamil: 'தையல் கலைஞர் (Tailor & Garments)',
      hindi: 'सिलाई दर्जी (Tailor - Sewing Machine)',
      english: 'Apparel Sewing & Tailoring',
    },
    wage: {
      tamil: '₹550 - ₹850 தினசரி',
      hindi: '₹550 - ₹850 प्रतिदिन',
      english: '₹550 - ₹850 per day',
    },
    duration: {
      tamil: '30 நாட்கள் (இலவச பயிற்சி)',
      hindi: '30 दिन (मुफ्त प्रशिक्षण)',
      english: '30 Days (Free Training)',
    },
    summary: {
      tamil: 'ஆடைகள் வெட்டுதல், நவீன மின்சார தையல் இயந்திரம் இயக்குதல், சீருடைகள் மற்றும் பிளவுஸ் தைத்தல்.',
      hindi: 'कपड़ों की कटिंग, आधुनिक सिलाई मशीन चलाना, स्कूल यूनिफॉर्म और ब्लाउज तैयार करना।',
      english: 'Garment pattern cutting, electric sewing machine operation, school uniforms & tailoring.',
    },
    duties: {
      tamil: [
        'துணி அளவெடுத்து சரியான முறையில் வெட்டுதல்',
        'மோட்டார் தையல் இயந்திரத்தை விரைவாக இயக்குதல்',
        'பொத்தான்கள் மற்றும் ஜிப் தைத்து அழகுபடுத்துதல்',
      ],
      hindi: [
        'कपड़े का नाप लेकर कटाई करना',
        'इलेक्ट्रिक सिलाई मशीन पर तेज सिलाई',
        'बटन, काज व फिनिशिंग कार्य',
      ],
      english: [
        'Body measurement and fabric cutting',
        'Operating electric sewing machines',
        'Button stitching, zippers, and finishing',
      ],
    },
    tools: {
      tamil: ['இலவச தையல் கத்தரிக்கோல் & டேப்', 'ஊசி, நூல் தொகுப்பு', 'பயிற்சி முடிவில் தையல் இயந்திர மானியம்'],
      hindi: ['सिलाई कैंची व इंची टेप', 'सुई-धागा सेट', 'प्रशिक्षण पूर्ण होने पर मशीन सब्सिडी'],
      english: ['Tailoring scissors & tape measure', 'Needle & thread kit', 'Sewing machine subsidy scheme on completion'],
    },
    centre_name: {
      tamil: 'மகளிர் மற்றும் இளைஞர் திறன் வழிகாட்டல் மையம்',
      hindi: 'महिला एवं युवा रोजगार कौशल केंद्र',
      english: 'Youth & Women Livelihood Skill Centre',
    },
    centre_address: {
      tamil: 'பழைய பேருந்து நிலையம் பின்புறம், மகளிர் திட்ட கட்டிடம்',
      hindi: 'पुराने बस स्टैंड के पीछे, महिला विकास भवन',
      english: 'Behind Main Bus Stand, Vikas Bhawan',
    },
    contact_person: {
      tamil: 'திருமதி. எஸ். செல்வி (தையல் பயிற்றுனர்)',
      hindi: 'श्रीमती अनीता देवी (प्रशिक्षिका)',
      english: 'Mrs. S. Selvi (Master Tailor Trainer)',
    },
    phone: '98402 34567',
    helpline: '1800-425-2424',
    stipend: {
      tamil: 'இலவச உணவு + நிறைவில் அரசு சான்றிதழ்',
      hindi: 'मुफ्त भोजन + सरकारी कौशल प्रमाण पत्र',
      english: 'Free lunch + Govt Skill Certification',
    },
    video_demo: {
      video_title: {
        tamil: '30 வினாடி தையல் கலை விளக்க காட்சி',
        hindi: '30 सेकंड का सिलाई कार्य डेमो',
        english: '30-Second Tailoring Work Demo',
      },
      scene_descriptions: {
        tamil: [
          'காட்சி 1: சாக்பீஸ் கொண்டு துணியில் அளவுகளைக் குறித்து கத்தரித்தல்.',
          'காட்சி 2: மின்சார தையல் இயந்திரத்தில் நேர்த்தியாக தையல் போடுதல்.',
          'காட்சி 3: முழு ஆடையை இஸ்திரி செய்து விற்பனைக்கு தயார்ப்படுத்துதல்.',
        ],
        hindi: [
          'दृश्य 1: चॉक से कपड़े पर निशान लगाना और कैंची से काटना।',
          'दृश्य 2: मोटर वाली मशीन पर सीधी व पक्की सिलाई।',
          'दृश्य 3: तैयार कपड़े को प्रेस करके पैक करना।',
        ],
        english: [
          'Scene 1: Marking fabric with tailor chalk and precision cutting.',
          'Scene 2: High-speed neat stitching on modern machine.',
          'Scene 3: Ironing and packaging garment for customer delivery.',
        ],
      },
      key_takeaway: {
        tamil: 'வீட்டிலிருந்தே சுயதொழில் செய்யலாம் அல்லது ஆடை தயாரிப்பு நிறுவனங்களில் வேலை.',
        hindi: 'घर बैठे सिलाई का काम या गारमेंट फैक्ट्री में नौकरी।',
        english: 'Work from home or join apparel manufacturing units.',
      },
    },
  },
  {
    id: 'job_plumber',
    category: 'Plumbing & Water Works',
    iconName: 'wrench',
    nsqf_level: 2,
    base_stars: 3,
    base_match_score: 78,
    keywords: ['plumb', 'pipe', 'water', 'tap', 'leak', 'drain', 'குழாய்', 'தண்ணீர்', 'மோட்டார்', 'பைப்', 'नल', 'प्लंबर', 'पाइप', 'पानी', 'टैंक'],
    title: {
      tamil: 'குழாய் பழுதுபார்ப்பவர் (Plumber)',
      hindi: 'प्लंबर एवं पाइप कारीगर (Plumber)',
      english: 'Plumber & Sanitary Specialist',
    },
    wage: {
      tamil: '₹700 - ₹1,100 தினசரி',
      hindi: '₹700 - ₹1,100 प्रतिदिन',
      english: '₹700 - ₹1,100 per day',
    },
    duration: {
      tamil: '30 நாட்கள் (இலவச பயிற்சி)',
      hindi: '30 दिन (मुफ्त प्रशिक्षण)',
      english: '30 Days (Free Training)',
    },
    summary: {
      tamil: 'தண்ணீர் குழாய்கள் அமைத்தல், குழாய் கசிவு அடைத்தல், வாட்டர் டேங்க் மற்றும் மோட்டார் பொருத்துதல்.',
      hindi: 'पानी की नई पाइपलाइन बिछाना, लीकेज ठीक करना, पानी की टंकी और मोटर फिट करना।',
      english: 'Water pipeline laying, leak fixes, overhead tank and booster pump installation.',
    },
    duties: {
      tamil: [
        'CPVC, PVC குழாய்களை இணைத்தல் மற்றும் ஒட்டுதல்',
        'குழாய் கசிவை சரிசெய்து புதிய குழாய் பொருத்துதல்',
        'வாட்டர் ஹீட்டர் மற்றும் கழிப்பறை உபகரணங்கள் அமைத்தல்',
      ],
      hindi: [
        'पीवीसी पाइप की कटिंग और सॉल्वेंट जोड़ना',
        'नल की लीकेज बंद करना और नया नल लगाना',
        'पानी की टंकी व मोटर कनेक्शन करना',
      ],
      english: [
        'CPVC/PVC pipe cutting and solvent jointing',
        'Fixing leaky taps and bathroom fixtures',
        'Overhead tank plumbing and pump hookups',
      ],
    },
    tools: {
      tamil: ['இலவச பைப் ரெஞ்ச் & பிளையர்', 'ஹேக்சா பிரேம் மற்றும் டேப்', 'பாதுகாப்பு கண்ணாடிகள்'],
      hindi: ['पाइप रिंच एवं प्लास', 'हेक्सा आरी और टेफ्लॉन टेप', 'सुरक्षा किट'],
      english: ['Pipe wrench and water pump pliers', 'Hacksaw frame & Teflon tape', 'Protective eyewear'],
    },
    centre_name: {
      tamil: 'ரூட்செட் (RUDSETI) ஊரக சுயவேலைவாய்ப்பு பயிற்சி நிறுவனம்',
      hindi: 'आरसेटी (RUDSETI) ग्रामीण स्वरोजगार प्रशिक्षण संस्थान',
      english: 'RUDSETI Rural Self-Employment Training Centre',
    },
    centre_address: {
      tamil: 'காவல் நிலைய சாலை, தாலுகா அலுவலகம் எதிரில்',
      hindi: 'थाना रोड, तहसील कार्यालय के सामने',
      english: 'Station Road, Opposite Tehsil Complex',
    },
    contact_person: {
      tamil: 'திரு. எம். சண்முகம் (இயக்குனர்)',
      hindi: 'श्री सुरेश कुमार (प्रबंधक)',
      english: 'Mr. M. Shanmugam (Centre Lead)',
    },
    phone: '98403 45678',
    helpline: '1800-425-2424',
    stipend: {
      tamil: 'இலவச தங்குமிடம் + உணவு + கருவி தொகுப்பு',
      hindi: 'मुफ्त आवास + भोजन + संपूर्ण टूल किट',
      english: 'Free boarding + lodging + comprehensive toolkit',
    },
    video_demo: {
      video_title: {
        tamil: '30 வினாடி பிளம்பிங் செய்முறை காட்சி',
        hindi: '30 सेकंड का प्लंबिंग कार्य डेमो',
        english: '30-Second Plumbing Work Demo',
      },
      scene_descriptions: {
        tamil: [
          'காட்சி 1: பைப் கட்டர் மூலம் குழாயை நேராக வெட்டுதல்.',
          'காட்சி 2: டெப்லான் டேப் சுற்றி குழாயை ரெஞ்ச் மூலம் திருகி பொருத்துதல்.',
          'காட்சி 3: தண்ணீரை திறந்து கசிவு இல்லை என்பதை சரிபார்த்தல்.',
        ],
        hindi: [
          'दृश्य 1: पाइप कटर से पाइप को सही नाप में काटना।',
          'दृश्य 2: टेफ्लॉन टेप लगाकर रिंच से नल को कसना।',
          'दृश्य 3: पानी चालू करके लीकेज रहित फिटिंग की पुष्टि।',
        ],
        english: [
          'Scene 1: Clean square cut of water pipe using cutter.',
          'Scene 2: Applying Teflon tape and torquing with wrench.',
          'Scene 3: Turning on main valve to verify 100% leak-free flow.',
        ],
      },
      key_takeaway: {
        tamil: 'நகரங்கள் மற்றும் கிராமங்களில் தினமும் தொடர்ந்து தேவைப்படும் தொழில்.',
        hindi: 'गांव और शहर में रोज नकद कमाई वाला सदाबहार पेशा।',
        english: 'High demand in both rural homes and urban apartments.',
      },
    },
  },
  {
    id: 'job_twowheeler',
    category: 'Automotive Repair',
    iconName: 'bike',
    nsqf_level: 3,
    base_stars: 4,
    base_match_score: 85,
    keywords: ['bike', 'motorcycle', 'scooter', 'mechanic', 'auto', 'engine', 'பைக்', 'வாகனம்', 'மெக்கானிக்', 'மோட்டார்சைக்கிள்', 'बाइक', 'स्कूटर', 'मैकेनिक', 'गाड़ी'],
    title: {
      tamil: 'இருசக்கர வாகன மெக்கானிக் (Bike Mechanic)',
      hindi: 'बाइक एवं दोपहिया मैकेनिक (Two-Wheeler Mechanic)',
      english: 'Two-Wheeler Service Technician',
    },
    wage: {
      tamil: '₹700 - ₹1,200 தினசரி',
      hindi: '₹700 - ₹1,200 प्रतिदिन',
      english: '₹700 - ₹1,200 per day',
    },
    duration: {
      tamil: '60 நாட்கள் (இலவச பயிற்சி)',
      hindi: '60 दिन (मुफ्त प्रशिक्षण)',
      english: '60 Days (Free Training)',
    },
    summary: {
      tamil: 'பைக் சர்வீஸ், என்ஜின் ஆயில் மாற்றுதல், பிரேக் மற்றும் செயின் பழுதுபார்த்தல், மின்சார பைக் பராமரிப்பு.',
      hindi: 'बाइक की जनरल सर्विस, इंजन ऑयल बदलना, ब्रेक व चेन की मरम्मत तथा इलेक्ट्रिक बाइक का रखरखाव।',
      english: 'General motorcycle service, oil change, brake & chain overhaul, EV two-wheeler diagnostics.',
    },
    duties: {
      tamil: [
        'வழக்கமான என்ஜின் ஆயில் மற்றும் பில்டர் மாற்றுதல்',
        'பிரேக் ஷூ மற்றும் கிளட்ச் கேபிள் மாற்றுதல்',
        'மின்சார பைக் பேட்டரி மற்றும் மோட்டார் சோதனை',
      ],
      hindi: [
        'इंजन ऑयल और एयर फिल्टर बदलना',
        'ब्रेक शू व क्लच वायर की मरम्मत',
        'इलेक्ट्रिक स्कूटर बैटरी व मोटर जांच',
      ],
      english: [
        'Engine oil drain and air filter replacement',
        'Brake shoe overhaul and cable alignment',
        'Electric scooter battery check and wiring',
      ],
    },
    tools: {
      tamil: ['ஸ்பேனர் செட் & டி-ரெஞ்ச்', 'ஸ்பார்க் பிளக் டூல்', 'டயர் பிரஷர் கேஜ்'],
      hindi: ['पाना-रिंच सेट और टी-हैंडल', 'प्लग पाने', 'टायर प्रेशर गेज'],
      english: ['Ring spanner set & T-handles', 'Spark plug socket wrench', 'Tyre pressure gauge'],
    },
    centre_name: {
      tamil: 'அரசு ஆட்டோமொபைல் சிறப்பு பயிற்சி கூடம்',
      hindi: 'राजकीय वाहन तकनीकी प्रशिक्षण संस्थान',
      english: 'Govt Automotive Technical Training Centre',
    },
    centre_address: {
      tamil: 'தேசிய நெடுஞ்சாலை அருகே, தொழிற்பேட்டை வளாகம்',
      hindi: 'राष्ट्रीय राजमार्ग, ऑटो हब के पास',
      english: 'National Highway Bypass, Auto Tech Zone',
    },
    contact_person: {
      tamil: 'திரு. பி. முனியப்பன் (தலைமை பயிற்றுனர்)',
      hindi: 'श्री धर्मेन्द्र कुमार (मुख्य प्रशिक्षक)',
      english: 'Mr. P. Muniyappan (Lead Instructor)',
    },
    phone: '98404 56789',
    helpline: '1800-425-2424',
    stipend: {
      tamil: 'தினசரி ₹150 + உணவு + பணிமனையில் நேரடி பயிற்சி',
      hindi: 'दैनिक ₹150 + भोजन + वर्कशॉप में लाइव ट्रेनिंग',
      english: '₹150 daily stipend + food + hands-on workshop training',
    },
    video_demo: {
      video_title: {
        tamil: '30 வினாடி பைக் சர்வீஸ் செயல்முறை',
        hindi: '30 सेकंड का बाइक सर्विस डेमो',
        english: '30-Second Bike Service Demo',
      },
      scene_descriptions: {
        tamil: [
          'காட்சி 1: பழைய ஆயில் கழற்றி புதிய என்ஜின் ஆயில் ஊற்றுதல்.',
          'காட்சி 2: பிரேக் இறுக்கி சக்கரத்தின் சுழற்சியை சரிபார்த்தல்.',
          'காட்சி 3: எலக்ட்ரிக் ஸ்டார்ட் போட்டு என்ஜின் ஒலியை சோதித்தல்.',
        ],
        hindi: [
          'दृश्य 1: पुराना मोबिल ऑयल निकालना व नया तेल डालना।',
          'दृश्य 2: ब्रेक की सेटिंग और पहिया घुमाकर जांच।',
          'दृश्य 3: सेल्फ स्टार्ट दबाकर इंजन की आवाज चेक करना।',
        ],
        english: [
          'Scene 1: Draining old oil and refilling fresh synthetic engine oil.',
          'Scene 2: Calibrating brake play and inspecting chain tension.',
          'Scene 3: Electric push start and smooth throttle testing.',
        ],
      },
      key_takeaway: {
        tamil: 'கிராமங்களிலும் நகரங்களிலும் சொந்த பட்டறை தொடங்க சிறந்த வாய்ப்பு.',
        hindi: 'अपना खुद का गैराज खोलने के लिए सबसे भरोसेमंद काम।',
        english: 'Ideal for starting your own neighborhood garage.',
      },
    },
  },
  {
    id: 'job_solar',
    category: 'Renewable Energy',
    iconName: 'sun',
    nsqf_level: 3,
    base_stars: 4,
    base_match_score: 83,
    keywords: ['solar', 'sun', 'panel', 'battery', 'inverter', 'green', 'சூரிய ஒளி', 'சோலார்', 'பேட்டரி', 'सौर', 'सोलर', 'पैनल', 'बैटरी'],
    title: {
      tamil: 'சூரிய மின்பலகை உதவியாளர் (Solar Technician)',
      hindi: 'सोलर पैनल तकनीशियन (Solar Technician)',
      english: 'Solar Panel Installation Assistant',
    },
    wage: {
      tamil: '₹650 - ₹1,000 தினசரி',
      hindi: '₹650 - ₹1,000 प्रतिदिन',
      english: '₹650 - ₹1,000 per day',
    },
    duration: {
      tamil: '30 நாட்கள் (இலவச பயிற்சி)',
      hindi: '30 दिन (मुफ्त प्रशिक्षण)',
      english: '30 Days (Free Training)',
    },
    summary: {
      tamil: 'கூரை மீது சூரிய மின் தகடுகள் பொருத்துதல், இன்வெர்ட்டர் மற்றும் பேட்டரி இணைப்பு செய்தல்.',
      hindi: 'छत पर सोलर प्लेट लगाना, इन्वर्टर और बैटरी के कनेक्शन जोड़ना।',
      english: 'Rooftop solar panel mounting, inverter wiring, and battery storage connections.',
    },
    duties: {
      tamil: [
        'சூரிய பலகைகளை இரும்பு சட்டத்தில் இறுக்குதல்',
        'MC4 இணைப்பிகள் மூலம் ஒயரிங் செய்தல்',
        'இன்வெர்ட்டரில் சோலார் மின்சாரத்தை சோதித்தல்',
      ],
      hindi: [
        'छत पर स्ट्रक्चर कसकर सोलर प्लेट लगाना',
        'एमसी4 कनेक्टर से सही वायरिंग करना',
        'इन्वर्टर और मीटर की रीडिंग चेक करना',
      ],
      english: [
        'Mounting solar modules on rooftop structure',
        'Crimping and connecting MC4 weather-proof cables',
        'Inverter sync and grid meter check',
      ],
    },
    tools: {
      tamil: ['இன்சுலேட்டட் டூல் கிட்', 'சோலார் கேபிள் கிரிம்பர்', 'பாதுகாப்பு பெல்ட் மற்றும் தலைக்கவசம்'],
      hindi: ['इंसुलेटेड टूल किट', 'सोलर केबल क्रिम्पर', 'सेफ्टी बेल्ट व हेलमेट'],
      english: ['Insulated torque wrench kit', 'Solar cable crimper', 'Safety harness belt and helmet'],
    },
    centre_name: {
      tamil: 'சூரிய சக்தி மற்றும் பசுமை ஆற்றல் திறன் மையம்',
      hindi: 'नवीन एवं नवीकरणीय ऊर्जा कौशल केंद्र',
      english: 'Green Energy & Solar Skilling Centre',
    },
    centre_address: {
      tamil: 'மின்வாரிய அலுவலகம் அருகில், மெயின் ரோடு',
      hindi: 'बिजली बोर्ड कार्यालय के पास, मुख्य मार्ग',
      english: 'Near State Electricity Board, Sub-Station Road',
    },
    contact_person: {
      tamil: 'திரு. எஸ். குமார் (பசுமை திறன் மேலாளர்)',
      hindi: 'श्री रवि वर्मा (ऊर्जा सलाहकार)',
      english: 'Mr. S. Kumar (Solar Projects Lead)',
    },
    phone: '98405 67890',
    helpline: '1800-425-2424',
    stipend: {
      tamil: 'அரசு உதவித்தொகை ₹3,000 + இலவச சான்றிதழ்',
      hindi: 'सरकारी वजीफा ₹3,000 + प्रमाण पत्र',
      english: '₹3,000 Govt Training Allowance + Certificate',
    },
    video_demo: {
      video_title: {
        tamil: '30 வினாடி சோலார் தகடு பொருத்தும் காட்சி',
        hindi: '30 सेकंड का सोलर पैनल इंस्टॉलेशन डेमो',
        english: '30-Second Solar Panel Work Demo',
      },
      scene_descriptions: {
        tamil: [
          'காட்சி 1: கூரையில் அலுமினிய சட்டத்தை நட்டு போல்ட் மூலம் பொருத்துதல்.',
          'காட்சி 2: சோலார் பலகையை தூக்கி வைத்து நட்டுகளை இறுக்குதல்.',
          'காட்சி 3: இன்வெர்ட்டரில் பச்சை விளக்கு எரிவதை உறுதிசெய்தல்.',
        ],
        hindi: [
          'दृश्य 1: छत पर एल्युमिनियम फ्रेम को कसना।',
          'दृश्य 2: सोलर प्लेट को सुरक्षित रखकर बोल्ट टाइट करना।',
          'दृश्य 3: इन्वर्टर पर हरी बत्ती जलने की जांच।',
        ],
        english: [
          'Scene 1: Securing aluminum mounting rails on rooftop.',
          'Scene 2: Placing solar panels and torquing mid-clamps.',
          'Scene 3: Inverter activation and verifying green power light.',
        ],
      },
      key_takeaway: {
        tamil: 'PM சூரிய கார் யோஜனா திட்டத்தின் கீழ் நாடெங்கும் அதிக வேலைவாய்ப்பு.',
        hindi: 'पीएम सूर्य घर योजना के तहत हर गांव व शहर में रोजगार।',
        english: 'High nationwide hiring under PM Surya Ghar Muft Bijli Yojana.',
      },
    },
  },
  {
    id: 'job_farm_machinery',
    category: 'Agriculture & Machinery',
    iconName: 'tractor',
    nsqf_level: 1,
    base_stars: 3,
    base_match_score: 75,
    keywords: ['farm', 'agriculture', 'tractor', 'field', 'dairy', 'crop', 'பண்ணை', 'விவசாயம்', 'டிராக்டர்', 'வயல்', 'மாடு', 'खेती', 'कृषि', 'ट्रैक्टर', 'खेत', 'डेयरी'],
    title: {
      tamil: 'விவசாய இயந்திர ஆபரேட்டர் (Farm Equipment & Dairy)',
      hindi: 'कृषि उपकरण व डेयरी सहायक (Farm Machinery Operator)',
      english: 'Farm Machinery Operator & Dairy Specialist',
    },
    wage: {
      tamil: '₹500 - ₹800 தினசரி',
      hindi: '₹500 - ₹800 प्रतिदिन',
      english: '₹500 - ₹800 per day',
    },
    duration: {
      tamil: '21 நாட்கள் (இலவச பயிற்சி)',
      hindi: '21 दिन (मुफ्त प्रशिक्षण)',
      english: '21 Days (Free Training)',
    },
    summary: {
      tamil: 'டிராக்டர் கருவிகள், பவர்டில்லர், நெல் நடவு மற்றும் கதிர் அறுக்கும் இயந்திரங்களை இயக்குதல்.',
      hindi: 'ट्रैक्टर उपकरण, पावर टिलर, धान रोपाई व फसल कटाई मशीन चलाना।',
      english: 'Operating modern power tillers, seed drills, harvesters, and dairy equipment.',
    },
    duties: {
      tamil: [
        'பவர் டில்லர் மூலம் வயலை உழுதல்',
        'சொட்டு நீர் பாசன குழாய்களை அமைத்தல்',
        'இயந்திரம் மூலம் பால் கறத்தல் மற்றும் சேமித்தல்',
      ],
      hindi: [
        'पावर टिलर से खेत की जुताई',
        'ड्रिप सिंचाई पाइपलाइन का रख-रखाव',
        'मिल्किंग मशीन से स्वच्छ दूध निकालना',
      ],
      english: [
        'Land preparation using mini power tillers',
        'Drip irrigation assembly and maintenance',
        'Hygienic dairy machine milking and chilling',
      ],
    },
    tools: {
      tamil: ['இலவச உழவர் கையேடு & கருவிப் பை', 'பாதுகாப்பு கவச உடை', 'முதலுதவி பெட்டி'],
      hindi: ['कृषि उपकरण किट', 'गमबूट और सुरक्षा कपड़े', 'प्राथमिक चिकित्सा किट'],
      english: ['Farm machinery hand tools', 'Safety gumboots and protective gear', 'First-aid kit'],
    },
    centre_name: {
      tamil: 'வேளாண் அறிவியல் நிலையம் (KVK)',
      hindi: 'कृषि विज्ञान केंद्र (KVK)',
      english: 'Krishi Vigyan Kendra (KVK)',
    },
    centre_address: {
      tamil: 'விவசாய ஆராய்ச்சி வளாகம், மெயின் ரோடு',
      hindi: 'कृषि अनुसंधान फार्म, मुख्य मार्ग',
      english: 'Farm Research Complex, Main Highway',
    },
    contact_person: {
      tamil: 'முனைவர். ஆர். இளங்கோ (முதன்மை விஞ்ஞானி)',
      hindi: 'डॉ. रमेश शर्मा (वरिष्ठ वैज्ञानिक)',
      english: 'Dr. R. Elango (KVK Head & Senior Scientist)',
    },
    phone: '98406 78901',
    helpline: '1800-425-2424',
    stipend: {
      tamil: 'இலவச உணவு + சான்றிதழ் + மானிய கடன் ஆலோசனை',
      hindi: 'मुफ्त भोजन + प्रमाण पत्र + सरकारी ऋण सहायता',
      english: 'Free food + certificate + subsidized loan guidance',
    },
    video_demo: {
      video_title: {
        tamil: '30 வினாடி விவசாய இயந்திர இயக்கம்',
        hindi: '30 सेकंड का आधुनिक कृषि मशीन डेमो',
        english: '30-Second Modern Agri Machinery Demo',
      },
      scene_descriptions: {
        tamil: [
          'காட்சி 1: பவர் டில்லரை ஸ்டார்ட் செய்து சீராக வயலை உழுதல்.',
          'காட்சி 2: சொட்டு நீர் குழாய்களை இணைத்து நீர்ப் பாசனத்தை சோதித்தல்.',
          'காட்சி 3: பால் கறவை இயந்திரம் மூலம் சுத்தமாக பால் எடுப்பது.',
        ],
        hindi: [
          'दृश्य 1: पावर टिलर शुरू करके खेत की जुताई।',
          'दृश्य 2: ड्रिप पाइप जोड़कर पानी का दबाव चेक करना।',
          'दृश्य 3: स्वच्छ डेयरी मशीन से दूध संकलन।',
        ],
        english: [
          'Scene 1: Easy pull start and steady tilling of farm soil.',
          'Scene 2: Laying drip emitters and checking uniform pressure.',
          'Scene 3: Vacuum dairy milking unit clean operation.',
        ],
      },
      key_takeaway: {
        tamil: 'குறைந்த உடல் உழைப்பில் அதிக வருமானம் தரும் நவீன வேளாண் தொழில்.',
        hindi: 'कम मेहनत में ज्यादा आमदनी वाला आधुनिक कृषि रोजगार।',
        english: 'Modern mechanized farm techniques with low physical strain.',
      },
    },
  },
];

export function getLocalizedJobCard(jobDef: RawJobDefinition, lang: Language): JobCardData {
  return {
    id: jobDef.id,
    title: jobDef.title[lang],
    title_en: jobDef.title.english,
    title_ta: jobDef.title.tamil,
    title_hi: jobDef.title.hindi,
    category: jobDef.category,
    qp_code: jobDef.qp_code,
    sector: jobDef.sector ?? jobDef.category,
    iconName: jobDef.iconName,
    nsqf_level: jobDef.nsqf_level,
    match_score: jobDef.base_match_score,
    stars: jobDef.base_stars,
    wage_estimate: jobDef.wage[lang],
    training_duration: jobDef.duration[lang],
    summary: jobDef.summary[lang],
    duties: jobDef.duties[lang],
    tools_provided: jobDef.tools[lang],
    // Skill gap data — populated by NSQF matcher when available, else empty
    skill_gaps: jobDef.skill_gaps ?? [],
    qp_competencies: jobDef.qp_competencies ?? jobDef.duties[lang],
    nearest_centre: {
      name: jobDef.centre_name[lang],
      address: jobDef.centre_address[lang],
      contact_person: jobDef.contact_person[lang],
      phone: jobDef.phone,
      helpline: jobDef.helpline,
      stipend_info: jobDef.stipend[lang],
    },
  };
}

export function recommendTop3Jobs(
  transcript: string,
  education: string,
  currentWork: string,
  interests: string,
  lang: Language
): JobCardData[] {
  const combinedText = `${transcript} ${education} ${currentWork} ${interests}`.toLowerCase();

  // Score each job + derive skill gaps from keyword misses
  const scored = ALL_JOBS.map((job) => {
    let score = job.base_match_score;
    let stars = job.base_stars;

    const matches = job.keywords.filter((kw) => combinedText.includes(kw.toLowerCase()));
    if (matches.length > 0) {
      score = Math.min(98, score + matches.length * 6);
      stars = Math.min(5, Math.max(4, Math.round(score / 20)));
    }

    // Derive skill gaps: duties that are unlikely to be known given keyword misses
    const derivedGaps: string[] = job.skill_gaps ?? [];
    const card = getLocalizedJobCard(job, lang);

    // Build a lightweight score_breakdown for the UI
    const interestPts = matches.length >= 3 ? 40 : matches.length >= 1 ? 25 : 0;
    const eduKeywords = ['10th', 'sslc', 'matric', '8th', 'class', 'school', 'pass'];
    const eduMatch = eduKeywords.some((k) => combinedText.includes(k));
    const eduPts = eduMatch ? 30 : 20;
    const mobPts = 10; // neutral default
    const prefPts = 5; // neutral default

    return {
      ...card,
      match_score: score,
      stars,
      skill_gaps: derivedGaps,
      score_breakdown: {
        education: eduPts,
        interest: interestPts,
        mobility: mobPts,
        preference: prefPts,
      },
    };
  });

  // Sort descending by match_score
  scored.sort((a, b) => b.match_score - a.match_score);

  // Return exactly top 3
  return scored.slice(0, 3);
}
