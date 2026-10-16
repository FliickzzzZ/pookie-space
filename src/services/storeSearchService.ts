// Store Search & Deep Link Service
// Modular architecture for Amazon and AliExpress with precise price and category filters

export interface StoreProvider {
  name: string;
  hasApiCredentials: boolean;
  buildSearchUrl: (query: string, category?: string, estimatedPrice?: number) => string;
  apiDocsNote: string;
}

export const AmazonProvider: StoreProvider = {
  name: 'Amazon',
  hasApiCredentials: false,
  buildSearchUrl: (query: string, category?: string, estimatedPrice?: number) => {
    const encoded = encodeURIComponent(query.trim());
    let url = `https://www.amazon.es/s?k=${encoded}`;
    
    // Category filter
    if (category) {
      if (category.toLowerCase().includes('ropa') || category.toLowerCase().includes('outfit') || category.toLowerCase().includes('vestido') || category.toLowerCase().includes('top') || category.toLowerCase().includes('calzado')) {
        url += '&i=fashion';
      } else if (category.toLowerCase().includes('belleza') || category.toLowerCase().includes('skincare')) {
        url += '&i=beauty';
      }
    }

    // Target price bounding (e.g. +/- 35% around estimated budget)
    if (estimatedPrice && estimatedPrice > 0) {
      const min = Math.max(5, Math.round(estimatedPrice * 0.65));
      const max = Math.round(estimatedPrice * 1.35);
      url += `&low-price=${min}&high-price=${max}`;
    }

    return url;
  },
  apiDocsNote: 'La API oficial de Amazon (PA-API) requiere aprobación del Programa de Afiliados. Se aplican filtros de departamento de moda y rangos de precio automáticos.'
};

export const AliExpressProvider: StoreProvider = {
  name: 'AliExpress',
  hasApiCredentials: false,
  buildSearchUrl: (query: string, _category?: string, estimatedPrice?: number) => {
    const encoded = encodeURIComponent(query.trim());
    let url = `https://es.aliexpress.com/wholesale?SearchText=${encoded}&sortType=total_tranpro_desc`;

    // Strict price filter on AliExpress to prevent showing 140€ gowns when looking for 35€ dresses
    if (estimatedPrice && estimatedPrice > 0) {
      const min = Math.max(5, Math.round(estimatedPrice * 0.6));
      const max = Math.round(estimatedPrice * 1.35);
      url += `&minPrice=${min}&maxPrice=${max}`;
    }

    return url;
  },
  apiDocsNote: 'La API oficial de AliExpress Open Platform requiere cuenta corporativa de desarrollador. Se aplican filtros de precio máximo/mínimo y ordenación por ventas para resultados exactos.'
};

export const ZaraProvider: StoreProvider = {
  name: 'Zara',
  hasApiCredentials: false,
  buildSearchUrl: (query: string) => {
    const encoded = encodeURIComponent(query.trim());
    return `https://www.zara.com/es/es/search?searchTerm=${encoded}`;
  },
  apiDocsNote: 'Búsqueda oficial en catálogo web de Zara.'
};

export const SephoraProvider: StoreProvider = {
  name: 'Sephora',
  hasApiCredentials: false,
  buildSearchUrl: (query: string) => {
    const encoded = encodeURIComponent(query.trim());
    return `https://www.sephora.es/buscar?q=${encoded}`;
  },
  apiDocsNote: 'Búsqueda oficial en catálogo web de Sephora.'
};

export function getStoreSearchUrl(store: string, query: string, category?: string, estimatedPrice?: number): string {
  switch (store.toLowerCase()) {
    case 'amazon':
      return AmazonProvider.buildSearchUrl(query, category, estimatedPrice);
    case 'aliexpress':
      return AliExpressProvider.buildSearchUrl(query, category, estimatedPrice);
    case 'zara':
      return ZaraProvider.buildSearchUrl(query);
    case 'sephora':
      return SephoraProvider.buildSearchUrl(query);
    default:
      return AmazonProvider.buildSearchUrl(query, category, estimatedPrice);
  }
}
