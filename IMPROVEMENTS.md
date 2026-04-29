📊 Diagnóstico general
 Tu ecommerce tiene buena base técnica (signals, OnPush, lazy loading, @defer, localStorage para carrito y dirección, límite de 5 unidades, modal de confirmación). El problema no es el código sino decisiones de diseño y flujo que hoy generan fricción y se ven "genéricos".

---

🎨 Diseño visual — qué cambiar

1. ✅ DONE — Identidad visual nula → todo es gris

- ✅ Acento de marca definido como token CSS (`--brand-accent: #ef3340`) + utilidades (`text-brand-accent`, `bg-brand-accent`, `border-brand-accent`).
- ✅ Botones primarios y CTAs ahora alternan negro absoluto / acento.
- ✅ Hero del Home y header del About con `bg-black text-white`, eyebrow en acento ("Streetwear · Arte · Córdoba"), patrón de puntos de fondo, título dramático "Remeras que son arte." con palabra clave en rojo.

2. ✅ DONE — Tipografía sin jerarquía de marca

- ✅ Cargado **Space Grotesk** (display) + **Inter** (body) desde Google Fonts con preconnect.
- ✅ `h1, h2, .font-display` usan Space Grotesk con `letter-spacing: -0.02em`.
- ✅ Body en Inter; system font como fallback.

3. ✅ DONE — ProductCard pobre

- ✅ Indicador de talles disponibles (línea separada por puntos).
- ✅ Swatches de colores (círculos reales con hex map).
- ✅ Hover lift (-translate-y-1) + sombra fuerte + borde negro al pasar.
- ✅ Overlay "Ver detalle →" con gradient en hover desktop.
- Botón "Agregar al carrito" rápido en hover (desktop) → no implementado (requiere selección de talle/color, complica UX).

4. ✅ DONE — Product detail anémico

- ✅ Talle como botones tipo pill (negro/blanco selección).
- ✅ Color como swatches clickeables con círculo de color real + label.
- ✅ Indicador "Seleccionado: X" al lado del label.
- ✅ Breadcrumbs (Inicio › Productos › nombre).
- ✅ Sección "También te puede gustar" con productos relacionados (4 cards).
- ✅ Galería con thumbnails laterales (se muestran solo si hay >1 imagen, signal `activeImage` controla la principal).
- ✅ CTA secundario "Consultar por WhatsApp" — reemplazado por mensaje informativo bajo los CTAs.

5. ✅ DONE — Hero sin producto

- ✅ Reemplazado por hero impactante en negro con eyebrow + headline grande + acento + CTA blanco que cambia a rojo en hover. (Mostrar imagen de producto a sangre queda pendiente — requiere asset de calidad.)

---

🧭 Flujo UX — fricciones reales

🔴 Críticas

1. ✅ DONE — No hay feedback al agregar al carrito. `p-toast` "Agregado al carrito" con detalle producto+talle+color, 3s, bottom-right. MessageService global.
2. ✅ DONE — Badge del carrito no anima. Pop animado (scale 0.4→1.25→1, cubic-bezier rebote, 320ms) cada vez que el contador sube.
3. ✅ DONE — Filtros sin "Limpiar todo". Visible (a) con contador "Mostrando N · Limpiar todo", (b) en empty state con botón outlined.
4. ✅ DONE — buyNow() y addToCart() hacen lo mismo. Renombrado a "Agregar e ir al carrito" con icono `pi-arrow-right` + el primario quedó como outlined "Agregar al carrito". El nombre ahora describe lo que pasa.
5. ✅ DONE — WhatsApp como único checkout. Botón final dice "Finalizar compra por WhatsApp" con ícono y nota. En el detalle también: aviso "El pedido se confirma por WhatsApp después de revisar el carrito."

🟡 Importantes

6. ✅ DONE — Selector de Google Maps confuso. Eliminado el botón engañoso. Reemplazado por hint útil: "Si no estás seguro de la dirección exacta, podés coordinarla por WhatsApp después." + placeholder mejorado del input.
7. ✅ DONE — Talles y colores en `p-multiSelect` para filtrar. Reemplazados por **chips toggleables** (botones con `aria-pressed`, círculo de color en cada uno). Mucho más mobile-friendly. **Bonus**: el bundle `products-routes` cayó de 387 kB → 35 kB al eliminar `MultiSelectModule`.
8. ✅ DONE — Costo de envío "Consultar". Cambiado a "Se coordina por WhatsApp" en el resumen.
9. ✅ DONE — Carrito vacío visualmente pobre. Empty state rediseñado: círculo gris con ícono grande, título "Tu carrito está vacío", subtítulo descriptivo, CTA con icono.
10. ✅ DONE — Productos relacionados al final del detalle (4 cards en grid 2 col mobile / 4 col desktop + link "Ver todo").

🟢 Pulido fino

11. ✅ DONE — Header/footer "LM Studio" como texto. Ahora hay un monograma "LM" en cuadrado negro + "Studio" en Space Grotesk, en header y footer.
12. ✅ DONE — Breadcrumbs en `/product/:id`.
13. ✅ DONE — Sin estados de carga. Barra superior animada de progreso (gradient acento, 3px, glow) que aparece en NavigationStart y desaparece en NavigationEnd/Cancel/Error.
14. ✅ DONE — Wishlist básica. `WishlistService` con localStorage + signals. Botón corazón en `ProductCard` (top-right, círculo con backdrop-blur). Estado reactivo via `computed`. Sin página dedicada — el corazón rojo (`pi-heart-fill text-brand-accent`) marca lo guardado.
15. ✅ DONE — Mensaje de cantidad. Migrado a `p-message` (severity error/warn) para consistencia.

---

⚙️ Bugs / detalles técnicos que vi de paso

- ✅ DONE — `@HostListener` migrado a `host` object en products.component.ts.
- ✅ DONE — `selectedSizesValue/selectedColorsValue` eliminados (workaround de MultiSelect ya no necesario; ahora chips trabajan directo sobre los signals).
- ✅ DONE — `!deliveryAddress` corregido a `!deliveryAddress()` en cart.

---

🎯 Mi recomendación de orden — todos ✅ DONE

1. ✅ Toast al agregar al carrito + animación del badge.
2. ✅ ProductCard rediseñada con swatches + talles + hover lift.
3. ✅ Selección de talle/color como chips/swatches en product-detail.
4. ⏳ Galería de imágenes en product-detail — pendiente (requiere mocks).
5. ✅ Botón "Limpiar filtros" visible.

Y en paralelo: ✅ acento de color de marca + ✅ display font.

---

## Resumen acumulado

**Aplicado en tanda 1:**
- Bug fix `!deliveryAddress`. Migración HostListener. Toast global. Badge animado. "Limpiar todo" + empty state. Pills/swatches en detalle. ProductCard rediseñada. WhatsApp anticipado.

**Aplicado en tanda 2:**
- Brand: Space Grotesk + Inter, token de acento rojo, hero/about en negro con eyebrow + headline grande.
- buyNow renombrado a "Agregar e ir al carrito" (CTA primario outlined "Agregar al carrito").
- Filtros talle/color como chips toggleables (eliminado MultiSelectModule, bundle -352 kB).
- Productos relacionados (4) al final del detalle.
- Breadcrumbs en detalle.
- "Se coordina por WhatsApp" en lugar de "Consultar".
- Empty cart con visual mejorado.
- Mensajes de cantidad como p-message.
- index.html: title, lang, description, preconnect Google Fonts.

**Verificado:** `ng build` compila sin errores.

**Aplicado en tanda 3:**
- Logo: monograma "LM" en cuadrado negro + "Studio" en display font (header + footer).
- Galería con thumbnails laterales en detalle (signal `activeImage`, condicional al ≥2 imágenes).
- Eliminado botón "Seleccionar ubicación en Google Maps" engañoso. Reemplazado por hint sobre coordinación por WhatsApp.
- Barra superior de progreso reactiva a eventos del Router.
- WishlistService + corazón toggle en ProductCard (acento de marca cuando está activo).

**Verificado:** `ng build` compila sin errores tras las 3 tandas.

**Pendiente (siguiente tanda sugerida):**
- Página dedicada `/wishlist` con listado de favoritos + contador en header.
- Botón "Agregar al carrito rápido" en hover de ProductCard (requiere modal/drawer de selección de talle/color).
- Imágenes de producto reales (los mocks tienen 1 sola foto cada uno; la galería ya está lista para más).
- Quick-view en hover de ProductCard.
- Filtros aplicados como chips removibles individuales bajo la barra (no solo "limpiar todo").
- SEO: meta description dinámica por producto, OpenGraph tags.
