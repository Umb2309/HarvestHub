# 🌿 HarvestHub

**HarvestHub** is a modern React-based marketplace that connects local farmers directly with consumers. Browse fresh produce, view farmer profiles, manage your cart, and place orders — all through a clean, responsive interface.

> Portfolio project demonstrating production-quality React frontend development.

---

## 🚀 Live Demo

> Coming soon — deploy link will be added here.

---

## ✨ Features

- 🛒 **Product Browsing** — Search, filter by category, and sort produce from local farms
- 👩‍🌾 **Farmer Profiles** — Browse verified local farmers and view their full product range
- 🛍️ **Shopping Cart** — Add items, adjust quantities, with localStorage persistence
- 🔐 **Authentication** — Separate Login & Register pages with React Router
- 📱 **Fully Responsive** — Mobile-first design with a sticky glassmorphism Navbar
- ✨ **Skeleton Loaders** — Shimmer placeholders while content loads
- 🌿 **Earth-tone Design System** — Custom CSS variables, smooth animations, accessible UI

---

## 🧱 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Context API | Global state (cart, auth) |
| localStorage | Cart & session persistence |
| Vanilla CSS | Styling & design system |
| Unsplash | High-quality mock images |

---

## 📁 Project Structure

```
src/
├── App.jsx                   # Router configuration
├── contexts/
│   ├── CartContext.jsx        # Cart state (useReducer + localStorage)
│   └── AuthContext.jsx        # Auth state (mock login/register)
├── data/
│   ├── products.js            # Mock product data
│   └── farmers.js             # Mock farmer data
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx/css     # Sticky glassmorphism nav
│   │   ├── Footer.jsx/css     # 4-column footer
│   │   └── Layout.jsx/css     # Page shell
│   ├── product/
│   │   └── ProductCard.jsx/css
│   ├── farmer/
│   │   └── FarmerCard.jsx/css
│   └── ui/
│       ├── StarRating.jsx/css
│       └── SkeletonCard.jsx/css
├── pages/
│   ├── Home.jsx/css           # Hero, featured products, farmer spotlight
│   ├── Products.jsx/css       # Search, filter, sort, skeleton loading
│   ├── ProductDetails.jsx/css # Product detail with quantity selector
│   ├── Farmers.jsx            # Farmers listing
│   ├── FarmerProfile.jsx      # Individual farmer page
│   ├── Cart.jsx               # Shopping cart
│   ├── Checkout.jsx           # Checkout flow
│   ├── Login.jsx              # Sign in page
│   ├── Register.jsx           # Register page
│   ├── About.jsx              # About page
│   ├── Contact.jsx            # Contact page
│   └── NotFound.jsx           # 404 page
└── styles/
    └── index.css              # Global design system (CSS custom properties)
```

---

## 🛠️ Getting Started

```bash
# Clone the repository
git clone git@github.com:Umb2309/HarvestHub.git
cd HarvestHub

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Account

| Field | Value |
|---|---|
| Email | `demo@harvesthub.com` |
| Password | `demo1234` |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

---

## 🗺️ Roadmap

- [ ] Farmers Page & Profiles
- [ ] Shopping Cart Page
- [ ] Checkout Flow
- [ ] Login & Register Pages
- [ ] About & Contact Pages
- [ ] Backend API integration

---

## 📄 License

MIT — free to use for learning and portfolio purposes.

---

*Built with 💚 using React + Vite*
