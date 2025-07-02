# 🛍️ Proyecto Web: E-commerce

Este proyecto corresponde al **Laboratorio de Aplicaciones Web Cliente**. Se trata de una aplicación web de tipo E-commerce desarrollada con tecnologías del lado del cliente, haciendo uso de HTML5, CSS3, JavaScript, Bootstrap y una API externa. La app es completamente responsive y centrada en ofrecer una experiencia de usuario coherente y accesible.

---

## Requisitos cumplidos

### Responsive Design
- Diseño adaptable a distintos tamaños de pantalla.
- Herramienta recomendada: [Responsively App](https://responsively.app/)

### UX/UI
- Paleta de colores y tipografía coherentes en toda la app.
- Uso de botones y elementos visuales consistentes.
- Recursos utilizados:
  - [Google Fonts](https://fonts.google.com/)
  - [Balsamiq: Button Design](https://balsamiq.com/learn/articles/button-design-best-practices/)
  - [Make It Clear: UX Tips](https://makeitclear.com/ux-ui-tips-a-guide-to-creating-buttons/)
  - [SweetAlert2](https://sweetalert2.github.io/)
  - [Dribbble (Inspiración visual)](https://dribbble.com/search/e-commerce)
  - [SwiperJS (Carruseles)](https://swiperjs.com/demos)

### Accesibilidad
- Estructura semántica con etiquetas HTML5 como `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- Buenas prácticas de accesibilidad web.
- Recursos utilizados:
  - [7 Claves para accesibilidad](https://accesibilidadenlaweb.com.ar/7claves/)
  - [W3Schools HTML Tags](https://www.w3schools.com/tags/tag_html.asp)

---

## Tecnologías utilizadas

- HTML5
- CSS3 (con [Bootstrap 5](https://getbootstrap.com/))
- JavaScript (DOM, Fetch, Local Storage)
- API externa: [Fake Store API](https://fakestoreapi.com/)

---

## Funcionalidades implementadas

### Listado de productos
- Se consumen productos desde FakeStoreAPI y se muestran en tarjetas (cards).

### Modal de detalle
- Cada producto tiene un botón para mostrar un modal con más información: título, precio, descripción.
- Modal cerrable con:
  - Botón `X`
  - Botón “Agregar al carrito”

### Carrito de compras
- Al agregar al carrito:
  - Se guarda en `localStorage`.
  - Se muestra mensaje de confirmación (SweetAlert2).

- Ícono de carrito en la barra de navegación:
  - Al hacer clic, muestra un **sidebar** con los productos agregados.

- Dentro del carrito:
  - Imagen del producto
  - Título
  - Botón ➖ (disminuir cantidad, deshabilitado si cantidad = 1)
  - Cantidad seleccionada
  - Botón ➕ (aumentar cantidad)
  - Botón 🗑️ (eliminar producto del carrito)
  - Precio final (precio * cantidad)

> Todas las acciones actualizan el `localStorage` en tiempo real.

### Finalizar compra
- Botón que:
  - Limpia el carrito
  - Borra el `localStorage`
  - Muestra mensaje de compra finalizada

### Vaciar carrito
- Elimina todos los productos del carrito
- Limpia el `localStorage`

### Buscador de productos
- Campo de búsqueda para filtrar productos por nombre
- Seleccón de filtros para las distintas categorias
---

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/proyecto-ecommerce.git
