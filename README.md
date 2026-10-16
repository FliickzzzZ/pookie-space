# Pookie Space 💗

> **Tu espacio personal, exclusivo y chic con naimnecita, tu asistente inteligente ✨**

![Pookie Space Banner](https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=1200&auto=format&fit=crop&q=80)

Una aplicación web progresiva (PWA) de nivel estudio de diseño, desarrollada con amor para una experiencia femenina, fluida, acogedora y personalizada.

---

## 🎀 Identidad del Proyecto

* **Nombre de la Aplicación:** Pookie Space
* **Nombre de la Asistente Personal de IA:** **naimnecita**
* **Nombre de la Usuaria:** **pookie**
* **Bienvenida Oficial:**
  > *"Bienvenida, pookie 💗"*
  > *"Soy naimnecita, tu asistente personal ✨"*

---

## 🌸 Estética Visual & UX/UI

* **Paleta de Colores:** Rosa pastel, blanco perlado, rosa empolvado, detalles en lavanda y toques dorados suaves.
* **Componentes:** Tarjetas de cristal difuminado (*glassmorphism*), sombras suaves, bordes redondeados orgánicos.
* **Tipografías:** Plus Jakarta Sans & Playfair Display (Google Fonts).
* **Animaciones:** Framer Motion con transiciones suaves, carruseles dinámicos y microinteracciones de sonido táctil con Web Audio API.
* **Confetti:** Celebraciones con `canvas-confetti` al completar citas o guardar prendas.
* **Accesibilidad:** Respeto estricto del estándar `prefers-reduced-motion`.

---

## 💖 Módulos & Funcionalidades

### 1. 🏠 Inicio (Dashboard)
* Saludo dinámico según la hora del día (*Buenos días*, *Buenas tardes*, *Buenas noches, pookie*).
* Barra de acceso rápido con sugerencias directas para naimnecita.
* Carrusel horizontal interactivo con looks del día, citas destacadas y deseos de la wishlist.
* Próximos eventos con casillas para marcar como completados y recordatorios.
* Deseos favoritos con enlaces directos a tiendas.

### 2. 💬 naimnecita (Asistente de IA)
* Conversación natural, cariñosa, sofisticada y divertida en español.
* Integración con **Gemini API (Gemini 2.5 Flash)** en modalidad 100% gratuita (0 € en Google AI Studio).
* **Modo Inteligente Local sin clave:** Funciona de inmediato sin necesidad de ingresar API key para pruebas instantáneas.
* **Herramientas Internas (Tool-Calling / Actions):**
  * Creación y programación de eventos en el calendario.
  * Generación y desglose de outfits con presupuestos.
  * Guardado automático de productos sugeridos en la Wishlist.
* Lectura de respuestas en voz alta (*Speech Synthesis*) en español.

### 3. 🛍️ Personal Shopper Inteligente
* Generador de looks adaptados a eventos (*Cena con amigas*, *Cita romántica*, *Brunch*, *Boda*, etc.).
* Desglose de presupuesto exacto (ej. *"Naimnecita, quiero un outfit para una cena con un presupuesto de 80 €"*).
* Búsqueda en tiendas verificadas (**Amazon ES** y **AliExpress**) mediante enlaces directos optimizados y transparentes, sin scraping no autorizado.
* Opción de añadir cada pieza a la Wishlist con 1 solo clic.

### 4. 📅 Calendario Inteligente
* Vistas de **Mes**, **Semana** y **Día**.
* Comprensión de lenguaje natural: *"Pookie, recuérdame mañana a las 5 que tengo que estudiar"*.
* Categorías con códigos de color pastel (*Cita*, *Estudio*, *Belleza & Self-care*, *Social*, *Compras*, *Importante*).
* Recordatorios anticipados (5 min, 15 min, 1 hora, 1 día antes) vinculados al Service Worker.

### 5. 🎁 Wishlist
* Lista organizada con categorías (*Outfits*, *Belleza & Skincare*, *Accesorios*, *Decoración*, *Varios*).
* Filtros por categoría, búsqueda por texto, ordenación y cálculo de presupuesto total.
* Selector de estado *Comprado* con celebración de confetti.

### 6. 🎀 Mi Perfil & Gustos
* Cuestionario de Onboarding interactivo en 10 slides animadas:
  * Colores favoritos
  * Estilos de ropa (*Coquette*, *Clean Girl*, *Old Money*, etc.)
  * Ocasiones de outfit
  * Productos de belleza & skincare
  * Accesorios imprescindibles
  * Intereses personales
  * Presupuesto habitual
  * Tiendas favoritas
  * Lo que NO le gusta (reglas de exclusión)
  * Notas personales
* Selector de avatar con iconos exclusivos.
* Estadísticas en tiempo real de deseos y eventos.

### 7. 🔔 Notificaciones al Móvil & PWA
* Aplicación web progresiva instalable en iOS y Android.
* `manifest.json` y `sw.js` (Service Worker) con cache offline y gestión de notificaciones push.
* Guías visuales paso a paso para instalación en Safari (iOS) y Chrome (Android).

---

## 🔒 Seguridad & Presupuesto 0 €

* **Costo de ejecución:** **0 €**. No requiere servidores de pago ni servicios facturables.
* **Almacenamiento seguro:** Las preferencias, conversaciones y la API Key de Gemini se guardan en el almacenamiento local del dispositivo (`localStorage`).
* **Sin filtración de secretos:** Ninguna clave confidencial se compila ni se publica en repositorios públicos.

---

## 🚀 Despliegue en GitHub Pages

El proyecto incluye un flujo de trabajo automatizado con **GitHub Actions** en `.github/workflows/deploy.yml`. Al recibir autorización y subir a la rama `main`, la aplicación se compila y se publica automáticamente en GitHub Pages.

---

*Hecho con amor y delicadeza para pookie 💗*
