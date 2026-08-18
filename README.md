# Wolter Web Application (Full Stack)

## About the Project

This project expands the food delivery application ecosystem by introducing a fully dynamic, interactive application, frontend built with **React**, communicating seamlessly with our advanced Node.js/Express RESTful API server.

The application architecture mimics the real-world **Wolt** experience. It features user authentication, contextual UI based on roles, distance calculation from the active user, dynamic product menus, custom error/success interactive modals, and an application-wide theme toggler (Light/Dark mode).

---

## Key Technical Features

### 1. Frontend Architecture (React)

- **Component-Driven UI**: Split into functional, reusable components adhering to clean code structures.
- **Dynamic Context API & Hooks**: State management handled via a global `AuthorizationContext` providing a custom, interceptor-like `authenticatedFetch` wrapper.
- **Client-Side Form Validation**: Complete validation with a user-friendly custom Popup Modal experience, preventing faulty data payloads before hitting network requests.
- **Theming**: Fully functional **Dark Mode / Light Mode** context switcher applied globally via dynamic CSS variables.

### 2. Backend API Architecture (Node.js & Express)

- **MVC Pattern with Service Layer**: The application is structured to separate concerns into Models, Controllers, Routes, and an explicit Services layer. The Service layer encapsulates the core business logic, such as formatting restaurant objects dynamically to include active menu data.
- **Database & Data Modeling (MongoDB)**: Utilized MongoDB with Mongoose for dynamic document schema design and structured querying, ensuring efficient persistence and retrieval of restaurant data, menus, and user records.
- **TCP Socket**: This server acts as a client to the backend server we developed in c++. When specific actions occur (viewing or deleting a single product), our Web server establishes a TCP socket connection to the TCP server to log activity or handle deletion cascading.

---

## Build and Run Lifecycle

### The One-Command Container Setup

Both the React Frontend server application environment and the Express API Backend layer have been completely bundled into a single pipeline orchestration scheme using Docker Compose.

To compile and run the entire codebase, execute the following command:

```bash
docker compose up --build
```

To use the WEB application, after build is complete enter to your browser, and enter in URL:

 ```bash
http://localhost:4000
```
---

## Application Flow & Interface Screenshots

### 1. Authentication & Onboarding Flow
- **Welcome Page**: The entry point welcoming users to Wolter.
- **Registration**: Multi-step client validated onboarding form supporting coordinates collection and dynamic role assignment (`regular` / `restaurantOwner`).
- **Login**: Profile identity verification gateway.

<p align="center">
  <img src="./screenshots/1.png" alt="Welcome Screen" width="48%" />
  <img src="./screenshots/2.png" alt="Login Screen" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/3.png" alt="Registration Form Top" width="48%" />
  <img src="./screenshots/4.png" alt="Registration Form Bottom" width="48%" />
</p>

### 2. Customer Dashboard & Ordering (Regular User)
- **Main Catalog**: View all active restaurant options automatically ordered by geographical proximity (computed coordinates distance) along with rapid filtering tags.
- **Menu view**: Inspect specific product grids inside restaurants with interactive item counters.
- **Checkout Cart**: Summarize selected items, adjust operational item lines, clear carts, or post active payloads directly to transactional endpoints.
- **Order Tracking**: Track active order lifecycles with modular update/delete options.

<p align="center">
  <img src="./screenshots/5.png" alt="Main Restaurant Feed" width="48%" />
  <img src="./screenshots/6.png" alt="Product Catalog View" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/7.png" alt="Order Summary Checkout" width="48%" />
  <img src="./screenshots/8.png" alt="Active Orders Board" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/9.png" alt="Update Quantities Modal" width="48%" />
  <img src="./screenshots/10.png" alt="Empty Order History State" width="48%" />
</p>

### 3. Business Panel & Restaurant Management (Owner User)
- **Owner Profile**: Dedicated interface displaying specific registration parameters, business catalogs, and structural routes.
- **Creation Workspace**: Initialize multi-field restaurant forms mapping descriptions, category labels, and geographic coordinates.
- **Product Management**: Populate menu records using customized popup windows to control pricing metrics and structural item specifications.

<p align="center">
  <img src="./screenshots/11.png" alt="Owner Profile View" width="48%" />
  <img src="./screenshots/12.png" alt="Management Portal Empty State" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/13.png" alt="Create Restaurant Form" width="48%" />
  <img src="./screenshots/14.png" alt="Owned Restaurants Dashboard" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/15.png" alt="Menu Workspace Console" width="48%" />
  <img src="./screenshots/16.png" alt="Add Product Modal Form" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/17.png" alt="Live Menu Item Catalog View" width="50%" />
</p>

### 4. After Restaurant Creation
- After restaurant creation you will be able to see it both in his category section and in All restaurant section 

<p align="center">
    <img src="./screenshots/18.png" alt="Category Search View - Dark Theme" width="48%" />
</p>

### 5. Global Theming & User Contexts
- **Theme Alternation**: Full application layout shift across Light and Dark spectrum parameters.
- **Role Scoping**: Layout adaptations customized cleanly to fit the active session token metadata (`regular` profile layout vs. `restaurantOwner` controls).

<p align="center">
  
  <img src="./screenshots/19.png" alt="Category Search View - Light Theme" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/20.png" alt="Regular Profile View - Light Theme" width="50%" />
</p>

---

## API Reference & Endpoints

> ⚠️ **Data Encoding Notice**:
> - Standard endpoints accept and consume standard **JSON** payloads.
> - `POST /api/users` accepts images under the `profileImage` boundary field.
> - **Security Assertion**: Requests communicating with protected resources must supply valid authorization credentials using the standard `Authorization: Bearer <token>` layout.

### Users
- `POST /api/users` - Register a brand new profile. Accepts image (`profileImage`).
- `GET /api/users/:id` - Fetch user parameters and coordinates. *(Requires Auth)*
- `POST /api/tokens` - Identity challenge. Exchanges standard `username` and `password` parameters for an active user identification payload (JWT).

### Restaurants *(All Require Auth)*
- `GET /api/restaurants` - Pull list of all restaurants.
- `POST /api/restaurants` - Append a new restaurant node.
- `GET /api/restaurants/nearbyRestaurants` - Fetch prioritized list ordered geographically (closest first).
- `GET /api/restaurants/category/:categoryName` - Filter restaurants matching a specific category.
- `GET /api/restaurants/userOwner/:userId` - Filter restaurants owned by a designated owner token.
- `GET /api/restaurants/:id` - Pull specific restaurant along with its computed sub-menu product arrays.
- `PATCH /api/restaurants/:id` - Update restaurant.
- `DELETE /api/restaurants/:id` - Delete restaurant.

### Products *(All Require Auth)*
- `GET /api/restaurants/:id/products` - Retrieve current catalog associated with a target restaurant ID.
- `POST /api/restaurants/:id/products` - Instantiate a menu item product mapping.
- `GET /api/restaurants/:id/products/:pid` - Access precise metadata regarding an isolated menu item ID.
- `PATCH /api/restaurants/:id/products/:pid` - Mutate product pricing or ingredient lists.
- `DELETE /api/restaurants/:id/products/:pid` - Evict a product from the database catalog.

### Orders *(All Require Auth)*
- `POST /api/orders` - Record a multi-product transactional item array under an account ID.
- `GET /api/orders` - Pull personal order history queues related to the active session.
- `GET /api/orders/:id` - Fetch comprehensive metrics regarding an isolated invoice or delivery sequence.
- `PATCH /api/orders/:id` - Alter specific state markers.
- `DELETE /api/orders/:id` - Drop/Cancel an existing order trail.

### Search *(All Require Auth)*
- `GET /api/search/:query` - Query string parser running matches across multi-table fields (Restaurants' and products' names or descriptions).