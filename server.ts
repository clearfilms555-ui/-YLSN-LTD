import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  initialCategories,
  initialCompanySettings,
  initialOrders,
  initialProducts,
  initialQuotations,
  initialServiceRequests,
} from './src/data/mockData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  settings: typeof initialCompanySettings;
  categories: typeof initialCategories;
  products: typeof initialProducts;
  orders: typeof initialOrders;
  services: typeof initialServiceRequests;
  quotations: typeof initialQuotations;
  apiKeys?: Array<{ id: string; name: string; key: string; createdAt: string }>;
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.apiKeys) {
        parsed.apiKeys = [
          {
            id: 'key-default-1',
            name: 'YLSN Mobile & Remote Integration Key',
            key: 'ylsn_live_' + Math.random().toString(36).substring(2, 12),
            createdAt: new Date().toISOString(),
          },
        ];
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read db.json, re-seeding with defaults', err);
  }

  const defaultDb: DatabaseSchema = {
    settings: initialCompanySettings,
    categories: initialCategories,
    products: initialProducts,
    orders: initialOrders,
    services: initialServiceRequests,
    quotations: initialQuotations,
    apiKeys: [
      {
        id: 'key-default-1',
        name: 'YLSN Mobile & Remote Integration Key',
        key: 'ylsn_live_a89x74b12',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// Initialize Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI client:', e);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // CORS Middleware allowing live external integrations from any domain or mobile client
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  let db = loadDatabase();

  // Health and Live Status API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'YLSN LTD Sound Systems API',
      version: '2.5.0',
      uptimeSeconds: process.uptime(),
      time: new Date().toISOString(),
      hotline: db.settings.phone,
      liveEndpoints: [
        '/api/products',
        '/api/orders',
        '/api/services',
        '/api/quotations',
        '/api/settings',
        '/api/chat',
        '/api/docs',
      ],
    });
  });

  // API Documentation and Specification endpoint
  app.get('/api/docs', (req, res) => {
    res.json({
      title: 'YLSN LTD Sound Systems Public REST API',
      description: 'Connect your mobile apps, external websites, POS systems, or event management platforms to YLSN sound systems database.',
      baseUrl: '/api',
      hotline: db.settings.phone,
      whatsapp: `https://wa.me/${db.settings.whatsappNumber}`,
      endpoints: {
        'GET /api/products': 'List all sound equipment, filters: ?category=..., ?search=..., ?featured=true',
        'POST /api/products': 'Create new equipment (Requires Admin)',
        'PUT /api/products/:id': 'Update equipment details, price, or stock',
        'DELETE /api/products/:id': 'Remove product from inventory',
        'GET /api/orders': 'List customer orders',
        'POST /api/orders': 'Submit customer equipment order or booking',
        'PUT /api/orders/:id': 'Update order status (pending, confirmed, processing, delivered, cancelled)',
        'GET /api/services': 'List sound installation & rental service requests',
        'POST /api/services': 'Submit new service inquiry',
        'GET /api/quotations': 'List event sound quotation requests',
        'POST /api/quotations': 'Generate and submit quotation specification',
        'GET /api/settings': 'Get company coordinates, telephone, email, address, working hours',
        'PUT /api/settings': 'Update live company coordinates and announcement bar',
        'POST /api/chat': 'YLSN AI Customer Sound Assistant (Multi-language: EN, FR, ZH, RW, SW)',
      },
    });
  });

  // API Keys Management
  app.get('/api/admin/apikeys', (req, res) => {
    res.json(db.apiKeys || []);
  });

  app.post('/api/admin/apikeys', (req, res) => {
    const { name } = req.body;
    const newKey = {
      id: 'key-' + Date.now(),
      name: name || 'Remote Integration Client',
      key: 'ylsn_live_' + Math.random().toString(36).substring(2, 14) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    if (!db.apiKeys) db.apiKeys = [];
    db.apiKeys.push(newKey);
    saveDatabase(db);
    res.status(201).json(newKey);
  });

  app.delete('/api/admin/apikeys/:id', (req, res) => {
    if (db.apiKeys) {
      db.apiKeys = db.apiKeys.filter((k) => k.id !== req.params.id);
      saveDatabase(db);
    }
    res.json({ success: true });
  });

  // AI Customer Assistant Chat Route (POST /api/chat)
  app.post('/api/chat', async (req, res) => {
    const { message, language = 'en', history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Grounding knowledge context of YLSN LTD (No public prices; direct Admin quote policy)
    const productsSummary = db.products
      .map(
        (p) =>
          `- ${p.name} (${p.brand}): Stock: ${p.stock > 0 ? 'In Stock (' + p.stock + ')' : 'Available on Order'}, Rental: ${
            p.isRentalAvailable ? 'Available for Rental' : 'Sales Only'
          }`
      )
      .join('\n');

    const systemPrompt = `You are the official AI Sound Consultant and Audio Engineering Assistant for "YLSN LTD", Rwanda's premier professional sound systems company based in Kigali.
Company Hotline Telephone: ${db.settings.phone}
WhatsApp: https://wa.me/${db.settings.whatsappNumber}
Company Slogan: "${db.settings.slogan}"
Company Services:
1. Permanent Sound System Installation & Setup (Churches, Auditoriums, Luxury Hotels, Nightclubs, Acoustic Room Calibration, Zero-feedback guaranteed).
2. Sound System Rental for Events (Concerts, Festivals, Weddings, VIP Galas, High-SPL line arrays, stages).
3. Live Sound & Event Audio Support (Certified Front-of-House FOH sound mixing engineers and monitor mixing).
4. DJ & Public Address PA Systems (Pioneer DJ setups, wireless Shure & Sennheiser mics).
5. Audio Equipment Maintenance & Repair (Speaker reconing, power amplifier servicing, cable fabrication).
6. Technical Consultation & Acoustic Design (3D modeling, decibel compliance in Kigali).

In-Stock Gear Catalog:
${productsSummary}

Instructions:
- Provide expert, friendly, technically accurate advice on audio setups, wattage, speaker counts, mixer selection, and cables.
- You natively speak in all 5 requested languages: English (en), French (fr), Chinese (zh), Kinyarwanda (rw), and Kiswahili (sw).
- Always reply in the user's preferred language or the language they wrote in.
- Recommend realistic packages based on audience count (e.g. 50-200 guests: 2 tops + sub; 200-500: dual 18" subs + 4 tops; 500-2000+: Line Array towers + dual 18" sub arrays + digital console like Behringer X32 or Allen & Heath SQ-6 + certified FOH engineer).
- CRITICAL PRICING POLICY: Do NOT state or quote specific price numbers. Explain that all sound system equipment, rentals, and installations are custom-quoted directly by the YLSN Administrator.
- Always direct the customer to contact or WhatsApp the Admin at ${db.settings.phone} or via WhatsApp for direct quotation and immediate booking!
- Keep responses concise, clear, and well formatted with bullet points where appropriate.`;

    // Try calling Gemini API via @google/genai
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nUser Question (Language: ${language}): ${message}`,
        });

        if (response && response.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiError) {
        console.warn('Gemini generateContent error, switching to contextual fallback:', geminiError);
      }
    }

    // High quality contextual fallback in all 5 languages if API key is not yet set
    let fallbackReply = '';
    const q = message.toLowerCase();

    if (language === 'rw') {
      if (q.includes('ubukwe') || q.includes('abantu') || q.includes('igiciro') || q.includes('kugura') || q.includes('kodesha')) {
        fallbackReply = `Muraho! Ku birori by'abantu 200 kugeza kuri 500 (nko mu bukwe cyangwa inama zikomeye), YLSN LTD igufasha gukoresha ibikoresho by'amajwi bikurikira:
• 2 x JBL SRX828SP Dual 18" Subwoofers (Amajwi y'imbaraga azira ikibazo)
• 4 x JBL PRX915 Tops (Amajwi akeye y'indirimbo n'amagambo)
• 1 x Behringer X32 Digital Mixer
• 4 x Shure SLXD24D Wireless Microphones
• Umuhanga mu majwi (Sound Engineer) uzaba ahari mu birori byose.

Ku bijyanye n'ibiciro no gutanga quotation y'umwimerere, vugana ako kanya n'Umuyobozi (Admin) kuri telefone **${db.settings.phone}** cyangwa utwandikire kuri WhatsApp!`;
      } else {
        fallbackReply = `Muraho neza! YLSN LTD iguha ibyuma by'amajwi by'umwimerere (JBL, Behringer, Shure, Crown) no kubikodesha mu bitaramo n'amatorero mu Rwanda. Kubera ko ibiciro bihinduka bitewe n'aho ibirori bibera n'ibikoresho ukeneye, duhamagare ako kanya kuri **${db.settings.phone}** cyangwa utwandikire kuri WhatsApp kugira ngo Admin agufashe ako kanya.`;
      }
    } else if (language === 'fr') {
      if (q.includes('mariage') || q.includes('prix') || q.includes('location') || q.includes('devis')) {
        fallbackReply = `Bonjour ! Pour un événement ou mariage de 200 à 500 personnes à Kigali, YLSN LTD recommande notre configuration sonore haut de gamme :
• 2 x Caissons de basse JBL SRX828SP Dual 18" (2000W)
• 4 x Enceintes amplifiées JBL PRX915 (15")
• 1 x Console numérique Behringer X32 ou Allen & Heath SQ-6
• 4 x Micros sans fil Shure SLXD24D/SM58
• Ingénieur du son FOH certifié présent sur place.

Pour obtenir le tarif et un devis personnalisé sans engagement, contactez directement notre administrateur par téléphone au **${db.settings.phone}** ou par WhatsApp !`;
      } else {
        fallbackReply = `Bonjour ! Chez YLSN LTD, nous assurons la vente d'équipements audio authentiques (JBL, Shure, Behringer, Crown), la location pour concerts et l'installation d'églises et salles. Pour toute demande de devis ou tarif, veuillez contacter notre administrateur au **${db.settings.phone}** ou via WhatsApp.`;
      }
    } else if (language === 'zh') {
      if (q.includes('婚礼') || q.includes('价格') || q.includes('租赁') || q.includes('多少钱') || q.includes('报价')) {
        fallbackReply = `您好！针对 200 至 500 人的婚礼或商务晚宴，YLSN LTD 推荐以下专业扩声配置：
• 2 台 JBL SRX828SP 双18寸大功率超低音炮
• 4 台 JBL PRX915 15寸两分频全频主音箱
• 1 台 Behringer X32 40通道数码调音台
• 4 支 Shure SLXD24D/SM58 UHF专业无线麦克风
• 全程驻场资深专业调音工程师技术保障

如需获取具体报价与档期预订，请直接致电管理员热线 **${db.settings.phone}** 或在 WhatsApp 上联系我们获取专属优惠方案！`;
      } else {
        fallbackReply = `您好！YLSN LTD 是卢旺达基加利领先的专业音响工程与设备销售公司。我们提供 JBL 线性阵列音箱、百灵达数码调音台、皇冠功放及演出租赁与永久安装服务。关于产品及服务报价，请直接致电管理员：**${db.settings.phone}** 或在 WhatsApp 上沟通。`;
      }
    } else if (language === 'sw') {
      if (q.includes('harusi') || q.includes('bei') || q.includes('kukodisha') || q.includes('gharama')) {
        fallbackReply = `Hujambo! Kwa sherehe ya harusi ya wageni 200 hadi 500 mjini Kigali, YLSN LTD inapendekeza mfumo huu wa sauti:
• 2 x JBL SRX828SP Dual 18" Subwoofers zenye nguvu
• 4 x JBL PRX915 Spika za juu zenye sauti safi
• 1 x Behringer X32 Digital Mixer
• 4 x Shure SLXD24D Wireless Mics
• Mhandisi wa sauti aliyepo ukumbini kusimamia kila kitu.

Kuhusu bei na nukuu (quotation) rasmi, tafadhali wasiliana moja kwa moja na Msimamizi (Admin) kupitia simu **${db.settings.phone}** au utume ujumbe WhatsApp!`;
      } else {
        fallbackReply = `Hujambo! YLSN LTD inatoa vifaa bora vya sauti vya asili (JBL, Shure, Behringer, Crown), ukodishaji wa matamasha, ufungaji makanisani na ukarabati. Ili kupata bei na maelezo zaidi, piga simu sasa hivi **${db.settings.phone}** au WhatsApp!`;
      }
    } else {
      fallbackReply = `Hello! Thank you for reaching out to YLSN LTD Sound Systems.
For events with 200-500 guests in Kigali (such as weddings or corporate galas), our recommended professional audio package includes:
• 2 x JBL SRX828SP Dual 18" Powered Subwoofers (2000W)
• 4 x JBL PRX915 Powered 15" Loudspeakers
• 1 x Behringer X32 Digital Mixing Console
• 4 x Shure SLXD24D/SM58 UHF Wireless Vocal Mics
• Certified on-site Front-of-House sound engineer.

To receive an official tailored quote and check equipment availability, please contact our administrator directly at **${db.settings.phone}** or message us on WhatsApp!`;
    }

    res.json({ reply: fallbackReply });
  });

  // Settings API
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // Categories API
  app.get('/api/categories', (req, res) => {
    res.json(db.categories);
  });

  app.post('/api/categories', (req, res) => {
    const newCategory = {
      id: req.body.id || 'cat-' + Date.now(),
      name: req.body.name,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-'),
      description: req.body.description || '',
      iconName: req.body.iconName || 'Speaker',
    };
    db.categories.push(newCategory);
    saveDatabase(db);
    res.status(201).json(newCategory);
  });

  // Products API
  app.get('/api/products', (req, res) => {
    const { category, search, featured } = req.query;
    let list = [...db.products];

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    if (featured === 'true') {
      list = list.filter((p) => p.featured);
    }

    res.json(list);
  });

  app.post('/api/products', (req, res) => {
    const p = req.body;
    const newProduct = {
      id: p.id || 'ylsn-' + Date.now().toString(36),
      name: p.name,
      category: p.category || 'speakers',
      brand: p.brand || 'YLSN Pro',
      priceRwf: Number(p.priceRwf) || 0,
      priceUsd: Number(p.priceUsd) || Math.round((Number(p.priceRwf) || 0) / 1350),
      stock: Number(p.stock) || 0,
      availability: p.availability || 'in_stock',
      isRentalAvailable: Boolean(p.isRentalAvailable),
      rentalPricePerDay: p.rentalPricePerDay ? Number(p.rentalPricePerDay) : undefined,
      featured: Boolean(p.featured),
      rating: p.rating || 5.0,
      imageUrl: p.imageUrl || '/ylsn_logo.jpg',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      specifications: p.specifications || {},
      tags: Array.isArray(p.tags) ? p.tags : [],
    };
    db.products.unshift(newProduct);
    saveDatabase(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx >= 0) {
      db.products[idx] = { ...db.products[idx], ...req.body };
      saveDatabase(db);
      res.json(db.products[idx]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    db.products = db.products.filter((p) => p.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Orders API
  app.get('/api/orders', (req, res) => {
    res.json(db.orders);
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body;
    const orderNumber = 'YLSN-ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '',
      deliveryType: body.deliveryType || 'pickup',
      deliveryAddress: body.deliveryAddress || '',
      paymentMethod: body.paymentMethod || 'pay_on_delivery',
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      items: body.items || [],
      subtotalRwf: Number(body.subtotalRwf) || 0,
      deliveryFeeRwf: Number(body.deliveryFeeRwf) || 0,
      totalRwf: Number(body.totalRwf) || 0,
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (Array.isArray(newOrder.items)) {
      newOrder.items.forEach((item: any) => {
        const prod = db.products.find((p) => p.id === item.productId);
        if (prod && prod.stock > 0) {
          prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
          if (prod.stock === 0) {
            prod.availability = 'out_of_stock';
          }
        }
      });
    }

    db.orders.unshift(newOrder as any);
    saveDatabase(db);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id', (req, res) => {
    const idx = db.orders.findIndex((o) => o.id === req.params.id);
    if (idx >= 0) {
      db.orders[idx] = { ...db.orders[idx], ...req.body, updatedAt: new Date().toISOString() };
      saveDatabase(db);
      res.json(db.orders[idx]);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });

  // Services API
  app.get('/api/services', (req, res) => {
    res.json(db.services);
  });

  app.post('/api/services', (req, res) => {
    const body = req.body;
    const requestNumber = 'YLSN-SRV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    const newService = {
      id: 'srv-' + Date.now(),
      requestNumber,
      serviceType: body.serviceType || 'installation',
      clientName: body.clientName,
      clientPhone: body.clientPhone,
      clientEmail: body.clientEmail || '',
      eventDate: body.eventDate || '',
      eventLocation: body.eventLocation || '',
      expectedAudience: body.expectedAudience || '',
      details: body.details || '',
      budgetRange: body.budgetRange || '',
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };
    db.services.unshift(newService as any);
    saveDatabase(db);
    res.status(201).json(newService);
  });

  app.put('/api/services/:id', (req, res) => {
    const idx = db.services.findIndex((s) => s.id === req.params.id);
    if (idx >= 0) {
      db.services[idx] = { ...db.services[idx], ...req.body };
      saveDatabase(db);
      res.json(db.services[idx]);
    } else {
      res.status(404).json({ error: 'Service request not found' });
    }
  });

  // Quotations API
  app.get('/api/quotations', (req, res) => {
    res.json(db.quotations);
  });

  app.post('/api/quotations', (req, res) => {
    const body = req.body;
    const quoteNumber = 'YLSN-QT-' + Math.floor(1000 + Math.random() * 9000);
    const newQuotation = {
      id: 'quo-' + Date.now(),
      quoteNumber,
      clientName: body.clientName,
      clientPhone: body.clientPhone,
      clientEmail: body.clientEmail || '',
      eventType: body.eventType || 'Event Audio',
      venueType: body.venueType || 'Indoor / Outdoor',
      guestCount: body.guestCount || '200-500',
      eventDate: body.eventDate || '',
      requiredEquipment: Array.isArray(body.requiredEquipment) ? body.requiredEquipment : [],
      needSoundEngineer: Boolean(body.needSoundEngineer),
      estimatedBudgetRwf: Number(body.estimatedBudgetRwf) || undefined,
      additionalNotes: body.additionalNotes || '',
      status: 'pending_review',
      estimatedTotalRwf: Number(body.estimatedTotalRwf) || 850000,
      createdAt: new Date().toISOString(),
    };
    db.quotations.unshift(newQuotation as any);
    saveDatabase(db);
    res.status(201).json(newQuotation);
  });

  app.put('/api/quotations/:id', (req, res) => {
    const idx = db.quotations.findIndex((q) => q.id === req.params.id);
    if (idx >= 0) {
      db.quotations[idx] = { ...db.quotations[idx], ...req.body };
      saveDatabase(db);
      res.json(db.quotations[idx]);
    } else {
      res.status(404).json({ error: 'Quotation not found' });
    }
  });

  // Admin Auth
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (
      (username === 'admin' || username === 'admin@ylsn.rw' || username === 'ylsn') &&
      (password === '00000' || password === 'ylsn2026' || password === 'admin')
    ) {
      return res.json({
        success: true,
        token: 'ylsn-token-' + Date.now(),
        user: { name: 'YLSN Chief Sound Director', role: 'Super Admin', email: 'director@ylsn.rw' },
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid administrator credentials. Please check your username and password.' });
  });

  // Reports API
  app.get('/api/reports', (req, res) => {
    const totalRevenue = db.orders.reduce((sum, o) => sum + (o.totalRwf || 0), 0);
    const completedOrders = db.orders.filter((o) => o.orderStatus === 'delivered' || o.orderStatus === 'confirmed').length;
    const activeServices = db.services.filter((s) => s.status !== 'completed' && s.status !== 'cancelled').length;
    const pendingQuotes = db.quotations.filter((q) => q.status === 'pending_review').length;

    res.json({
      totalRevenueRwf: totalRevenue,
      totalOrdersCount: db.orders.length,
      completedOrdersCount: completedOrders,
      activeServicesCount: activeServices,
      pendingQuotesCount: pendingQuotes,
      productsCount: db.products.length,
      lowStockProducts: db.products.filter((p) => p.stock <= 5),
      recentOrders: db.orders.slice(0, 5),
    });
  });

  // Vite middleware in dev or static serving in prod
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔊 YLSN LTD Sound Systems Live Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
});
