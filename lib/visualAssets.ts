import { EventFormData, RunOfShowItem, GuestStats, VendorItem } from '@/types';

export const CURATED_VISUALS = {
  venues: {
    wedding_resort: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    wedding_palace: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    banquet_hall: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    birthday_lawn: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    festival_ground: 'https://images.unsplash.com/photo-1609137144820-2210b3796d1d?auto=format&fit=crop&w=1200&q=80',
  },
  vendors: {
    caterer: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    venue: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    decor: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    photo: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    priest: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    sound: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    makeup: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    entertainer: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    pandal: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    favors: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    compliance: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  },
  food: {
    thali: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    chaat: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    mithai: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    drinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  themes: {
    royal: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    pastel: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    boho: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    jungle: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    carnival: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    temple: 'https://images.unsplash.com/photo-1609137144820-2210b3796d1d?auto=format&fit=crop&w=800&q=80',
  },
};

/**
 * Returns an authentic image URL for a vendor category
 */
export function getVendorImage(category: string): string {
  const c = category.toLowerCase();
  if (c.includes('cater') || c.includes('food') || c.includes('halwai') || c.includes('dining')) {
    return CURATED_VISUALS.vendors.caterer;
  }
  if (c.includes('venue') || c.includes('lawn') || c.includes('hall') || c.includes('banquet')) {
    return CURATED_VISUALS.vendors.venue;
  }
  if (c.includes('decor') || c.includes('mandap') || c.includes('flower')) {
    return CURATED_VISUALS.vendors.decor;
  }
  if (c.includes('photo') || c.includes('video') || c.includes('cinema')) {
    return CURATED_VISUALS.vendors.photo;
  }
  if (c.includes('makeup') || c.includes('mehendi') || c.includes('styl')) {
    return CURATED_VISUALS.vendors.makeup;
  }
  if (c.includes('sound') || c.includes('dj') || c.includes('music')) {
    return CURATED_VISUALS.vendors.sound;
  }
  if (c.includes('pandit') || c.includes('priest') || c.includes('puja') || c.includes('vedic')) {
    return CURATED_VISUALS.vendors.priest;
  }
  if (c.includes('cake') || c.includes('baker')) {
    return CURATED_VISUALS.vendors.cake;
  }
  if (c.includes('entertain') || c.includes('magic') || c.includes('anchor')) {
    return CURATED_VISUALS.vendors.entertainer;
  }
  if (c.includes('pandal') || c.includes('shamiana')) {
    return CURATED_VISUALS.vendors.pandal;
  }
  if (c.includes('gift') || c.includes('favor') || c.includes('invite')) {
    return CURATED_VISUALS.vendors.favors;
  }
  return CURATED_VISUALS.vendors.compliance;
}

/**
 * Calculates standard real-world Indian vendor payment tranches:
 * 25% Token to reserve date
 * 50% Production milestone (7 days prior)
 * 25% Final settlement night
 */
export function calculateVendorPaymentMilestones(estimatedCost: number) {
  const advanceToken = Math.round(estimatedCost * 0.25);
  const midWay = Math.round(estimatedCost * 0.50);
  const finalSettlement = estimatedCost - advanceToken - midWay;
  return {
    advanceToken,
    midWay,
    finalSettlement,
    advancePaid: false,
    midWayPaid: false,
    finalPaid: false,
  };
}

/**
 * Generates an authentic hour-by-hour operational run-of-show
 */
export function generateRunOfShow(formData: EventFormData, venueName: string, city: string): RunOfShowItem[] {
  const { eventType, guestCount } = formData;

  if (eventType === 'wedding') {
    return [
      {
        id: 'ros-1',
        time: '07:30 AM',
        eventTitle: 'Floral Mandap & Sound Rig Setup',
        description: `Decorator truck arrives from flower market at ${venueName}. Sound technician verifies line-array and wireless mic frequencies.`,
        location: 'Main Mandap & Central Courtyard',
        coordinator: 'Lead Decorator & Chacha (Logistics Captain)',
        phone: '+91 98252 11001',
        completed: true,
        urgentNote: 'Verify fresh marigold garlands before 08:30 AM',
      },
      {
        id: 'ros-2',
        time: '09:30 AM',
        eventTitle: 'Ganesh Puja & Mandap Ropan',
        description: 'Panditji commences auspicious morning rites with immediate family. Havan samagri check.',
        location: 'Mandap Altar',
        coordinator: 'Panditji & Family Elders',
        phone: '+91 98980 22002',
        completed: false,
      },
      {
        id: 'ros-3',
        time: '12:00 PM',
        eventTitle: 'Live Chaat & Welcome Beverage Stalls Active',
        description: `Head caterer activates live regional counters. Water dispensers and welcome coolers ready for guest check-in.`,
        location: 'Lawn Canopy / Banquet Foyer',
        coordinator: 'Catering Captain & Cousin Squad',
        phone: '+91 97129 33003',
        completed: false,
      },
      {
        id: 'ros-4',
        time: '03:45 PM',
        eventTitle: 'Baraat Assembly & Royal Dhol-Tasha Welcome',
        description: 'Groom procession gathers at East Gate. Dhol troupe coordinates procession tempo toward the main entryway.',
        location: 'Main Entry Gate & Porch',
        coordinator: 'Groom’s Brother & Mama (Baraat Liaison)',
        phone: '+91 98200 44004',
        completed: false,
        urgentNote: 'Keep Aarti thali and Rosewater sprinters stationed at gate',
      },
      {
        id: 'ros-5',
        time: '04:30 PM',
        eventTitle: 'Jaimala & Shubh Hastamelap Pheras',
        description: 'Sacred wedding vows, Sindoor daan, and Mangalsutra ceremony during auspicious Godhuli Muhurat.',
        location: 'Royal Mandap Stage',
        coordinator: 'Bridal Sister & Panditji',
        phone: '+91 98980 22002',
        completed: false,
      },
      {
        id: 'ros-6',
        time: '07:15 PM',
        eventTitle: 'Grand Shahi Bhojan Dinner Buffet',
        description: `Formal sit-down / multi-course royal feast opened for all ${guestCount} guests. Stage photo session.`,
        location: 'Grand Ballroom & Dining Pavilion',
        coordinator: 'Head Banquet Captain & Uncle',
        phone: '+91 98252 11001',
        completed: false,
      },
      {
        id: 'ros-7',
        time: '10:00 PM',
        eventTitle: '10 PM Sound Curfew Compliance & Indoor Transition',
        description: 'City police curfew requires stopping outdoor loudspeakers. Transition music and celebration to acoustic indoor lounge.',
        location: 'Acoustic Indoor Lounge',
        coordinator: 'DJ Lead & Venue Duty Manager',
        phone: '+91 98211 55005',
        completed: false,
        urgentNote: 'Mandatory police curfew switchover at exactly 10:00 PM',
      },
    ];
  }

  if (eventType === 'birthday') {
    return [
      {
        id: 'ros-b1',
        time: '03:30 PM',
        eventTitle: 'Balloon Arch & Theme Backdrop Assembly',
        description: `Decorator inflates organic balloon arches and tests neon marquee lights at ${venueName}.`,
        location: 'Party Hall & Photo Wall',
        coordinator: 'Theme Decorator',
        phone: '+91 98201 12345',
        completed: true,
      },
      {
        id: 'ros-b2',
        time: '04:45 PM',
        eventTitle: 'Designer Cake Delivery & Temperature Check',
        description: 'Eggless designer cake delivered in temperature-controlled cooler. Topper & sparkling candles placed.',
        location: 'Center Cake Table',
        coordinator: 'Baker Courier & Mom',
        phone: '+91 98202 23456',
        completed: false,
        urgentNote: 'Check spelling on cake name board immediately upon arrival',
      },
      {
        id: 'ros-b3',
        time: '05:00 PM',
        eventTitle: 'Guest Welcomes, Wristbands & Glitter Tattoos',
        description: 'Kids arrive, get personalized badges, face painting / glitter tattoos, and welcome drinks.',
        location: 'Entrance Foyer',
        coordinator: 'Emcee Anchor',
        phone: '+91 98205 34567',
        completed: false,
      },
      {
        id: 'ros-b4',
        time: '05:45 PM',
        eventTitle: 'Interactive Comedy Magic & Mascot Game Show',
        description: 'Exciting games, musical freeze dance, balloon swords, and interactive magic tricks for all age groups.',
        location: 'Main Party Arena',
        coordinator: 'Magician & Game Lead',
        phone: '+91 98205 34567',
        completed: false,
      },
      {
        id: 'ros-b5',
        time: '06:45 PM',
        eventTitle: 'Grand Cake Cutting & Confetti Burst',
        description: 'Birthday anthem, confetti blast, family portrait photo shoot, and cake slice distribution.',
        location: 'Main Stage',
        coordinator: 'Party Host & Family',
        phone: '+91 98200 11111',
        completed: false,
      },
      {
        id: 'ros-b6',
        time: '07:15 PM',
        eventTitle: 'Kids & Adult Snacks Buffet',
        description: 'Hot mini pizzas, pasta, spiral potatoes, and fresh desserts served hot.',
        location: 'Dining Station',
        coordinator: 'Caterer Lead',
        phone: '+91 98200 22222',
        completed: false,
      },
      {
        id: 'ros-b7',
        time: '08:00 PM',
        eventTitle: 'Return Gift Hamper Distribution & Wrap',
        description: 'Children receive personalized return gift packs, thank-you hugs, and helium balloons.',
        location: 'Exit Desk',
        coordinator: 'Birthday Child & Parents',
        phone: '+91 98200 11111',
        completed: false,
      },
    ];
  }

  // Community / Festival
  return [
    {
      id: 'ros-c1',
      time: '06:30 AM',
      eventTitle: 'Sanctum Cleaning, Rangoli & Flower Toran',
      description: `Volunteers clean pandal flooring at ${venueName}, drape fresh marigold torans, and light oil lamps.`,
      location: 'Central Sanctum & Mandap Entrance',
      coordinator: 'Volunteer Captain & Floral Decorator',
      phone: '+91 98211 98765',
      completed: true,
    },
    {
      id: 'ros-c2',
      time: '08:00 AM',
      eventTitle: 'Morning Maha Aarti & Shankhanaad',
      description: 'Grand morning prayers with traditional dhol rhythms and sacred mantra chanting.',
      location: 'Main Altar',
      coordinator: 'Head Priest & Society President',
      phone: '+91 98206 54321',
      completed: false,
    },
    {
      id: 'ros-c3',
      time: '11:00 AM',
      eventTitle: 'Mahaprasad Bhog Preparation & Inspection',
      description: 'Halwai kitchen finishes pure desi ghee preparations. Health & hygiene inspection.',
      location: 'Community Kitchen Stalls',
      coordinator: 'Food Committee Lead',
      phone: '+91 98206 54321',
      completed: false,
    },
    {
      id: 'ros-c4',
      time: '01:00 PM',
      eventTitle: 'Pangat Mahaprasad Serving for Devotees',
      description: `Orderly sit-down dining serving for all devotees with queue token management.`,
      location: 'Community Dining Hall',
      coordinator: 'Youth Volunteer Brigade',
      phone: '+91 98205 12345',
      completed: false,
    },
    {
      id: 'ros-c5',
      time: '06:30 PM',
      eventTitle: 'Kids Cultural Drama & Shloka Recitation',
      description: 'Children perform Vedic bhajans and cultural skits on stage with podium audio.',
      location: 'Cultural Stage',
      coordinator: 'Cultural Committee Secretary',
      phone: '+91 98207 23456',
      completed: false,
    },
    {
      id: 'ros-c6',
      time: '08:00 PM',
      eventTitle: 'Grand Evening Dhol Aarti & Prasad Boxes',
      description: 'Peak community attendance, traditional musical aarti, and distribution of blessed boondi laddoo boxes.',
      location: 'Main Pandal',
      coordinator: 'General Secretary',
      phone: '+91 98207 23456',
      completed: false,
    },
    {
      id: 'ros-c7',
      time: '09:45 PM',
      eventTitle: '10 PM Sound Curfew Compliance Wrap',
      description: 'Loudspeakers turned off strictly by 10:00 PM per civic police sound NOC rules.',
      location: 'Sound Console Desk',
      coordinator: 'Sound Engineer & Police Liaison',
      phone: '+91 98205 12345',
      completed: false,
      urgentNote: 'Strict police curfew cutoff at 10:00 PM sharp',
    },
  ];
}

/**
 * Generates realistic RSVP and hospitality guest statistics
 */
export function generateGuestStats(guestCount: number, eventType: string): GuestStats {
  const isWedding = eventType === 'wedding';
  const confirmedRate = isWedding ? 0.84 : 0.88;
  const confirmed = Math.round(guestCount * confirmedRate);
  const pending = Math.max(0, guestCount - confirmed);

  return {
    totalExpected: guestCount,
    confirmed,
    pending,
    dietary: {
      jain: Math.round(guestCount * 0.28),
      pureVeg: Math.round(guestCount * 0.62),
      regular: Math.round(guestCount * 0.10),
    },
    vipCount: Math.round(guestCount * (isWedding ? 0.15 : 0.10)),
  };
}

