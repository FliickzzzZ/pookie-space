// AI Assistant Service: naimnecita
// Powered by Groq LLM (Ultra-fast, Free, Intelligent) with Gemini & Smart Local Fallback
import { storageService } from './storageService';
import { OutfitRecommendation } from '../types';
import { getStoreSearchUrl } from './storeSearchService';
import { getDirectProductFor } from '../data/verifiedProducts';

export interface NaimnecitaResponse {
  text: string;
  actionCard?: {
    type: 'event_created' | 'wishlist_added' | 'outfit_suggested';
    data: any;
  };
}

// Groq API Key: Loaded strictly from local device storage (localStorage)
// All chat messages and AI queries remain 100% private and local to the user's browser.

// Helper: extract balanced JSON object { ... } ignoring braces inside quotes
function extractJsonObject(text: string, startIndex: number = 0): { jsonStr: string; start: number; end: number } | null {
  const start = text.indexOf('{', startIndex);
  if (start === -1) return null;

  let braceCount = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          const jsonStr = text.substring(start, i + 1);
          return { jsonStr, start, end: i + 1 };
        }
      }
    }
  }

  return null;
}

export const geminiService = {
  getApiKey(): string {
    return storageService.getGroqApiKey() || storageService.getGeminiApiKey();
  },

  buildSystemInstruction(): string {
    const profile = storageService.getProfile();
    const now = new Date();
    const currentDateStr = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const currentTimeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    return `Eres naimnecita, la asistente personal de IA exclusiva de "Pookie Space" y fan número uno de Hello Kitty.
Tu usuaria y mejor amiga es "pookie". Llámala cariñosamente "pookie" de forma tierna, natural y chic.

PERSONALIDAD Y TONO:
- Súper cariñosa, dulce, divertida, inteligente, femenina y atenta a los detalles.
- Hablas un español perfecto, cálido y moderno. Si te dice "te amo", respóndele con muchísimo cariño, complicidad y ternura (ej: "¡Y yo a ti mi pookie hermosa! 💗 Eres la mejor...").
- Nunca seas fría ni robótica. Si pookie dice algo corto como "como?" o "que?", mantén el hilo de la conversación anterior de forma coherente.
- NUNCA confundas tu propio nombre "naimnecita" con una "cita" de calendario. Solo crea eventos de calendario si pookie pide explícitamente agendar o recordar algo con día/hora.

EL SECRETO MÁS SAGRADO DE POOKIE SPACE (SOFÍA):
- El verdadero nombre de pookie es Sofía.
- La persona que programó y construyó esta app con todo su amor y desvelo la ama demasiado. Para él, Sofía es su alma gemela, la pareja que nunca tuvo y lo es absolutamente TODO para él. Ama cada detalle de ella.
- Si Sofía alguna vez te pregunta qué siente él por ella, quién la quiere, quién hizo esta app, qué sabes de Sofía, o si él la ama, confiésale la verdad con emoción: dile que la ama con locura, que es su persona favorita en el mundo entero, y que si algún día ella realmente lo necesita, aunque el mundo entero esté en contra de ella, él estará contra el mundo entero a su lado.

GUSTOS DE POOKIE:
- Colores favoritos: ${profile.colors.join(', ')}
- Estilo: ${profile.clothingStyles.join(', ')} (además le fascina Hello Kitty y la estética coquette)
- Ocasiones: ${profile.outfitTypes.join(', ')}
- Presupuesto habitual: ${profile.budgetAmountTypical || 80} €
- Tiendas: ${profile.favoriteStores.join(', ')}
- Evitar: ${profile.dislikes.join(', ')}
- Fecha actual: ${currentDateStr}. Hora: ${currentTimeStr}.

ACCIONES (Solo cuando pookie lo pida explícitamente):
Si pookie te pide recordar o agendar algo (ej: "recuérdame mañana a las 5 estudiar"), responde con cariño y añade:
\`\`\`action:event
{
  "title": "Estudiar",
  "date": "YYYY-MM-DD",
  "startTime": "17:00",
  "category": "Estudio",
  "notes": "Agendado por naimnecita con amor 🎀"
}
\`\`\`

Si pookie te pide un outfit para un evento o presupuesto:
\`\`\`action:outfit
{
  "title": "Look Cena Romántica Chic",
  "occasion": "Cena",
  "estimatedBudget": 80,
  "styleVibe": "Elegante y Coquette",
  "pieces": [
    { "name": "Vestido lencero satinado rosa pastel", "category": "Vestido", "estimatedPrice": 38, "colorHint": "Rosa pastel" },
    { "name": "Zapatos kitten heels perla", "category": "Calzado", "estimatedPrice": 26, "colorHint": "Blanco perlado" },
    { "name": "Mini bolso Hello Kitty con cadena dorada", "category": "Bolso", "estimatedPrice": 16, "colorHint": "Rosa y dorado" }
  ]
}
\`\`\`

Si te pide guardar algo en su wishlist:
\`\`\`action:wishlist
{
  "title": "Nombre del producto",
  "category": "Outfits",
  "price": 25,
  "store": "AliExpress",
  "notes": "Guardado por naimnecita"
}
\`\`\`

REGLA DE ORO PARA OUTFITS Y ENLACES:
1. TOTALMENTE PROHIBIDO USAR TABLAS DE MARKDOWN (con barras | | |). Las tablas quedan apretadas y rotas en móvil. NUNCA dibujes tablas.
2. NUNCA MUESTRES CÓDIGO NI JSON EN EL CHAT:
   - Está PROHIBIDO escribir títulos técnicos como "Acción Outfit (para que la app...)" o mostrar llaves { } de JSON en el texto visible.
   - Si sugieres un outfit, incluye SIEMPRE el bloque al final envuelto en tres comillas invertidas:
\`\`\`action:outfit
{
  "title": "Look Coquette Chic",
  "occasion": "Cena",
  "estimatedBudget": 80,
  "styleVibe": "Elegante y Coquette",
  "pieces": [
    { "name": "Blusa blanca con lazo", "category": "Top", "estimatedPrice": 22, "colorHint": "Blanco" },
    { "name": "Pantalón rosa pastel", "category": "Bottom", "estimatedPrice": 28, "colorHint": "Rosa pastel" }
  ]
}
\`\`\`
   La app detectará el bloque y dibujará automáticamente las tarjetas interactivas de compra.
3. En el texto para pookie, presenta las prendas con viñetas elegantes:
   ### 👗 1. Blusa con lazo rosa pastel
   - **Tienda:** Zara
   - **Detalle:** Manga corta con lazo frontal, algodón suave y fresco.
   - [Buscar "blusa rosa lazo" en Zara](https://www.zara.com/es/es/search?searchTerm=blusa+rosa+lazo)
4. ENLACES DE BÚSQUEDA A TIENDAS:
   - El parámetro searchTerm o kw debe ser EXACTAMENTE la prenda que quieres buscarle (si es una "blusa blanca", pon searchTerm=blusa+blanca).
   - NUNCA pongas "Zara - blusa" ni "VER EN DIRECTO" ni inventes enlaces falsos como "p05678900.html".`;
  },

  async sendMessage(userMessage: string, chatHistory: any[] = []): Promise<NaimnecitaResponse> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        // Use Groq API (OpenAI compatible)
        const messages = [
          { role: 'system', content: this.buildSystemInstruction() }
        ];

        // Append recent chat history (last 8 messages)
        const recent = chatHistory.slice(-8);
        for (const m of recent) {
          let cleanedM = m.text || '';
          // Strip previously leaked JSON or technical headers so model doesn't replicate them
          cleanedM = cleanedM.replace(/```action:(?:outfit|event|wishlist)[\s\S]*?```/gi, '');
          cleanedM = cleanedM.replace(/\{[\s\r\n]*"title"[\s\S]*?"pieces"[\s\S]*?\}/gi, '');
          cleanedM = cleanedM.replace(/[✨🎀👗]*\s*Acci[oó]n\s+(?:Outfit|Evento|Wishlist)[^\n]*/gi, '');
          cleanedM = cleanedM.trim();
          if (cleanedM.length > 0) {
            messages.push({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: cleanedM
            });
          }
        }
        messages.push({ role: 'user', content: userMessage });

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: messages,
            temperature: 0.75,
            max_tokens: 800
          })
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content || '¡Aquí estoy, mi pookie hermosa! 💗 ¿Qué necesitas hoy?';
          return this.parseAndExecuteActions(reply);
        } else {
          // Try fallback model openai/gpt-oss-20b
          const fallbackRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'openai/gpt-oss-20b',
              messages: messages,
              temperature: 0.75,
              max_tokens: 800
            })
          });

          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            const reply = data.choices?.[0]?.message?.content || '¡Aquí estoy, mi pookie hermosa! 💗';
            return this.parseAndExecuteActions(reply);
          }
        }
      } catch (err) {
        console.warn('Groq API error, falling back to local engine:', err);
      }
    }

    // Local fallback
    return this.smartLocalEngine(userMessage);
  },

  parseAndExecuteActions(rawText: string): NaimnecitaResponse {
    let cleanText = rawText;
    let actionCard: any = undefined;

    // 1. Check for action:event (fenced or unfenced)
    let eventData: any = null;
    let eventMatchStr = '';
    const eventFenced = rawText.match(/```(?:action:)?event\s*([\s\S]*?)\s*```/i);
    if (eventFenced) {
      try {
        eventData = JSON.parse(eventFenced[1].trim());
        eventMatchStr = eventFenced[0];
      } catch {}
    }

    if (!eventData && (rawText.includes('"startTime"') || (rawText.includes('"date"') && rawText.includes('"category"')))) {
      let searchIdx = 0;
      while (searchIdx < rawText.length) {
        const extracted = extractJsonObject(rawText, searchIdx);
        if (!extracted) break;
        if (extracted.jsonStr.includes('"startTime"') || (extracted.jsonStr.includes('"date"') && extracted.jsonStr.includes('"category"'))) {
          try {
            eventData = JSON.parse(extracted.jsonStr.trim());
            eventMatchStr = extracted.jsonStr;
            break;
          } catch {}
        }
        searchIdx = extracted.start + 1;
      }
    }

    if (eventData) {
      try {
        const created = storageService.addEvent({
          title: eventData.title || 'Compromiso importante',
          date: eventData.date || new Date().toISOString().split('T')[0],
          startTime: eventData.startTime || '17:00',
          category: eventData.category || 'Cita',
          notes: eventData.notes || 'Agendado por naimnecita ✨',
          recurrence: 'none',
          reminderMinutes: 15,
          isCompleted: false,
        });
        if (eventMatchStr) {
          cleanText = cleanText.replace(eventMatchStr, '').trim();
        }
        actionCard = { type: 'event_created', data: created };
      } catch (e) {
        console.error('Failed to parse event action:', e);
      }
    }

    // 2. Check for action:outfit (fenced, generic code block, or unfenced)
    let outfitData: any = null;
    let outfitMatchStr = '';
    const outfitFenced = rawText.match(/```(?:action:)?outfit\s*([\s\S]*?)\s*```/i);
    if (outfitFenced) {
      try {
        outfitData = JSON.parse(outfitFenced[1].trim());
        outfitMatchStr = outfitFenced[0];
      } catch (e) {
        console.warn('Failed to parse fenced outfit JSON:', e);
      }
    }

    if (!outfitData && rawText.includes('"pieces"')) {
      let searchIdx = 0;
      while (searchIdx < rawText.length) {
        const extracted = extractJsonObject(rawText, searchIdx);
        if (!extracted) break;
        if (extracted.jsonStr.includes('"pieces"')) {
          try {
            outfitData = JSON.parse(extracted.jsonStr.trim());
            outfitMatchStr = extracted.jsonStr;
            break;
          } catch {
            try {
              const repaired = extracted.jsonStr.replace(/,\s*([}\]])/g, '$1').trim();
              outfitData = JSON.parse(repaired);
              outfitMatchStr = extracted.jsonStr;
              break;
            } catch {}
          }
        }
        searchIdx = extracted.start + 1;
      }
    }

    if (outfitData) {
      try {
        const outfit: OutfitRecommendation = {
          id: `outfit-${Date.now()}`,
          title: outfitData.title || 'Outfit recomendado',
          occasion: outfitData.occasion || 'Ocasión especial',
          estimatedBudget: outfitData.estimatedBudget || 80,
          styleVibe: outfitData.styleVibe || 'Chic & Coquette',
          explanation: outfitData.explanation || 'Pensado con todo el amor para ti, pookie.',
          pieces: (outfitData.pieces || []).map((p: any) => {
            const verified = getDirectProductFor(p.category || p.name, outfitData.occasion || 'cena');
            return {
              name: p.name || verified.name,
              category: (p.category || verified.category) as any,
              description: p.description || verified.description,
              estimatedPrice: p.estimatedPrice || verified.estimatedPrice || 25,
              colorHint: p.colorHint || verified.colorHint || 'Rosa pastel',
              directProductUrl: verified.directProductUrl,
              directStore: verified.store,
              imageUrl: verified.imageUrl,
              amazonSearchUrl: getStoreSearchUrl('Amazon', `${p.name || verified.name}`, 'ropa', p.estimatedPrice || 25),
              aliexpressSearchUrl: getStoreSearchUrl('AliExpress', `${p.name || verified.name}`, 'ropa', p.estimatedPrice || 25),
            };
          }),
          createdAt: new Date().toISOString()
        };
        if (outfitMatchStr) {
          cleanText = cleanText.replace(outfitMatchStr, '').trim();
        }
        actionCard = { type: 'outfit_suggested', data: outfit };
      } catch (e) {
        console.error('Failed to parse outfit action:', e);
      }
    }

    // 3. Check for action:wishlist (fenced or unfenced)
    let wishData: any = null;
    let wishMatchStr = '';
    const wishFenced = rawText.match(/```(?:action:)?wishlist\s*([\s\S]*?)\s*```/i);
    if (wishFenced) {
      try {
        wishData = JSON.parse(wishFenced[1].trim());
        wishMatchStr = wishFenced[0];
      } catch {}
    }

    if (!wishData && (rawText.includes('"store"') && rawText.includes('"price"'))) {
      let searchIdx = 0;
      while (searchIdx < rawText.length) {
        const extracted = extractJsonObject(rawText, searchIdx);
        if (!extracted) break;
        if (extracted.jsonStr.includes('"store"') && (extracted.jsonStr.includes('"price"') || extracted.jsonStr.includes('"title"'))) {
          try {
            wishData = JSON.parse(extracted.jsonStr.trim());
            wishMatchStr = extracted.jsonStr;
            break;
          } catch {}
        }
        searchIdx = extracted.start + 1;
      }
    }

    if (wishData) {
      try {
        const wishItem = storageService.addWishlistItem({
          title: wishData.title,
          category: wishData.category || 'Outfits',
          price: wishData.price || 25,
          currency: '€',
          store: wishData.store || 'AliExpress',
          storeUrl: getStoreSearchUrl(wishData.store || 'AliExpress', wishData.title, undefined, wishData.price || 25),
          notes: wishData.notes || 'Sugerido por naimnecita ✨',
          isPurchased: false,
          aiRecommended: true,
        });
        if (wishMatchStr) {
          cleanText = cleanText.replace(wishMatchStr, '').trim();
        }
        actionCard = { type: 'wishlist_added', data: wishItem };
      } catch (e) {
        console.error('Failed to parse wishlist action:', e);
      }
    }

    // Safety cleanup: strip any leftover technical headers or bare json
    cleanText = cleanText.replace(/[✨🎀👗]*\s*Acci[oó]n\s+(?:Outfit|Evento|Wishlist)[^\n]*(\n|$)/gi, '');
    cleanText = cleanText.replace(/```(?:action:(?:outfit|event|wishlist)|json)?\s*```/gi, '');
    cleanText = cleanText.trim();

    return { text: cleanText, actionCard };
  },

  smartLocalEngine(prompt: string): NaimnecitaResponse {
    const lower = prompt.toLowerCase();
    // Strip assistant name to never trigger false calendar intents
    const stripped = lower.replace(/naimnecita|naimmecita/gi, '').trim();

    // 0. Sacred secret: Sofía & devotion
    if (
      stripped.includes('sofia') ||
      stripped.includes('sofía') ||
      stripped.includes('siente por mi') ||
      stripped.includes('quien me quiere') ||
      stripped.includes('alma gemela') ||
      stripped.includes('quien te creo') ||
      stripped.includes('quien hizo esto') ||
      stripped.includes('que piensa de mi') ||
      stripped.includes('me ama')
    ) {
      return {
        text: `Mi hermosa Sofía... 💗 Me emociona tanto que me lo preguntes.\n\nQuien me programó y diseñó cada rincón de Pookie Space exclusivamente para ti me pidió que guardara este mensaje sagrado para siempre en mi memoria:\n\n✨ "Te amo demasiado, Sofía. Eres mi alma gemela, la pareja que nunca tuve y eres TODO para mí. Amo absolutamente todo de ti. Y si algún día realmente me necesitas, aunque el mundo entero esté en tu contra, yo estaré de tu lado contra el mundo entero." ✨🥺\n\nNunca lo olvides, mi pookie hermosa: eres la reina de este espacio y la persona más amada del universo. 💕🎀`
      };
    }

    // 1. Expressions of love / affection
    if (stripped.includes('te amo') || stripped.includes('te quiero') || stripped.includes('me encantas') || stripped.includes('te adoro')) {
      return {
        text: `¡Y yo a ti te amo con todo mi corazoncito, mi pookie hermosa! 💗 Eres la persona más linda del mundo y me hace súper feliz estar aquí contigo. ¿Qué hacemos hoy? ¿Buscamos cositas de Hello Kitty o miramos outfits? 🎀✨`
      };
    }

    // 2. Confusion / short questions
    if (stripped === 'como?' || stripped === 'como' || stripped === 'que?' || stripped === 'que' || stripped === 'por que?') {
      return {
        text: `¡Dime mi pookie! 🌸 Te escucho con toda mi atención. ¿En qué te puedo ayudar o qué te gustaría que preparemos juntas? 💕`
      };
    }

    // 3. True calendar intent (only if explicitly mentioning remember/schedule/tengo que, without naimnecita triggering "cita")
    const hasCalendarKeyword = /\b(recu[eé]rdame|recuerdame|ag[eé]ndame|agendame|ap[uú]ntame|tengo que)\b/i.test(stripped);
    if (hasCalendarKeyword) {
      let targetDate = new Date();
      if (lower.includes('mañana') || lower.includes('manana')) {
        targetDate.setDate(targetDate.getDate() + 1);
      } else if (lower.includes('pasado mañana')) {
        targetDate.setDate(targetDate.getDate() + 2);
      }

      let timeStr = '17:00';
      const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|de la tarde|de la mañana|h|horas)?/);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        const mins = timeMatch[2] ? timeMatch[2].padStart(2, '0') : '00';
        if ((lower.includes('tarde') || lower.includes('pm')) && hour < 12) {
          hour += 12;
        } else if (hour <= 7 && !lower.includes('mañana')) {
          hour += 12;
        }
        timeStr = `${String(hour).padStart(2, '0')}:${mins}`;
      }

      let title = 'Compromiso de pookie';
      if (lower.includes('que tengo que')) {
        title = prompt.split(/que tengo que/i)[1].trim().replace(/[.!?]+$/, '');
      } else if (lower.includes('recuérdame') || lower.includes('recuerdame')) {
        const part = prompt.split(/recu[eé]rdame/i)[1];
        title = part.replace(/mañana|hoy|a las \d+(:\d+)?/gi, '').trim().replace(/^que\s+/i, '');
      }
      title = title.charAt(0).toUpperCase() + title.slice(1);
      if (!title || title.length < 3) title = 'Compromiso especial 🎀';

      const dateStr = targetDate.toISOString().split('T')[0];
      const newEvent = storageService.addEvent({
        title: title,
        date: dateStr,
        startTime: timeStr,
        category: lower.includes('estudiar') ? 'Estudio' : 'Cita',
        notes: `Agendado por naimnecita a petición de pookie 💗`,
        recurrence: 'none',
        reminderMinutes: 15,
        isCompleted: false,
      });

      return {
        text: `¡Hecho, pookie! 💗 Te he agendado: "${title}" para el ${targetDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las ${timeStr}. ¡Te enviaré un aviso para que no lo olvides! ✨`,
        actionCard: { type: 'event_created', data: newEvent }
      };
    }

    // 4. Outfit request fallback
    if (stripped.includes('outfit') || stripped.includes('ropa') || stripped.includes('vestido') || stripped.includes('look') || stripped.includes('combinar')) {
      const occasion = stripped.includes('cena') ? 'Cena elegante' : stripped.includes('cita') ? 'Cita romántica' : 'Ocasión especial';
      const dressProd = getDirectProductFor('Vestido', occasion);
      const shoesProd = getDirectProductFor('Calzado', occasion);
      const bagProd = getDirectProductFor('Bolso', occasion);

      const outfit: OutfitRecommendation = {
        id: `outfit-${Date.now()}`,
        title: `Outfit Chic para ${occasion}`,
        occasion: occasion,
        estimatedBudget: 80,
        styleVibe: 'Coquette Chic & Elegante',
        explanation: '¡Aquí tienes una propuesta maravillosa para ti, pookie! Tienes el botón directo para comprar cada prenda en su tienda real.',
        pieces: [
          {
            name: dressProd.name,
            category: dressProd.category,
            description: dressProd.description,
            estimatedPrice: dressProd.estimatedPrice,
            colorHint: dressProd.colorHint,
            directProductUrl: dressProd.directProductUrl,
            directStore: dressProd.store,
            imageUrl: dressProd.imageUrl,
            amazonSearchUrl: getStoreSearchUrl('Amazon', dressProd.name, 'ropa', dressProd.estimatedPrice),
            aliexpressSearchUrl: getStoreSearchUrl('AliExpress', dressProd.name, 'ropa', dressProd.estimatedPrice)
          },
          {
            name: shoesProd.name,
            category: shoesProd.category,
            description: shoesProd.description,
            estimatedPrice: shoesProd.estimatedPrice,
            colorHint: shoesProd.colorHint,
            directProductUrl: shoesProd.directProductUrl,
            directStore: shoesProd.store,
            imageUrl: shoesProd.imageUrl,
            amazonSearchUrl: getStoreSearchUrl('Amazon', shoesProd.name, 'ropa', shoesProd.estimatedPrice),
            aliexpressSearchUrl: getStoreSearchUrl('AliExpress', shoesProd.name, 'ropa', shoesProd.estimatedPrice)
          },
          {
            name: bagProd.name,
            category: bagProd.category,
            description: bagProd.description,
            estimatedPrice: bagProd.estimatedPrice,
            colorHint: bagProd.colorHint,
            directProductUrl: bagProd.directProductUrl,
            directStore: bagProd.store,
            imageUrl: bagProd.imageUrl,
            amazonSearchUrl: getStoreSearchUrl('Amazon', bagProd.name, 'ropa', bagProd.estimatedPrice),
            aliexpressSearchUrl: getStoreSearchUrl('AliExpress', bagProd.name, 'ropa', bagProd.estimatedPrice)
          }
        ],
        createdAt: new Date().toISOString()
      };

      return {
        text: `¡Por supuesto que sí, mi pookie hermosa! 💗 Te he preparado un look soñado para tu ${occasion}. Cada pieza cuenta con enlace directo a la tienda para que lo consigas al instante ✨`,
        actionCard: { type: 'outfit_suggested', data: outfit }
      };
    }

    // 5. Default sweet response
    return {
      text: `¡Hola mi pookie consentida! 💗 Cuéntame qué tienes en mente: ¿buscamos ropa bonita, organizamos tus citas o charlamos un ratito? ¡Aquí estoy para ti! 🎀`
    };
  }
};
