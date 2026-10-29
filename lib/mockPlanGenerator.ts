import { EventFormData, LLMPlanOutput, VendorItem } from '@/types';
import { recomputeAmounts } from './budgetMath';
import { calculateTimelineDates } from './dateUtils';
import { getRealCityData, RealVenue, RealVendor } from './realIndiaDatabase';
import {
  CURATED_VISUALS,
  getVendorImage,
  calculateVendorPaymentMilestones,
  generateRunOfShow,
  generateGuestStats,
} from './visualAssets';

/**
 * Intelligent India-first generator that synthesizes hyper-realistic event plans
 * with verified local venues, real named vendors, regional cuisine menus, and statutory rules.
 */
export function generateMockEventPlan(formData: EventFormData): LLMPlanOutput {
  const {
    eventType,
    eventName,
    totalBudget,
    guestCount,
    city,
    locality,
    venueName,
    eventDate,
    weddingSubEvents,
    communityType,
    birthdayCategory,
  } = formData;

  const cityData = getRealCityData(city);

  // Pick realistic venue from database or create one based on user's choice
  let selectedVenue: RealVenue = cityData.venues[0];
  if (venueName) {
    const matched = cityData.venues.find(
      (v) => v.name.toLowerCase().includes(venueName.toLowerCase()) || venueName.toLowerCase().includes(v.name.toLowerCase())
    );
    if (matched) selectedVenue = matched;
    else {
      selectedVenue = {
        id: 'custom-venue',
        name: venueName,
        type: formData.venueType === 'banquet_hall' ? 'Banquet Hall' : 'Open Lawn / Club',
        locality: locality || cityData.popularLocalities[0],
        city: cityData.city,
        capacity: `${guestCount} - ${Math.round(guestCount * 1.5)} guests`,
        pricingTier: totalBudget > 2000000 ? 'Luxury' : totalBudget > 800000 ? 'Premium' : 'Mid-Range',
        address: `${venueName}, ${locality || cityData.popularLocalities[0]}, ${cityData.city}, ${cityData.state}`,
        rating: 4.6,
        highlights: ['Central AC', 'Dedicated live kitchen', 'Ample guest parking'],
        mapsQuery: encodeURIComponent(`${venueName} ${cityData.city}`),
      };
    }
  } else if (locality) {
    const matched = cityData.venues.find((v) => v.locality.toLowerCase().includes(locality.toLowerCase()));
    if (matched) selectedVenue = matched;
  }

  const venueImageUrl = eventType === 'wedding'
    ? (totalBudget >= 2000000 ? CURATED_VISUALS.venues.wedding_palace : CURATED_VISUALS.venues.wedding_resort)
    : eventType === 'birthday'
    ? CURATED_VISUALS.venues.birthday_lawn
    : eventType === 'community'
    ? CURATED_VISUALS.venues.festival_ground
    : CURATED_VISUALS.venues.banquet_hall;

  const enrichedVenue = {
    ...selectedVenue,
    imageUrl: venueImageUrl,
    distanceInfo: `Prime locality in ${selectedVenue.locality} • ~6.5 km from central junction`,
    parkingSpots: guestCount >= 300 ? 150 : 60,
  };

  const enrichVendor = (v: VendorItem): VendorItem => ({
    ...v,
    imageUrl: v.imageUrl || getVendorImage(v.category),
    paymentMilestones: v.paymentMilestones || calculateVendorPaymentMilestones(v.estimatedCost),
  });

  // Civic & Statutory Compliance info
  const civicCompliance = {
    soundCurfew: cityData.policeSoundCurfewRules,
    municipalOffice: cityData.municipalOfficeName,
    flowerMarket: cityData.flowerMarketName,
    fireNocRequired: guestCount >= 200 || formData.venueType === 'society_ground',
  };

  if (eventType === 'wedding') {
    const rawCategories = [
      { name: 'Catering & Dining (Shahi Bhojan)', percentage: 35, amount: 0, notes: `Multi-course ${cityData.state} regional banquet, live street chaat counter, dessert studio & welcome drinks` },
      { name: 'Venue & Lawn/Banquet Rental', percentage: 22, amount: 0, notes: `${selectedVenue.name} (${selectedVenue.locality}) - main hall, mandap space, green rooms & parking` },
      { name: 'Decor, Mandap & Lighting', percentage: 15, amount: 0, notes: `Fresh floral marigold/jasmine mandap from ${cityData.flowerMarketName}, fairy lights & entrance arch` },
      { name: 'Photography & Cinematography', percentage: 10, amount: 0, notes: 'Traditional & candid photographers, drone coverage, teaser video & wedding album' },
      { name: 'Bridal Makeup, Mehendi & Styling', percentage: 6, amount: 0, notes: 'HD bridal makeup for 2 events, family mehendi artist squad, hair styling' },
      { name: 'Sound, DJ, Sangeet Choreographer', percentage: 5, amount: 0, notes: 'Sound setup adhering to 10 PM sound curfew, wireless mics for pheras, DJ night & folk singer' },
      { name: 'Panditji, Samagri & Rituals', percentage: 3, amount: 0, notes: `Experienced ${cityData.state} Vedic priest, havan kund samagri, muhurat coordination` },
      { name: 'Invitations & Guest Return Favors', percentage: 4, amount: 0, notes: 'Digital e-invites, printed wedding cards for elders, sweets hamper / return gifts' },
    ];

    const budgetCategories = recomputeAmounts(rawCategories, totalBudget);

    const savingTips = [
      `Source fresh flowers directly from ${cityData.flowerMarketName} early morning (5:00 AM) to save 30% on florist agency markup.`,
      `Consolidate Haldi and Mehendi into daytime pool/lawn slots at ${selectedVenue.name} to negotiate 15% lower venue rental charges.`,
      `Offer digital save-the-dates via WhatsApp video invites, printing luxury hard copies only for elderly family members.`,
      `Opt for authentic local seasonal delicacies (${cityData.regionalSpecialties.mithai[0]} & ${cityData.regionalSpecialties.drinks[0]}) rather than out-of-season imported fruits.`,
    ];

    const rawTimeline = [
      { phase: 'Phase 1: Foundation & Muhurat', daysBeforeEvent: 120, task: `Finalize auspicious lagna muhurat with Panditji and lock booking contract at ${selectedVenue.name} (${selectedVenue.locality})`, priority: 'high' as const },
      { phase: 'Phase 1: Foundation & Muhurat', daysBeforeEvent: 100, task: `Schedule live catering tasting session and establish Jain/Pure Veg and allergy counters in ${city}`, priority: 'high' as const },
      { phase: 'Phase 2: Creative & Vendors', daysBeforeEvent: 75, task: `Book verified candid photographer & cinematography crew and bridal makeup specialist in ${city}`, priority: 'high' as const },
      { phase: 'Phase 2: Creative & Vendors', daysBeforeEvent: 60, task: `Send WhatsApp Save-the-Date video and finalize floral mandap theme with fresh blooms from ${cityData.flowerMarketName}`, priority: 'medium' as const },
      { phase: 'Phase 3: Outfits & Entertainment', daysBeforeEvent: 45, task: 'Complete bridal lehenga & groom sherwani trials; start Sangeet dance rehearsals with family choreo', priority: 'medium' as const },
      { phase: 'Phase 3: Outfits & Entertainment', daysBeforeEvent: 30, task: `Order personalized wedding favors (${cityData.regionalSpecialties.mithai[1]} hampers & brass coin pouches)`, priority: 'medium' as const },
      { phase: 'Phase 4: Final Sprint', daysBeforeEvent: 14, task: `Confirm guest RSVP count with caterer and arrange hotel rooms & airport/station pick-ups in ${city}`, priority: 'high' as const },
      { phase: 'Phase 4: Final Sprint', daysBeforeEvent: 3, task: `Stage sound check (verifying 10 PM cutoff), collect dry havan samagri, and review ritual run-order with Panditji`, priority: 'high' as const },
    ];

    const { timeline } = calculateTimelineDates(rawTimeline, eventDate);

    // Map Real Vendors from Database
    const catererVendor = cityData.topVendors.find((v) => v.category.includes('Caterer')) || cityData.topVendors[0];
    const decoratorVendor = cityData.topVendors.find((v) => v.category.includes('Decorator')) || cityData.topVendors[1] || cityData.topVendors[0];
    const photoVendor = cityData.topVendors.find((v) => v.category.includes('Photographer')) || cityData.topVendors[2] || cityData.topVendors[0];
    const priestVendor = cityData.topVendors.find((v) => v.category.includes('Panditji') || v.category.includes('Priest')) || cityData.topVendors[3] || cityData.topVendors[0];
    const soundVendor = cityData.topVendors.find((v) => v.category.includes('Sound') || v.category.includes('DJ')) || cityData.topVendors[4] || cityData.topVendors[0];

    const vendors: VendorItem[] = [
      {
        category: 'Caterer & Halwai',
        estimatedCost: Math.round(totalBudget * 0.35),
        bookBy: timeline[1]?.dueDate || eventDate,
        vendorName: catererVendor?.name || `${city} Shahi Royal Caterers`,
        vendorAddress: catererVendor?.address || `Station Road, ${city}`,
        vendorPhone: catererVendor?.phone || '+91 98252 XXXXX',
        rating: catererVendor?.rating || 4.9,
        reviewCount: catererVendor?.reviewCount || 310,
        verifiedBadge: catererVendor?.verifiedBadge || 'FSSAI Certified • 100% Pure Ghee & Jain Utensils',
        specialty: catererVendor?.specialty || cityData.regionalSpecialties.mains.slice(0, 3).join(', '),
        checklist: [
          'Verify FSSAI food safety license and hygiene standards of live kitchen stations',
          'Confirm dedicated Jain / Swaminarayan cooking utensils and pure ghee certification',
          `Finalize menu for each event: High Tea, Mehendi chaat, Sangeet dinner, Pheras snacks`,
          'Agree on waiter-to-guest ratio (minimum 1 waiter per 15 guests for buffet, 1 per 5 for sit-down)',
        ],
        questionsToAsk: [
          'Do you supply bone-china crockery, table linen, and servers or is that via the decorator?',
          'What is your cancellation or headcount modification policy up to 48 hours before?',
          'Can we arrange a 5-person live tasting session with the head chef before final token advance?',
        ],
      },
      {
        category: 'Venue & Banquet Hall',
        estimatedCost: Math.round(totalBudget * 0.22),
        bookBy: timeline[0]?.dueDate || eventDate,
        vendorName: selectedVenue.name,
        vendorAddress: selectedVenue.address,
        vendorPhone: '+91 2832 XXXXX',
        rating: selectedVenue.rating,
        reviewCount: 420,
        verifiedBadge: `Verified Property • ${selectedVenue.pricingTier} Tier`,
        specialty: selectedVenue.highlights.join(' • '),
        checklist: [
          `Verify air conditioning capacity, backup DG generators, and green rooms availability at ${selectedVenue.name}`,
          `Confirm music permits and local police 10:00 PM sound curfew guidelines (${cityData.policeSoundCurfewRules})`,
          `Check dedicated parking space with valet facility for ${guestCount} guests`,
        ],
        questionsToAsk: [
          'Are there royalty charges if we bring outside decorators or sound vendors?',
          'What exact time can the decorator begin mandap setup on event morning?',
          'Is complimentary bridal suite room included in the package?',
        ],
      },
      {
        category: 'Decorator & Mandap Artisan',
        estimatedCost: Math.round(totalBudget * 0.15),
        bookBy: timeline[3]?.dueDate || eventDate,
        vendorName: decoratorVendor?.name || `${city} Mandap & Floral Decorators`,
        vendorAddress: decoratorVendor?.address || `Near Phool Mandi, ${city}`,
        vendorPhone: decoratorVendor?.phone || '+91 94278 XXXXX',
        rating: decoratorVendor?.rating || 4.8,
        reviewCount: decoratorVendor?.reviewCount || 240,
        verifiedBadge: decoratorVendor?.verifiedBadge || `Direct from ${cityData.flowerMarketName}`,
        specialty: decoratorVendor?.specialty || 'Marigold & Mogra Mandaps, Heritage Backdrops, Fairy Light Canopies',
        checklist: [
          'Review 3D render of the Mandap, entrance passage, photo booth, and stage',
          `Confirm type of flowers (fresh marigold from ${cityData.flowerMarketName}, tuberoses, carnations)`,
          'Check stage lighting, focus spots on bride/groom, and ambient warm fairy lights',
        ],
        questionsToAsk: [
          'Will you handle flower disposal and clean up post-pherams?',
          'Can floral elements from the daytime Haldi backdrop be repurposed for the evening reception?',
        ],
      },
      {
        category: 'Photographer & Cinematographer',
        estimatedCost: Math.round(totalBudget * 0.10),
        bookBy: timeline[2]?.dueDate || eventDate,
        vendorName: photoVendor?.name || `${city} Wedding Cinema Studio`,
        vendorAddress: photoVendor?.address || `Hospital Road, ${city}`,
        vendorPhone: photoVendor?.phone || '+91 97129 XXXXX',
        rating: photoVendor?.rating || 4.9,
        reviewCount: photoVendor?.reviewCount || 195,
        verifiedBadge: photoVendor?.verifiedBadge || '4K Cinematic Drone Pilot • WedMeGood Featured',
        specialty: photoVendor?.specialty || 'Cinematic wedding film teaser, raw footage on SSD, candid portrait albums',
        checklist: [
          'Review portfolio of recent wedding albums and cinematic Instagram reels in ' + city,
          'Ensure contract explicitly states deliverables (number of edited photos, raw video, drone reels, printed photobooks)',
          'Confirm crew size (2 candid photographers, 2 traditional video operators, 1 drone pilot)',
        ],
        questionsToAsk: [
          'What is the turnaround time for receiving the teaser video and edited wedding album?',
          'Do you provide raw footage on a portable hard drive?',
        ],
      },
      {
        category: 'Panditji / Vedic Priest',
        estimatedCost: Math.round(totalBudget * 0.03),
        bookBy: timeline[0]?.dueDate || eventDate,
        vendorName: priestVendor?.name || `Panditji (${cityData.state} Vedic Rites)`,
        vendorAddress: priestVendor?.address || `Near Heritage Temple, ${city}`,
        vendorPhone: priestVendor?.phone || '+91 98980 XXXXX',
        rating: priestVendor?.rating || 5.0,
        reviewCount: priestVendor?.reviewCount || 390,
        verifiedBadge: priestVendor?.verifiedBadge || 'Vedic Sanskrit Pathshala Scholar',
        specialty: priestVendor?.specialty || 'Bilingual explanation of Sapthapadi vows, Lagna Geet muhurat, authentic Havan samagri',
        checklist: [
          `Verify specific regional rites (${cityData.state} traditions, Lagna Geet, Hastamelap)`,
          'Obtain full list of Puja Samagri (dry fruits, coconuts, ghee, gangajal, vastra)',
          'Agree on exact Muhurat timings and estimated duration of Pheras ceremony',
        ],
        questionsToAsk: [
          'Do you provide the brass havan kund and puja essentials or should we purchase?',
          'Can you explain the meaning of the Sapthapadi vows in English/Hindi for younger guests?',
        ],
      },
    ];

    const muhuratDetails = {
      shubhMuhurat: '11:42 AM - 01:15 PM (Auspicious Godhuli / Abhijit Muhurat)',
      nakshatra: 'Hasta Nakshatra (Favorable for everlasting prosperity & marital bliss)',
      ritualsOrder: [
        'Ganesh Puja & Mandap Ropan (Morning 08:30 AM)',
        'Varghodo / Baraat Arrival & Ponkhana (Morning 10:30 AM)',
        'Jaimala & Kanya Daan (11:15 AM)',
        'Hastamelap & Sapthapadi Pheras (11:45 AM - 12:45 PM)',
        'Ashirwad & Royal Wedding Feast (01:00 PM onwards)',
      ],
      priestGuidelines: `Panditji will coordinate with both families for dry samagri inspection 24 hours prior. Please ensure pure ghee and unpolished rice (Akshat).`,
    };

    return {
      summary: `Woohoo! 🎉 "${eventName}" is locked and loaded! We've put together a foolproof master gameplan for all ${guestCount} guests at ${selectedVenue.name} (${selectedVenue.locality}, ${city}) with your ₹${totalBudget.toLocaleString('en-IN')} budget dialed right down to the last rupee. From lip-smacking live food stations (${cityData.regionalSpecialties.chaat[0]}) to fresh floral decor from ${cityData.flowerMarketName} and practical tips to keep you smiling (and well-fed!) all day long. ✨`,
      budget: {
        total: totalBudget,
        categories: budgetCategories,
        savingTips,
      },
      timeline,
      vendors: vendors.map(enrichVendor),
      ideas: {
        themes: [
          {
            name: `Royal ${cityData.state} Heritage`,
            description: `Deep crimson velvet, brass urli with marigold petals from ${cityData.flowerMarketName}, jharokha photobooths, and warm lantern lighting.`,
            imageUrl: CURATED_VISUALS.themes.royal,
            palette: ['#8B1E3F', '#F59E0B', '#D4AF37', '#FAF8F5'],
          },
          {
            name: 'Pastel Vrindavan Bloom',
            description: 'Soft blush pink, ivory mogra garlands, mint green drapes, and fragrant rajnigandha accents.',
            imageUrl: CURATED_VISUALS.themes.pastel,
            palette: ['#FCE7F3', '#F3E8FF', '#D1FAE5', '#FDF4FF'],
          },
          {
            name: 'Boho Sunset Mela',
            description: 'Vibrant bandhani and leheriya umbrellas, colorful earthen matkas, fairy-lit cabanas for Mehendi & Sangeet.',
            imageUrl: CURATED_VISUALS.themes.boho,
            palette: ['#E2725B', '#F59E0B', '#F43F5E', '#FEF3C7'],
          },
        ],
        decor: [
          `Grand entryway at ${enrichedVenue.name} lined with brass diyas, scented marigold carpets, and floral bells`,
          `Carved wooden Mandap wrapped in fresh orange & yellow marigolds sourced from ${cityData.flowerMarketName}`,
          'Interactive photo backdrop featuring personalized neon signage and vintage brass swings (jhula)',
          'Cozy floor seating with low chowkis and silk bolsters for elder relatives during Haldi & Mehendi',
        ],
        menu: [
          `Live Chaat Counter: ${cityData.regionalSpecialties.chaat.join(', ')}`,
          `Main Course Spread: ${cityData.regionalSpecialties.mains.join(', ')}`,
          `Dessert Studio: ${cityData.regionalSpecialties.mithai.join(', ')}`,
          `Welcome Beverage Station: ${cityData.regionalSpecialties.drinks.join(', ')}`,
        ],
        entertainment: [
          `High-energy Live Dhol Tasha troupe leading the groom baraat to ${enrichedVenue.name}`,
          'Professional Sangeet DJ with wireless mic setup and customized family dance song mashups',
          'Live folk singers during the wedding feast and pheras ceremony',
          'Instant polaroid photo station with personalized bride & groom custom magnetic frames',
        ],
        giftsAndFavors: [
          'Handcrafted brass Sindoor or Kumkum boxes adorned with Meenakari art',
          `Customized jute tote bags containing ${cityData.regionalSpecialties.mithai[0]}, dry fruits, and scented ittar bottles`,
          'Traditional block-printed stoles and potli bags for Sangeet dance participants',
          'Eco-friendly seed-paper thank you notes that bloom into marigold flowers when planted',
        ],
      },
      venueDetails: enrichedVenue,
      muhuratDetails,
      civicCompliance,
      runOfShow: generateRunOfShow(formData, enrichedVenue.name, city),
      guestStats: generateGuestStats(guestCount, eventType),
    };
  }

  if (eventType === 'birthday') {
    const isKids = birthdayCategory === 'kids';
    const rawCategories = isKids
      ? [
          { name: 'Catering & Kids Snacks', percentage: 38, amount: 0, notes: 'Kid-friendly menu (pizza slices, fries, pasta, mini burgers) & adult buffet' },
          { name: 'Theme Decor & Balloon Arch', percentage: 22, amount: 0, notes: 'Organic balloon garland, customized backdrop, cutouts & LED marquee lights' },
          { name: 'Custom Designer Cake & Desserts', percentage: 12, amount: 0, notes: '3kg fondant/cream theme cake, cupcakes, cake pops & personalized cookies' },
          { name: 'Entertainer & Game Anchor', percentage: 12, amount: 0, notes: 'Professional kid anchor, magic show, mascot performer or tattoo artist' },
          { name: 'Return Gifts & Goodie Hampers', percentage: 10, amount: 0, notes: 'Theme-based stationery sets, educational games, books & treat bags' },
          { name: 'Venue & Audio Setup', percentage: 6, amount: 0, notes: `${selectedVenue.name} rental, sound system for party tracks` },
        ]
      : [
          { name: 'Catering & Dining Experience', percentage: 45, amount: 0, notes: 'Buffet dinner, gourmet finger food, mocktails/cocktails & live grill' },
          { name: 'Venue Rental / Private Lounge', percentage: 22, amount: 0, notes: `${selectedVenue.name} rental or private terrace` },
          { name: 'Decor, Lighting & Photo Backdrop', percentage: 14, amount: 0, notes: 'Sleek fairy lights, polaroid memory wall, neon light signage & floral accents' },
          { name: 'Artisan Cake & Dessert Table', percentage: 8, amount: 0, notes: 'Tiered birthday cake, gourmet brownies, macaron tower' },
          { name: 'DJ, Music & Acoustic Band', percentage: 7, amount: 0, notes: 'DJ console or live guitarist, party lighting & microphone' },
          { name: 'Return Favors & Souvenirs', percentage: 4, amount: 0, notes: 'Personalized scented candles, artisanal chocolate boxes or custom mugs' },
        ];

    const budgetCategories = recomputeAmounts(rawCategories, totalBudget);

    const savingTips = [
      `Host the celebration in your society clubhouse in ${locality || cityData.popularLocalities[0]} to eliminate commercial venue charges.`,
      `Order the main designer theme cake from a verified home baker in ${city} for fresher taste and 25% lower prices than luxury cake shops.`,
      `Bundle entertainer services (magic show + balloon sculpting + game anchor) with a single event artist agency.`,
      `Buy return gifts in bulk from local wholesale markets for up to 40% discounts.`,
    ];

    const rawTimeline = [
      { phase: 'Planning & Theme', daysBeforeEvent: 25, task: `Finalize "${isKids ? 'Kids Cartoon/Superhero' : 'Elegant Evening'}" theme and lock ${selectedVenue.name}`, priority: 'high' as const },
      { phase: 'Vendor Booking', daysBeforeEvent: 18, task: `Book verified theme decorator in ${city}, order custom designer cake, and confirm game host`, priority: 'high' as const },
      { phase: 'Invitations', daysBeforeEvent: 14, task: 'Send digital WhatsApp invitations with animated theme card & RSVP link', priority: 'medium' as const },
      { phase: 'Favors & Games', daysBeforeEvent: 7, task: 'Purchase return gift hampers, game prizes, and props', priority: 'medium' as const },
      { phase: 'Final Confirmation', daysBeforeEvent: 2, task: 'Reconfirm guest count with caterer, verify cake delivery timing, and test playlist', priority: 'high' as const },
    ];

    const { timeline } = calculateTimelineDates(rawTimeline, eventDate);

    const catererVendor = cityData.topVendors[0];
    const decorVendor = cityData.topVendors[1] || cityData.topVendors[0];

    const vendors: VendorItem[] = [
      {
        category: 'Catering & Food Service',
        estimatedCost: Math.round(totalBudget * (isKids ? 0.38 : 0.45)),
        bookBy: timeline[1]?.dueDate || eventDate,
        vendorName: catererVendor?.name || `${city} Delight Catering`,
        vendorAddress: catererVendor?.address || `${locality || cityData.popularLocalities[0]}, ${city}`,
        vendorPhone: catererVendor?.phone || '+91 98200 XXXXX',
        rating: 4.8,
        reviewCount: 160,
        verifiedBadge: 'FSSAI Certified • Fresh Party Menu',
        specialty: isKids ? 'Kid-friendly pizzas, spiral potatoes, pasta & fruit punch' : cityData.regionalSpecialties.chaat.join(', '),
        checklist: [
          'Confirm separate kid-friendly menu items and spicy adult choices',
          'Ensure live counter stations (mini dosas, pasta, or chaat)',
          'Check beverage refills and dessert serving arrangements',
        ],
        questionsToAsk: [
          'Do you supply paper napkins, biodegradable plates, and cutlery?',
          'What is the minimum guest billing guarantee?',
        ],
      },
      {
        category: 'Theme Decorator',
        estimatedCost: Math.round(totalBudget * (isKids ? 0.22 : 0.14)),
        bookBy: timeline[1]?.dueDate || eventDate,
        vendorName: decorVendor?.name || `${city} Party Balloons & Decor`,
        vendorAddress: decorVendor?.address || `${city}`,
        vendorPhone: decorVendor?.phone || '+91 98201 XXXXX',
        rating: 4.9,
        reviewCount: 210,
        verifiedBadge: '100% Biodegradable Latex Balloons',
        specialty: 'Custom 3D theme backdrops, organic balloon garlands, marquee light numbers',
        checklist: [
          'Confirm backdrop banner dimensions with child/person name',
          'Organic balloon garland color palette matching theme',
          'Entrance welcome board and cake table display props',
        ],
        questionsToAsk: [
          'How early will you arrive at the venue to set up?',
          'Do you provide cleanup after the party ends?',
        ],
      },
      {
        category: 'Custom Cake Artist',
        estimatedCost: Math.round(totalBudget * (isKids ? 0.12 : 0.08)),
        bookBy: timeline[1]?.dueDate || eventDate,
        vendorName: `The ${city} Cake Boutique`,
        vendorAddress: `${locality || cityData.popularLocalities[0]}, ${city}`,
        vendorPhone: '+91 98202 XXXXX',
        rating: 4.9,
        reviewCount: 185,
        verifiedBadge: '100% Eggless Certified Home Baker',
        specialty: 'Dutch chocolate, Belgian truffle, Mango / Berry tiered cakes',
        checklist: [
          'Flavors selection (Dutch chocolate, Belgian truffle, Mango / Berry)',
          'Custom topper and candle set included',
          'Safe refrigerated delivery directly to venue 1 hour before party',
        ],
        questionsToAsk: [
          'Can you create 100% eggless cake without compromising moisture?',
          'What is the delivery charge and container protection for transit?',
        ],
      },
    ];

    return {
      summary: `Party mode: ACTIVATED! 🎂🎈 "${eventName}" at ${selectedVenue.name} (${selectedVenue.locality}, ${city}) is going to be an absolute blast for all ${guestCount} guests! We've budgeted ₹${totalBudget.toLocaleString('en-IN')} to cover showstopper cake moments, yummy party treats, crowd-pleasing entertainment, and super fun return gifts without any last-minute chaos. 🎉`,
      budget: {
        total: totalBudget,
        categories: budgetCategories,
        savingTips,
      },
      timeline,
      vendors: vendors.map(enrichVendor),
      ideas: {
        themes: isKids
          ? [
              {
                name: 'Enchanted Jungle Safari',
                description: 'Emerald greenery, animal cutouts, safari hats for kids, and lion-cub balloon arch.',
                imageUrl: CURATED_VISUALS.themes.jungle,
                palette: ['#065F46', '#F59E0B', '#D97706', '#FEF3C7'],
              },
              {
                name: 'Cosmic Galaxy & Astronauts',
                description: 'Deep navy, glowing neon stars, metallic silver balloons, and rocket ship photo cutouts.',
                imageUrl: CURATED_VISUALS.themes.carnival,
                palette: ['#1E1B4B', '#6366F1', '#38BDF8', '#F1F5F9'],
              },
              {
                name: 'Carnival Fiesta',
                description: 'Candy-striped red & white booths, popcorn cart, cotton candy machine, and funfair ring toss.',
                imageUrl: CURATED_VISUALS.themes.carnival,
                palette: ['#DC2626', '#FBBF24', '#3B82F6', '#FFFFFF'],
              },
            ]
          : [
              {
                name: 'Gilded Retro Glamour',
                description: 'Warm amber lighting, metallic gold balloons, vinyl record centerpieces, and classic throwback hits.',
                imageUrl: CURATED_VISUALS.themes.royal,
                palette: ['#78350F', '#D97706', '#FCD34D', '#FFFBEB'],
              },
              {
                name: 'Tropical Sundowner',
                description: 'Bamboo cabanas, fairy lights, floral mocktail garnishes, and acoustic live unplugged music.',
                imageUrl: CURATED_VISUALS.themes.boho,
                palette: ['#047857', '#F97316', '#FDE047', '#ECFDF5'],
              },
            ],
        decor: isKids
          ? [
              `Custom backdrop arch at ${enrichedVenue.name} with 3D balloon installation and marquee age numbers`,
              'Themed table runner with personalized placemats and animal/superhero cups',
              'Fun photo booth corner with quirky goggles, speech bubbles, and superhero capes',
            ]
          : [
              'Edison bulb warm canopy lighting and vintage polaroid photo clothesline',
              'Custom neon name signage over artificial ivy foliage backdrop',
              'Minimalist floral table centerpieces in recycled amber glass bottles',
            ],
        menu: isKids
          ? [
              'Mini Cheesy Pizzas, Spiral Potato Tornadoes, and Crispy Veg Corn Nuggets',
              'Live Pasta Counter: Penne in Creamy Alfredo and Tangy Arabiatta sauce',
              `Choco-Lava cups, Cotton Candy station, and ${cityData.regionalSpecialties.mithai[0]} bites`,
              'Fresh Fruit Punch, Mango Mojito, and Strawberry Milkshake shooters',
            ]
          : [
              `Gourmet Canapés, Paneer Tikka Skewers, Dimsums, and ${cityData.regionalSpecialties.chaat[0]}`,
              `Main Course: Biryani station, Butter Naan, and ${cityData.regionalSpecialties.mains[0]}`,
              `Dessert: Warm Walnut Brownie with Gelato & ${cityData.regionalSpecialties.mithai[0]}`,
            ],
        entertainment: isKids
          ? [
              'High-energy Comedy Magic Show followed by Balloon Sculpting (swords, puppies, crowns)',
              'Musical Freeze Dance, Tug of War, and Treasure Hunt across party area',
              'Glitter Tattoo & Face Painting station for all attending children',
            ]
          : [
              'Live Acoustic Guitarist singing Bollywood retro & indie pop classics',
              'Curated Birthday Trivia Quiz about the birthday person with fun prize badges',
              'Karaoke session followed by high-tempo party dance tracks',
            ],
        giftsAndFavors: isKids
          ? [
              'Personalized themed canvas backpacks containing activity books and colored markers',
              'DIY plant-growing kit with pot, soil coin, and sunflower seeds for kids',
              'Customized storybooks or jigsaw puzzles packed in recyclable paper bags',
            ]
          : [
              'Artisanal handcrafted scented soy wax candles in brass tins',
              'Gourmet box of handcrafted truffles and spiced roasted dry fruits',
            ],
      },
      venueDetails: enrichedVenue,
      civicCompliance,
      runOfShow: generateRunOfShow(formData, enrichedVenue.name, city),
      guestStats: generateGuestStats(guestCount, eventType),
    };
  }

  // Community / Festival event (e.g. Ganesh Utsav, Navratri, Diwali, Society Annual Day)
  const rawCategories = [
    { name: 'Pandal (Mandap), Stage & Shamiana', percentage: 28, amount: 0, notes: `Waterproof German hangar or bamboo pandal at ${selectedVenue.name}, carpet & barricades` },
    { name: 'Sound, Loudspeakers & DG Power Backup', percentage: 20, amount: 0, notes: `Silent DG generator, compliance with ${city} 10 PM sound curfew norms` },
    { name: 'Prasad, Mahaprasad & Community Dining', percentage: 22, amount: 0, notes: `Daily aarti prasad, laddoo boxes, and ${cityData.state} Mahaprasad bhandara feast` },
    { name: 'Decor, Fresh Flowers & Eco-Idol / Murti', percentage: 14, amount: 0, notes: `Eco-friendly clay murti from local artisans, daily fresh garlands from ${cityData.flowerMarketName}` },
    { name: 'Statutory Permissions, Security & Sanitization', percentage: 8, amount: 0, notes: `${cityData.municipalOfficeName} permissions, police sound curfew NOC, CCTV & security guards` },
    { name: 'Cultural Programs, Prizes & Mementos', percentage: 8, amount: 0, notes: 'Prizes for drawing/dance competitions, guest mementos, volunteer ID badges & banners' },
  ];

  const budgetCategories = recomputeAmounts(rawCategories, totalBudget);

  const savingTips = [
    `Approach local banks, grocery stores, or businesses in ${locality || city} for co-sponsorship banners to offset 25-40% of pandal expenses.`,
    `Mandate an eco-friendly Clay (Shadu Mati) idol which allows symbolic immersion inside society water tanks, saving civic transport costs.`,
    `Pre-book sound and shamiana contractors 45 days in advance to secure non-peak rates.`,
    `Form volunteer committees for prasad packing and stage management instead of outsourcing event day coordination.`,
  ];

  const rawTimeline = [
    { phase: 'Permissions & Mobilization', daysBeforeEvent: 45, task: `Form event committee, pass Society resolution, and submit application at ${cityData.municipalOfficeName}`, priority: 'high' as const },
    { phase: 'Vendor Tendering', daysBeforeEvent: 30, task: `Book pandal contractor for ${selectedVenue.name}, verify fire safety NOC, and book silent DG generator`, priority: 'high' as const },
    { phase: 'Murti & Prasad', daysBeforeEvent: 20, task: `Finalize Eco-friendly Clay Murti artisan booking and lock Mahaprasad grocery supplier in ${city}`, priority: 'high' as const },
    { phase: 'Sound & Police NOC', daysBeforeEvent: 10, task: `Secure local police sound permission (${cityData.policeSoundCurfewRules})`, priority: 'high' as const },
    { phase: 'Setup & Rehearsal', daysBeforeEvent: 3, task: 'Pandal erection, stage lighting inspection, install CCTV cameras, and test audio setup', priority: 'medium' as const },
    { phase: 'Festival Execution', daysBeforeEvent: 0, task: 'Inauguration, ceremonial aarti, daily schedule execution, crowd flow management & visarjan logistics', priority: 'high' as const },
  ];

  const { timeline } = calculateTimelineDates(rawTimeline, eventDate);

  const soundVendor = cityData.topVendors.find((v) => v.category.includes('Sound')) || cityData.topVendors[0];

  const vendors: VendorItem[] = [
    {
      category: 'Pandal, Stage & Shamiana Contractor',
      estimatedCost: Math.round(totalBudget * 0.28),
      bookBy: timeline[1]?.dueDate || eventDate,
      vendorName: `${city} Pandal & Mandap Infrastructure`,
      vendorAddress: `${locality || cityData.popularLocalities[0]}, ${city}`,
      vendorPhone: '+91 98211 XXXXX',
      rating: 4.7,
      reviewCount: 140,
      verifiedBadge: 'Fire Retardant Fabric Certified • Waterproof Hangar',
      specialty: 'High-strength German hangars, decorated stage, rubber floor mats for society grounds',
      checklist: [
        'Ensure waterproof roof sheeting and sturdy steel/bamboo trusses',
        'Verify fire-retardant fabric certification for pandal draping',
        'Confirm emergency exit passage and separate entry/exit barricades',
      ],
      questionsToAsk: [
        'Do you provide rubber floor matting to protect society tiles and lawn?',
        'What is the dismantle duration after festival culmination?',
      ],
    },
    {
      category: 'Sound & DG Generator Provider',
      estimatedCost: Math.round(totalBudget * 0.20),
      bookBy: timeline[1]?.dueDate || eventDate,
      vendorName: soundVendor?.name || `${city} Sound & Power Genset`,
      vendorAddress: soundVendor?.address || `${city}`,
      vendorPhone: soundVendor?.phone || '+91 98205 XXXXX',
      rating: soundVendor?.rating || 4.7,
      reviewCount: soundVendor?.reviewCount || 190,
      verifiedBadge: soundVendor?.verifiedBadge || 'Police Sound Compliance Certified • Silent Genset',
      specialty: 'Sound limiter calibrated to pollution control board norms, podium and wireless mics',
      checklist: [
        'Verify sound limiter to comply with state pollution control board decibel rules',
        'Inspect silent diesel generator backup (including fuel refill policy)',
        'Check podium gooseneck microphone and 4 wireless handheld mics',
      ],
      questionsToAsk: [
        'Will a dedicated sound technician be present on-site throughout the daily programs?',
        'Are backup cables and amplifier ready in case of power surge?',
      ],
    },
    {
      category: 'Mahaprasad & Community Caterer',
      estimatedCost: Math.round(totalBudget * 0.22),
      bookBy: timeline[2]?.dueDate || eventDate,
      vendorName: `${city} Satvik Mahaprasad Halwai`,
      vendorAddress: `Near Main Temple, ${city}`,
      vendorPhone: '+91 98206 XXXXX',
      rating: 4.9,
      reviewCount: 310,
      verifiedBadge: 'Pure Desi Ghee Satvik Kitchen • FSSAI Certified',
      specialty: `Satvik prasad, Pure Ghee Boondi Laddoos, ${cityData.regionalSpecialties.mains[0]}`,
      checklist: [
        'Confirm pure vegetarian satvik preparation without onion/garlic for prasad',
        'Inspect separate large water dispensers and biodegradable leaf plates (pattals)',
        'Arrange queue management for bhandara / community lunch distribution',
      ],
      questionsToAsk: [
        'Can food be prepared on-site or delivered hot in insulated commercial carriers?',
        'How do you manage leftover prasad distribution to charitable homes?',
      ],
    },
    {
      category: 'Municipal & Regulatory Coordinator',
      estimatedCost: Math.round(totalBudget * 0.08),
      bookBy: timeline[0]?.dueDate || eventDate,
      vendorName: `${city} Civic Legal & Police Compliance Desk`,
      vendorAddress: cityData.municipalOfficeName,
      vendorPhone: '+91 98207 XXXXX',
      rating: 4.8,
      reviewCount: 95,
      verifiedBadge: 'Authorized Civic Liaison',
      specialty: 'Police sound permits, Fire Brigade NOC, Ward office temporary structure clearance',
      checklist: [
        `${cityData.municipalOfficeName} temporary structure clearance`,
        'Traffic police clearance if pandal borders public roadway',
        'Fire Brigade fire-safety audit and extinguisher installations',
      ],
      questionsToAsk: [
        'Are there designated festival days with extended sound permission till midnight?',
        'What documents are needed from the society committee letterhead?',
      ],
    },
  ];

  return {
    summary: `Jai Ho! 🪔 "${eventName}" is all set to bring together ${guestCount} people at ${enrichedVenue.name} (${enrichedVenue.locality}, ${city}) for an unforgettable community celebration! Every single rupee of your ₹${totalBudget.toLocaleString('en-IN')} fund is smartly accounted for — from legal police/sound permissions to delicious Mahaprasad feasts and grand decor. 🙏`,
    budget: {
      total: totalBudget,
      categories: budgetCategories,
      savingTips,
    },
    timeline,
    vendors: vendors.map(enrichVendor),
    ideas: {
      themes: [
        {
          name: 'Vedic Heritage & Earthen Harmony',
          description: 'Terracotta diyas, bamboo arches, sacred marigold torans, and zero-plastic eco decorations.',
          imageUrl: CURATED_VISUALS.themes.temple,
          palette: ['#B45309', '#D97706', '#065F46', '#FEF3C7'],
        },
        {
          name: 'Temple of Lights (Deepotsav)',
          description: `Cascading warm fairy lighting, brass samai oil lamps, and floral rangolis crafted with blooms from ${cityData.flowerMarketName}.`,
          imageUrl: CURATED_VISUALS.themes.royal,
          palette: ['#F59E0B', '#D4AF37', '#78350F', '#FFFBEB'],
        },
      ],
      decor: [
        `Grand entrance gate modeled after traditional temple gopurams decorated with banana stems and mango leaves at ${enrichedVenue.name}`,
        'Magnificent floral rangoli competition designs welcoming visitors at the central foyer',
        'LED focus illumination on the central altar with soft ambient warm wash across the stage',
      ],
      menu: [
        `Daily Aarti Prasad: Desi Ghee Boondi Laddoos, Panchamrit, and ${cityData.regionalSpecialties.mithai[0]}`,
        `Mahaprasad Feast: Steaming Puri, Chhole, Aloo Rasawala, ${cityData.regionalSpecialties.mains.slice(0, 2).join(', ')}`,
        `Refreshing afternoon counters: Rose Sherbet, Nimbu Pani, and ${cityData.regionalSpecialties.drinks[0]}`,
      ],
      entertainment: [
        'Inter-society kids talent show: Classical dance, shloka chanting, and Vedic storytelling',
        'Evening Bhajan Sandhya / Dandiya Raas with traditional folk orchestra',
        'Prize distribution ceremony recognizing senior citizens, academic toppers, and sports stars',
      ],
      giftsAndFavors: [
        'Commemorative laminated festival calendar and miniature brass diya sets',
        'Jute eco-pouches filled with sacred prasad, dry fruit mishri, and blessed tulsi seeds',
      ],
    },
    venueDetails: enrichedVenue,
    civicCompliance,
    runOfShow: generateRunOfShow(formData, enrichedVenue.name, city),
    guestStats: generateGuestStats(guestCount, eventType),
  };
}
