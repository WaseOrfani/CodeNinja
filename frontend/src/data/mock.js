// Complete mock data for Oria Grill Restaurant Website

// Navigation Links
export const navLinks = [
  { name: "HOME", path: "/", hasDropdown: false },
  { 
    name: "ÜBER UNS", 
    path: "/about", 
    hasDropdown: true,
    dropdownItems: [
      { name: "Unsere Geschichte", path: "/story" },
      { name: "Zutaten", path: "/ingredients" },
      { name: "Vision & Werte", path: "/vision" }
    ]
  },
  { 
    name: "SPEISEKARTE", 
    path: "/menu", 
    hasDropdown: true,
    dropdownItems: [
      { name: "Vorspeisen", path: "/menu#vorspeisen" },
      { name: "Salate", path: "/menu#salate" },
      { name: "Sandwiches", path: "/menu#sandwiches" },
      { name: "Hauptgerichte", path: "/menu#hauptgerichte" },
      { name: "Desserts", path: "/menu#desserts" }
    ]
  },
  { name: "ANGEBOTE", path: "/offers", hasDropdown: false },
  { name: "STANDORTE", path: "/locations", hasDropdown: false },
  { name: "PRESSE", path: "/press", hasDropdown: false },
  { name: "GESCHENKKARTEN", path: "/giftcards", hasDropdown: false },
  { name: "BLOG", path: "/blog", hasDropdown: false },
  { 
    name: "KONTAKT", 
    path: "/contact", 
    hasDropdown: true,
    dropdownItems: [
      { name: "Kontaktformular", path: "/contact" },
      { name: "Karriere", path: "/careers" },
      { name: "Franchising", path: "/franchise" }
    ]
  }
];

// Action Buttons
export const actionButtons = [
  { name: "Shop", icon: "ShoppingBag", link: "/shop" },
  { name: "Catering", icon: "Utensils", link: "/catering" },
  { name: "Bestellen", icon: "ShoppingCart", link: "/order" }
];

// Hero Slides
export const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1685798830572-f07ff7635774?w=1920&q=80",
    title: "Frisch vom Grill",
    subtitle: "Authentische mediterrane Küche mit Leidenschaft zubereitet",
    buttonText: "Jetzt bestellen",
    buttonLink: "/locations"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1676471870459-909888c99fb5?w=1920&q=80",
    title: "Family Platter",
    subtitle: "Genießen Sie unsere großzügigen Familienportionen",
    price: "€49.99",
    priceDetails: "Für 4 Personen",
    buttonText: "Entdecken",
    buttonLink: "/menu"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1626323109252-0adb3b46692b?w=1920&q=80",
    title: "Catering Service",
    subtitle: "Lassen Sie uns Ihre nächste Veranstaltung zu etwas Besonderem machen",
    buttonText: "Catering anfragen",
    buttonLink: "/catering"
  }
];

// Menu Categories for Homepage
export const menuCategories = [
  { id: 1, name: "Vorspeisen", image: "https://images.unsplash.com/photo-1695465832919-7383a6a25ee5?w=400&q=80", link: "/menu#vorspeisen" },
  { id: 2, name: "Salate", image: "https://images.unsplash.com/photo-1680405531955-8b4981bb1b0c?w=400&q=80", link: "/menu#salate" },
  { id: 3, name: "Sandwiches", image: "https://images.unsplash.com/photo-1768812910769-d037b90aee77?w=400&q=80", link: "/menu#sandwiches" },
  { id: 4, name: "Mittagsangebote", image: "https://images.unsplash.com/photo-1676471984382-a6dd86b507e9?w=400&q=80", link: "/menu#mittagsangebote" },
  { id: 5, name: "Hauptgerichte", image: "https://images.unsplash.com/photo-1744175331258-f4758acce6ca?w=400&q=80", link: "/menu#hauptgerichte" },
  { id: 6, name: "Vegetarisch", image: "https://images.pexels.com/photos/29177206/pexels-photo-29177206.jpeg?w=400", link: "/menu#vegetarisch" },
  { id: 7, name: "Beilagen", image: "https://images.pexels.com/photos/9510363/pexels-photo-9510363.jpeg?w=400", link: "/menu#beilagen" },
  { id: 8, name: "Desserts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80", link: "/menu#desserts" },
  { id: 9, name: "Getränke", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80", link: "/menu#getranke" },
  { id: 10, name: "Familien Platten", image: "https://images.pexels.com/photos/6459331/pexels-photo-6459331.jpeg?w=400", link: "/menu#familienplatten" }
];

// Full Menu Items
export const menuItems = {
  vorspeisen: [
    {
      id: 1,
      name: "Hummus",
      description: "Cremige Kichererbsenpaste mit Tahini, Knoblauch und einem Hauch Zitronensaft. Serviert mit frischem Fladenbrot.",
      price: "€6.90",
      calories: "430 kcal",
      image: "https://images.unsplash.com/photo-1695465832919-7383a6a25ee5?w=400&q=80",
      tags: ["vegetarisch", "glutenfrei"]
    },
    {
      id: 2,
      name: "Falafel",
      description: "Knusprige Kichererbsenbällchen mit frischen Kräutern, serviert mit Tahini-Sauce.",
      price: "€7.90",
      calories: "690 kcal",
      image: "https://images.unsplash.com/photo-1680405531955-8b4981bb1b0c?w=400&q=80",
      tags: ["vegetarisch", "vegan"]
    },
    {
      id: 3,
      name: "Dolma",
      description: "Gefüllte Weinblätter mit gewürztem Reis und frischen Kräutern.",
      price: "€6.50",
      calories: "250 kcal",
      image: "https://images.unsplash.com/photo-1768812910769-d037b90aee77?w=400&q=80",
      tags: ["vegetarisch"]
    },
    {
      id: 4,
      name: "Chicken Wings",
      description: "Marinierte Hähnchenflügel, gegrillt mit Oria's geheimer Gewürzmischung.",
      price: "€9.90",
      calories: "430 kcal",
      image: "https://images.unsplash.com/photo-1676471870459-909888c99fb5?w=400&q=80",
      tags: ["halal"]
    }
  ],
  salate: [
    {
      id: 1,
      name: "Garden Salat",
      description: "Frischer Gartensalat mit Tomaten, Gurken, Pilzen und Hausdressing.",
      price: "€7.90",
      calories: "170 kcal",
      image: "https://images.unsplash.com/photo-1680405531955-8b4981bb1b0c?w=400&q=80",
      tags: ["vegetarisch", "glutenfrei"]
    },
    {
      id: 2,
      name: "Oria's House Salat",
      description: "Grüner Salat mit Tomaten, Gurken, Feta, Kalamata Oliven und Peperoni.",
      price: "€8.90",
      calories: "170 kcal",
      image: "https://images.unsplash.com/photo-1695465832919-7383a6a25ee5?w=400&q=80",
      tags: ["vegetarisch"]
    },
    {
      id: 3,
      name: "Shirazi Salat",
      description: "Persischer Salat mit gehackten Gurken, Tomaten, Zwiebeln und frischen Kräutern.",
      price: "€6.90",
      calories: "100 kcal",
      image: "https://images.unsplash.com/photo-1768812910769-d037b90aee77?w=400&q=80",
      tags: ["vegetarisch", "vegan", "glutenfrei"]
    },
    {
      id: 4,
      name: "Mediterraner Salat",
      description: "Frische Salatblätter mit Tomaten, Feta, Walnüssen, Rosinen und Granatapfel-Dressing.",
      price: "€9.90",
      calories: "470 kcal",
      image: "https://images.unsplash.com/photo-1676471984382-a6dd86b507e9?w=400&q=80",
      tags: ["vegetarisch"]
    }
  ],
  sandwiches: [
    {
      id: 1,
      name: "Kubideh Sandwich",
      description: "Gegrilltes Rinderhackfleisch mit Zwiebeln, serviert im frischen Fladenbrot mit Salat und Feta.",
      price: "€10.90",
      calories: "760 kcal",
      image: "https://images.unsplash.com/photo-1744175331258-f4758acce6ca?w=400&q=80",
      tags: ["halal"]
    },
    {
      id: 2,
      name: "Joojeh Sandwich",
      description: "Saftiges mariniertes Hähnchenbrustfilet, gegrillt und serviert im frischen Fladenbrot.",
      price: "€11.90",
      calories: "890 kcal",
      image: "https://images.unsplash.com/photo-1676471870459-909888c99fb5?w=400&q=80",
      tags: ["halal"]
    },
    {
      id: 3,
      name: "Gyros Sandwich",
      description: "Würziges Gyros-Fleisch mit frischem Salat, Tomaten und Knoblauchsauce.",
      price: "€11.90",
      calories: "1330 kcal",
      image: "https://images.unsplash.com/photo-1685798830572-f07ff7635774?w=400&q=80",
      tags: []
    },
    {
      id: 4,
      name: "Falafel Sandwich",
      description: "Knusprige Falafel im Fladenbrot mit Salat, Tomaten und Tahini-Sauce.",
      price: "€9.90",
      calories: "650 kcal",
      image: "https://images.unsplash.com/photo-1680405531955-8b4981bb1b0c?w=400&q=80",
      tags: ["vegetarisch", "vegan"]
    }
  ],
  hauptgerichte: [
    {
      id: 1,
      name: "Kubideh Kabob",
      description: "Frisches Rinderhackfleisch, mariniert mit Oria's Signature Gewürzen, langsam gegrillt. Serviert mit Reis oder Salat.",
      price: "€14.90",
      calories: "390 kcal",
      image: "https://images.unsplash.com/photo-1744175331258-f4758acce6ca?w=400&q=80",
      tags: ["halal"]
    },
    {
      id: 2,
      name: "Joojeh Kabob",
      description: "Mariniertes Hähnchenbrustfilet, langsam über offener Flamme gegrillt bis zur Perfektion.",
      price: "€15.90",
      calories: "320 kcal",
      image: "https://images.unsplash.com/photo-1676471870459-909888c99fb5?w=400&q=80",
      tags: ["halal"]
    },
    {
      id: 3,
      name: "Barreh Kabob",
      description: "Zartes Lammfilet, mariniert und gegrillt zu einem exotisch würzigen Geschmackserlebnis.",
      price: "€18.90",
      calories: "330 kcal",
      image: "https://images.unsplash.com/photo-1685798830572-f07ff7635774?w=400&q=80",
      tags: ["halal", "premium"]
    },
    {
      id: 4,
      name: "Chenjeh Kabob",
      description: "Saftiges Rinderfilet, mariniert in unserer Signature-Gewürzmischung und zart gegrillt.",
      price: "€17.90",
      calories: "420 kcal",
      image: "https://images.unsplash.com/photo-1676471984382-a6dd86b507e9?w=400&q=80",
      tags: ["halal", "premium"]
    },
    {
      id: 5,
      name: "Lachs Kabob",
      description: "Frischer Lachs, gewürfelt und mariniert, gegrillt zu einem leichten und saftigen Finish.",
      price: "€19.90",
      calories: "410 kcal",
      image: "https://images.unsplash.com/photo-1626323109252-0adb3b46692b?w=400&q=80",
      tags: ["fisch"]
    },
    {
      id: 6,
      name: "Oria's Super Combo",
      description: "Das Beste von allem: Kubideh, Joojeh und Chenjeh Kabob zusammen auf einem Teller.",
      price: "€24.90",
      calories: "950 kcal",
      image: "https://images.pexels.com/photos/6459331/pexels-photo-6459331.jpeg?w=400",
      tags: ["halal", "bestseller"]
    }
  ],
  mittagsangebote: [
    {
      id: 1,
      name: "MONTAG: Lubia Polo",
      description: "Rindfleisch mit grünen Bohnen, Tomatensauce und persischen Gewürzen, serviert mit Basmatireis.",
      price: "€12.90",
      calories: "980 kcal",
      image: "https://images.unsplash.com/photo-1676471984382-a6dd86b507e9?w=400&q=80",
      tags: []
    },
    {
      id: 2,
      name: "DIENSTAG: Baghaala Polo",
      description: "Aromatischer Basmatireis mit Saubohnen und Dill, serviert mit zartem Lammfleisch.",
      price: "€14.90",
      calories: "1180 kcal",
      image: "https://images.unsplash.com/photo-1685798830572-f07ff7635774?w=400&q=80",
      tags: ["premium"]
    },
    {
      id: 3,
      name: "MITTWOCH: Khoresht Gheymeh",
      description: "Gelbe Spalterbsen mit Rindfleisch in Tomatensauce, serviert mit Basmatireis.",
      price: "€12.90",
      calories: "870 kcal",
      image: "https://images.unsplash.com/photo-1676471870459-909888c99fb5?w=400&q=80",
      tags: []
    },
    {
      id: 4,
      name: "DONNERSTAG: Zereshk Polo",
      description: "Safranreis mit karamellisierten Berberitzen, serviert mit unserem saftigen Backhähnchen.",
      price: "€13.90",
      calories: "1100 kcal",
      image: "https://images.unsplash.com/photo-1744175331258-f4758acce6ca?w=400&q=80",
      tags: ["beliebt"]
    },
    {
      id: 5,
      name: "FREITAG: Ghormeh Sabzi",
      description: "Reichhaltiger persischer Kräutereintopf mit Rindfleisch, roten Bohnen und Limetten.",
      price: "€13.90",
      calories: "1010 kcal",
      image: "https://images.unsplash.com/photo-1626323109252-0adb3b46692b?w=400&q=80",
      tags: ["beliebt"]
    }
  ],
  vegetarisch: [
    {
      id: 1,
      name: "Veggie Kabob",
      description: "Bunte Gemüsespieße mit Aubergine, Paprika, Zucchini und Pilzen, gegrillt mit Safran.",
      price: "€12.90",
      calories: "280 kcal",
      image: "https://images.pexels.com/photos/29177206/pexels-photo-29177206.jpeg?w=400",
      tags: ["vegetarisch", "vegan", "glutenfrei"]
    },
    {
      id: 2,
      name: "Oria's Veggie Platter",
      description: "Gebratenes Gemüse mit Spinat, Tomaten, Pilzen, serviert mit Reis und Salat.",
      price: "€13.90",
      calories: "450 kcal",
      image: "https://images.unsplash.com/photo-1680405531955-8b4981bb1b0c?w=400&q=80",
      tags: ["vegetarisch"]
    },
    {
      id: 3,
      name: "Falafel Platter",
      description: "Knusprige Falafel serviert mit Reis, Salat und cremiger Tahini-Sauce.",
      price: "€12.90",
      calories: "680 kcal",
      image: "https://images.unsplash.com/photo-1695465832919-7383a6a25ee5?w=400&q=80",
      tags: ["vegetarisch", "vegan"]
    }
  ],
  beilagen: [
    { id: 1, name: "Basmatireis", price: "€3.90", calories: "350 kcal" },
    { id: 2, name: "Gegrilltes Gemüse", price: "€4.90", calories: "120 kcal" },
    { id: 3, name: "Frisches Fladenbrot", price: "€2.50", calories: "400 kcal" },
    { id: 4, name: "Joghurt-Gurken-Dip", price: "€3.50", calories: "80 kcal" },
    { id: 5, name: "Frische Kräuter (Sabzi)", price: "€3.90", calories: "50 kcal" },
    { id: 6, name: "Extra Tahini-Sauce", price: "€1.50", calories: "90 kcal" }
  ],
  desserts: [
    {
      id: 1,
      name: "Baklava",
      description: "Traditionelles Blätterteiggebäck mit Walnüssen und Honigsirup.",
      price: "€4.90",
      calories: "380 kcal",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
    },
    {
      id: 2,
      name: "Persisches Safraneis",
      description: "Cremiges Eis mit Safran, Rosenwasser und Kardamom.",
      price: "€4.50",
      calories: "280 kcal",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
    },
    {
      id: 3,
      name: "Rollet Cake",
      description: "Leichte Biskuitrolle mit Sahne gefüllt.",
      price: "€4.90",
      calories: "320 kcal",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
    }
  ],
  getranke: [
    { id: 1, name: "Doogh (Joghurtgetränk)", price: "€3.50" },
    { id: 2, name: "Persischer Tee", price: "€2.90" },
    { id: 3, name: "Bio-Granatapfelsaft", price: "€4.50" },
    { id: 4, name: "Ayran", price: "€3.00" },
    { id: 5, name: "Softdrinks", price: "€2.90" },
    { id: 6, name: "Wasser (still/sprudelnd)", price: "€2.50" }
  ],
  familienplatten: [
    {
      id: 1,
      name: "Familien Platte #1",
      description: "2x Kubideh, 2x Joojeh Kabob, Reis, Salat und Brot. Perfekt für 4 Personen.",
      price: "€54.90",
      serves: "4 Personen"
    },
    {
      id: 2,
      name: "Familien Platte #2",
      description: "2x Kubideh, 2x Chenjeh, 1x Joojeh, Reis, Salat und Brot. Perfekt für 5 Personen.",
      price: "€69.90",
      serves: "5 Personen"
    },
    {
      id: 3,
      name: "Oria's Party Platte",
      description: "4x Kubideh, 3x Joojeh, 2x Barreh, 2x Chenjeh mit allem Drum und Dran.",
      price: "€119.90",
      serves: "8-10 Personen"
    }
  ]
};

// Blog Posts
export const blogPosts = [
  {
    id: 1,
    day: "15",
    month: "Jul",
    year: "2025",
    title: "Oria Grill eröffnet neue Filiale in Berlin",
    excerpt: "Wir freuen uns, die Eröffnung unserer neuen Filiale in Berlin-Mitte bekannt zu geben. Das neue Restaurant bietet Platz für 80 Gäste und verfügt über eine offene Küche.",
    category: "News",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    link: "/blog/neue-filiale-berlin"
  },
  {
    id: 2,
    day: "10",
    month: "Jun",
    year: "2025",
    title: "Auszeichnung: Bestes mediterranes Restaurant 2025",
    excerpt: "Oria Grill wurde vom Gastronomie-Verband als bestes mediterranes Restaurant in der Region ausgezeichnet. Diese Ehre verdanken wir unseren treuen Kunden.",
    category: "News",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80",
    link: "/blog/auszeichnung-2025"
  },
  {
    id: 3,
    day: "25",
    month: "Mai",
    year: "2025",
    title: "Sommer-Spezialitäten: Neue Gerichte auf der Karte",
    excerpt: "Entdecken Sie unsere neuen Sommer-Spezialitäten! Frische Salate, leichte Grillgerichte und erfrischende Getränke erwarten Sie.",
    category: "News",
    image: "https://images.unsplash.com/photo-1676471870459-909888c99fb5?w=600&q=80",
    link: "/blog/sommer-spezialitaten"
  }
];

// About Sections
export const aboutSections = [
  {
    id: 1,
    title: "Zutaten",
    description: "Oria Grill wurde mit dem Versprechen gegründet, nur die besten Zutaten zu verwenden. Von unseren zarten Kebabs bis zu unserer authentischen mediterranen Küche.",
    image: "https://images.unsplash.com/photo-1626323109252-0adb3b46692b?w=600&q=80",
    link: "/ingredients"
  },
  {
    id: 2,
    title: "Geschichte",
    description: "Die Geschichte von Oria Grill beginnt mit bescheidenen Anfängen. Durch alles hindurch haben wir an dem Glauben festgehalten, niemals Kompromisse einzugehen.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    link: "/story"
  },
  {
    id: 3,
    title: "Vision & Werte",
    description: "Von unseren langsam geschmorten Eintöpfen bis zu unseren flammengebratenen Kebabs - Oria Grill basiert auf Qualität, Geschmack und Beziehungen.",
    image: "https://images.unsplash.com/photo-1685798830572-f07ff7635774?w=600&q=80",
    link: "/vision"
  }
];

// Locations
export const locations = [
  {
    id: 1,
    name: "Berlin Mitte",
    address: "Friedrichstraße 123",
    city: "10117 Berlin",
    phone: "+49 30 1234567",
    hours: "Mo-So: 11:00 - 22:00",
    orderLink: "#",
    cateringLink: "#"
  },
  {
    id: 2,
    name: "München Maxvorstadt",
    address: "Maximilianstraße 45",
    city: "80539 München",
    phone: "+49 89 7654321",
    hours: "Mo-So: 11:00 - 23:00",
    orderLink: "#",
    cateringLink: "#"
  },
  {
    id: 3,
    name: "Hamburg Altstadt",
    address: "Jungfernstieg 12",
    city: "20354 Hamburg",
    phone: "+49 40 9876543",
    hours: "Mo-So: 11:30 - 22:30",
    orderLink: "#",
    cateringLink: "#"
  },
  {
    id: 4,
    name: "Frankfurt Innenstadt",
    address: "Zeil 89",
    city: "60313 Frankfurt",
    phone: "+49 69 1122334",
    hours: "Mo-So: 11:00 - 22:00",
    orderLink: "#",
    cateringLink: "#"
  },
  {
    id: 5,
    name: "Köln Zentrum",
    address: "Hohe Straße 56",
    city: "50667 Köln",
    phone: "+49 221 5544332",
    hours: "Mo-So: 11:00 - 22:00",
    orderLink: "#",
    cateringLink: "#"
  },
  {
    id: 6,
    name: "Düsseldorf Altstadt",
    address: "Königsallee 78",
    city: "40212 Düsseldorf",
    phone: "+49 211 6677889",
    hours: "Mo-So: 11:00 - 23:00",
    orderLink: "#",
    cateringLink: "#"
  }
];

// Story Content
export const storyContent = {
  title: "Unsere Geschichte",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  paragraphs: [
    "Oria Grill wurde auf einem Schlüsselbestandteil aufgebaut: Authentizität.",
    "Als wir 2010 unsere Türen öffneten, konzentrierten wir uns darauf, traditionelle mediterrane Küche mit höchster Qualität zu servieren. Unser Engagement, nur die besten Zutaten zu verwenden und niemals Kompromisse einzugehen, hat uns zu dem gemacht, was wir heute sind.",
    "Eines Tages entschied unser Gründer, einen traditionellen Lehmofen zu bauen - wie die Art, die in seiner Heimat verwendet werden - um frisches Fladenbrot für unsere Kunden zu backen. Dies schuf eine authentische Tradition, die Oria Grill zu dem machen sollte, was es heute ist.",
    "Der Erfolg des frischen Fladenbrots auf unserer Speisekarte war so spektakulär, dass es uns die Augen für neue Möglichkeiten öffnete. Wir konnten unsere hochwertigen Zutaten und sorgfältig entwickelten Rezepte für eine mediterran inspirierte Speisekarte verwenden - gefüllt mit den reichen Aromen persischer Gewürze, zartem Rind-, Hühner- und Lamm-Kebab.",
    "Seitdem haben wir unzählige Stunden damit verbracht, jedes Rezept akribisch zu perfektionieren, um sicherzustellen, dass es authentisch und köstlich ist. Die Umstellung auf authentische mediterrane Küche gab Oria Grill den Erfolg, den es brauchte, um weiter zu gedeihen.",
    "Durch all das hält Oria Grill weiterhin an dem Glauben fest, niemals Kompromisse bei der Qualität einzugehen. Dies ist die Inspiration hinter unseren Kebabs, Gyros, Falafel, Baklava und all unseren anderen Gerichten.",
    "Vielen Dank an unsere treuen Kunden, dass Sie Teil dieser großartigen Geschichte sind. Für Sie tun wir, was wir tun."
  ]
};
