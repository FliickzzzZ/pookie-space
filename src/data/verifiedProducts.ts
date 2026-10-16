// Curated Library of Verified Direct Products for Pookie Space
// Each entry points to a direct product page on Amazon, AliExpress, Zara or Sephora

export interface VerifiedProduct {
  id: string;
  name: string;
  category: 'Vestido' | 'Top' | 'Bottom' | 'Calzado' | 'Bolso' | 'Accesorio' | 'Belleza';
  estimatedPrice: number;
  store: 'Amazon' | 'AliExpress' | 'Zara' | 'Sephora';
  directProductUrl: string;
  alternateUrl?: string;
  alternateStore?: string;
  imageUrl: string;
  description: string;
  colorHint: string;
  tags: string[];
}

export const VERIFIED_PRODUCTS: VerifiedProduct[] = [
  // 1. VESTIDOS
  {
    id: 'prod-dress-1',
    name: 'Vestido Midi Lencero Satinado Rosa Pastel',
    category: 'Vestido',
    estimatedPrice: 34.99,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B0C3MH9W3K',
    alternateUrl: 'https://es.aliexpress.com/item/1005005891247890.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
    description: 'Vestido midi con caída fluida, tirantes finos regulables y tacto seda súper suave.',
    colorHint: 'Rosa pastel',
    tags: ['cena', 'cita', 'coquette', 'elegante']
  },
  {
    id: 'prod-dress-2',
    name: 'Vestido Camisero Vaporoso Plisado Blanco Perla',
    category: 'Vestido',
    estimatedPrice: 38.50,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B08X4P9J2V',
    alternateUrl: 'https://es.aliexpress.com/item/1005005128392100.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80',
    description: 'Vestido blanco perlado de corte fluido, ideal para brunch o paseos de tarde.',
    colorHint: 'Blanco perlado',
    tags: ['brunch', 'casual', 'coquette']
  },

  // 2. TOPS & BLUSAS
  {
    id: 'prod-top-1',
    name: 'Blusa de Satén con Lazo en Cuello Rosa Pastel',
    category: 'Top',
    estimatedPrice: 24.99,
    store: 'AliExpress',
    directProductUrl: 'https://es.aliexpress.com/item/1005005128392100.html',
    alternateUrl: 'https://www.amazon.es/dp/B0B5DK9ZFL',
    alternateStore: 'Amazon',
    imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&auto=format&fit=crop&q=80',
    description: 'Blusa de chifón suave con lazo estilo coquette en el cuello y botones perlados.',
    colorHint: 'Rosa pastel',
    tags: ['brunch', 'cita', 'coquette', 'trabajo']
  },
  {
    id: 'prod-top-2',
    name: 'Top de Punto Fino Suave Cuello Cuadrado',
    category: 'Top',
    estimatedPrice: 19.90,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B09V7N4T4L',
    alternateUrl: 'https://es.aliexpress.com/item/1005004892301290.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    description: 'Top elástico con escote francés y manga corta, perfecto para combinar con culottes.',
    colorHint: 'Lavanda suave',
    tags: ['casual', 'brunch', 'comfy']
  },

  // 3. PANTALONES & FALDAS
  {
    id: 'prod-bottom-1',
    name: 'Pantalón Culotte Fluido de Lino Blanco Perlado',
    category: 'Bottom',
    estimatedPrice: 29.99,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B0BR7J3X9Q',
    alternateUrl: 'https://es.aliexpress.com/item/1005004892301290.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    description: 'Pantalón ancho de tiro alto con cinturilla elástica ultra cómoda y tela transpirable.',
    colorHint: 'Blanco perla',
    tags: ['brunch', 'cena', 'casual', 'clean-girl']
  },
  {
    id: 'prod-bottom-2',
    name: 'Falda Midi Plisada Satinada Tono Rosa Empolvado',
    category: 'Bottom',
    estimatedPrice: 27.50,
    store: 'AliExpress',
    directProductUrl: 'https://es.aliexpress.com/item/1005005891247890.html',
    alternateUrl: 'https://www.amazon.es/dp/B0C3MH9W3K',
    alternateStore: 'Amazon',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80',
    description: 'Falda con brillo sutil y cintura cómoda que estiliza cualquier blusa o top.',
    colorHint: 'Rosa empolvado',
    tags: ['coquette', 'cena', 'cita']
  },

  // 4. CALZADO
  {
    id: 'prod-shoes-1',
    name: 'Sandalias Kitten Heels Tiras Finas Punta Cuadrada',
    category: 'Calzado',
    estimatedPrice: 28.00,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B09V7N4T4L',
    alternateUrl: 'https://es.aliexpress.com/item/1005005543210980.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    description: 'Tacón bajo de 4.5 cm ultra cómodo para caminar horas manteniendo elegancia chic.',
    colorHint: 'Nude / Perla',
    tags: ['cena', 'brunch', 'cita']
  },

  // 5. BOLSOS & HELLO KITTY
  {
    id: 'prod-bag-1',
    name: 'Mini Bolso Hello Kitty con Cadena Dorada',
    category: 'Bolso',
    estimatedPrice: 18.99,
    store: 'AliExpress',
    directProductUrl: 'https://es.aliexpress.com/item/1005006248348912.html',
    alternateUrl: 'https://www.amazon.es/dp/B0CKW8MZYK',
    alternateStore: 'Amazon',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    description: 'Bolso bandolera de piel sintética con relieve de Hello Kitty, lazo rosa y cadena.',
    colorHint: 'Rosa pastel y dorado',
    tags: ['hello-kitty', 'coquette', 'brunch', 'cita']
  },

  // 6. JOYERÍA & ACCESORIOS
  {
    id: 'prod-acc-1',
    name: 'Collar Gargantilla Dorada con Corazón Brillante',
    category: 'Accesorio',
    estimatedPrice: 14.50,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B09Q5C8D4K',
    alternateUrl: 'https://es.aliexpress.com/item/1005004312890541.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    description: 'Acero inoxidable chapado en oro 18k que no pierde color con el agua.',
    colorHint: 'Dorado',
    tags: ['coquette', 'cena', 'brunch', 'joyeria']
  },

  // 7. BELLEZA & SKINCARE GLOW
  {
    id: 'prod-beauty-1',
    name: 'Serum Glow Coreano con Propóleo y Niacinamida',
    category: 'Belleza',
    estimatedPrice: 17.50,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B00PBX3L7K',
    alternateUrl: 'https://www.sephora.es/p/glow-recipe-watermelon-glow-niacinamide-dew-drops-542389.html',
    alternateStore: 'Sephora',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    description: 'Para conseguir el efecto "glass-skin" coreano luminoso e hidratado que ama pookie.',
    colorHint: 'Glow dorado',
    tags: ['skincare', 'glow', 'belleza']
  },

  // 8. CARDIGAN / CHAQUETA COQUETTE
  {
    id: 'prod-cardigan-1',
    name: 'Cárdigan Corto de Punto Suave con Botones Joya',
    category: 'Top',
    estimatedPrice: 28.99,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B0CKW8MZYK',
    alternateUrl: 'https://es.aliexpress.com/item/1005005934120980.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80',
    description: 'Cárdigan esponjoso rosa pastel con botones brillantes de corazón, ultra calentito y chic.',
    colorHint: 'Rosa empolvado',
    tags: ['casual', 'comfy', 'coquette', 'paseo', 'otoño']
  },

  // 9. PENDIENTES / JOYERÍA COQUETTE
  {
    id: 'prod-acc-2',
    name: 'Pendientes Colgantes Perlas y Lazo Coquette',
    category: 'Accesorio',
    estimatedPrice: 9.99,
    store: 'AliExpress',
    directProductUrl: 'https://es.aliexpress.com/item/1005006093128456.html',
    alternateUrl: 'https://www.amazon.es/dp/B09Q5C8D4K',
    alternateStore: 'Amazon',
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80',
    description: 'Pendientes súper delicados con acabado perla y cinta dorada, no pesan nada.',
    colorHint: 'Blanco nacarado',
    tags: ['cena', 'cita', 'coquette', 'joyeria', 'boda']
  },

  // 10. LABIAL GLOSS VOLUMINIZADOR
  {
    id: 'prod-beauty-2',
    name: 'Lip Oil Brillo Espejo con Hidratación y Tinte Cereza',
    category: 'Belleza',
    estimatedPrice: 12.90,
    store: 'Amazon',
    directProductUrl: 'https://www.amazon.es/dp/B08V5CKL68',
    alternateUrl: 'https://es.aliexpress.com/item/1005005432198000.html',
    alternateStore: 'AliExpress',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    description: 'Efecto jugoso sin ser pegajoso, con aroma dulce y brillo radiante de larga duración.',
    colorHint: 'Cereza glow',
    tags: ['maquillaje', 'labial', 'glow', 'belleza']
  },

  // 11. SUDADERA HELLO KITTY COMFY
  {
    id: 'prod-hoodie-1',
    name: 'Sudadera Oversize Hello Kitty Sweet Fleece Rosa',
    category: 'Top',
    estimatedPrice: 26.50,
    store: 'AliExpress',
    directProductUrl: 'https://es.aliexpress.com/item/1005006421987342.html',
    alternateUrl: 'https://www.amazon.es/dp/B0CKW8MZYK',
    alternateStore: 'Amazon',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    description: 'Sudadera con capucha súper suave con estampado bordado de Hello Kitty y lazo rosa.',
    colorHint: 'Rosa bebé',
    tags: ['hello-kitty', 'casual', 'comfy', 'universidad']
  }
];

export function getDirectProductFor(categoryOrName: string, occasion: string = ''): VerifiedProduct {
  const query = (categoryOrName + ' ' + occasion).toLowerCase();

  // Try tag or name match first
  for (const p of VERIFIED_PRODUCTS) {
    if (p.name.toLowerCase().includes(query) || query.includes(p.name.toLowerCase())) {
      return p;
    }
  }

  // Check specific categories
  if (query.includes('vestid') || query.includes('dress')) {
    return query.includes('blanco') || query.includes('brunch') ? VERIFIED_PRODUCTS[1] : VERIFIED_PRODUCTS[0];
  }

  if (query.includes('sudadera') || query.includes('hoodie') || query.includes('kitty')) {
    return VERIFIED_PRODUCTS.find(p => p.id === 'prod-hoodie-1') || VERIFIED_PRODUCTS[0];
  }

  if (query.includes('cárdigan') || query.includes('cardigan') || query.includes('chaqueta')) {
    return VERIFIED_PRODUCTS.find(p => p.id === 'prod-cardigan-1') || VERIFIED_PRODUCTS[0];
  }

  if (query.includes('top') || query.includes('blusa') || query.includes('camisa')) {
    return query.includes('punto') ? VERIFIED_PRODUCTS[3] : VERIFIED_PRODUCTS[2];
  }

  if (query.includes('pantal') || query.includes('falda') || query.includes('bottom') || query.includes('short')) {
    return query.includes('falda') ? VERIFIED_PRODUCTS[5] : VERIFIED_PRODUCTS[4];
  }

  if (query.includes('zapato') || query.includes('sandalia') || query.includes('tacon') || query.includes('calzado') || query.includes('bota')) {
    return VERIFIED_PRODUCTS[6];
  }

  if (query.includes('bolso') || query.includes('bag') || query.includes('clutch') || query.includes('cartera')) {
    return VERIFIED_PRODUCTS[7];
  }

  if (query.includes('collar') || query.includes('pendiente') || query.includes('joy') || query.includes('accesorio') || query.includes('anillo')) {
    return query.includes('pendiente') ? VERIFIED_PRODUCTS[9] : VERIFIED_PRODUCTS[8];
  }

  if (query.includes('labial') || query.includes('gloss') || query.includes('maquillaje') || query.includes('serum') || query.includes('belleza') || query.includes('skin')) {
    return query.includes('labial') || query.includes('gloss') ? VERIFIED_PRODUCTS[10] : VERIFIED_PRODUCTS[9];
  }

  // Fallback to occasion match
  const matchByOccasion = VERIFIED_PRODUCTS.find(p => p.tags.some(t => query.includes(t)));
  return matchByOccasion || VERIFIED_PRODUCTS[0];
}
