# Foodies is a site about recipes from various cuisines, with the ability to add your own recipes and follow other users in search of gastronomic happiness.

Modern responsive site for people who are keen on cooking.

**Live Demo:**
[https://project-node-react.github.io/recipe-service-app/](https://project-node-react.github.io/recipe-service-app/)

**Backend Repository:**
[https://github.com/project-node-react/recipe-service-server](https://github.com/project-node-react/recipe-service-server)

**Backend API:**
[https://recipe-service-server.onrender.com/](https://recipe-service-server.onrender.com/)

## Installation

```bash
# Clone repository
git clone https://github.com/project-node-react/recipe-service-app.git
cd recipe-service-app

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
.
├── .github/workflows/ # Contains GitHub Actions workflows for CI/CD automation.
├── .public/           # Contains static assets, like icons, fonts that are not processed by the build tool.
├── src/               # Contains all source files for the project.
│   ├── assets/        # Contains all static assets used in the project.
|   |   ├── hero/      # Contains hero images.
|   |   └── styles/    # Contains fonts imporing file.
│   ├── components/    # Reusable UI components (e.g., Hero, CategoryList, Modals).
│   ├── layouts/       # Layout wrapper components providing persistent structure like Header and Footer.
│   ├── pages/         # Page components corresponding to individual application routes.
│   ├── redux/         # Redux state management (slices, operations, and selectors).
│   ├── index.css      # Global styles, CSS reset rules, and design system variables.
│   └── main.jsx       # Application entry point rendering the root component wrapped in providers.
├── .gitignore         # Specifies files and directories to ignore in version control.
├── eslint.config.js   # Configuration file for ESLint code quality and style checks.
├── index.html         # The main entry point of the application.
├── LICENSE            # License file for the project.
├── package-lock.json  # The technical document that serves to record and ensure the determinism of project dependencies
├── package.json       # Lists project dependencies and scripts.
├── README.md          # Project overview and documentation.
└── vite.config.js     # Configuration file for Vite build tool.
```

## Created with ❤️ by **Bake-End Devs**:

| Role             | Name                  | GitHub                                                 | Responsibilities                                            |
| ---------------- | --------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| **Team Lead**    | Vitalii Vasylets      | [@Mohara88s](https://github.com/Mohara88s)             | project architecture, code review, deployment, Modal SignUp |
| **Scrum Master** | Nataliia Dubikova     | [@Natalka-01](https://github.com/Natalka-01)           | sprint planning, AddRecipePage                              |
| **Developer**    | Andrii Tsylyuryk      | [@AndriiTsylyuryk](https://github.com/AndriiTsylyuryk) | Header                                                      |
| **Developer**    | Kostiantyn Talamaniuk | [@antifloodbot](https://github.com/antifloodbot)       | RecipePage                                                  |
| **Developer**    | Anna Kotenko          | [@AnnaKotenkoInIT](https://github.com/AnnaKotenkoInIT) | Modal LogOut, Testimonials                                  |
| **Developer**    | Yevhen Vanchenko      | [@Vanchenko](https://github.com/Vanchenko)             | Hero, UserPage                                              |
| **Developer**    | Olha Kyryllova        | [@kirolla](https://github.com/kirolla)                 | Categories, Recipie Filters                                 |
| **Developer**    | Dmytro Beketov        | [@dmytro4308](https://github.com/dmytro4308)           | Footer, Modal SignIn                                        |
| **Developer**    | Vadym Andriushchenko  | [@Vademandr](https://github.com/Vademandr)             | Recipe List. RecipieCard                                    |

## Features

### 🎨 UI & Layout

- Fully responsive design supporting Mobile (375px), Tablet (768px), and Desktop
  (1440px) breakpoints
- Semantic HTML5 markup for optimal accessibility (a11y) and SEO foundation
- Modular CSS architecture (CSS Modules) with custom variables and design tokens
- Smooth scrolling, fluid UI transitions, and micro-interactions
- Responsive mobile navigation with backdrop blur and touch-friendly controls

### 🔐 Authentication & User Profile

- User registration, login, and secure session persistence via JWT
- Public and Private route guards for protected application pages
- Interactive user profile with tabs for personal recipes, favorites, followers,
  and following lists
- User search, follow/unfollow system to build a personal culinary feed

### 🍳 Recipe Management & Discovery

- Dynamic homepage hero section with recipe discovery triggers
- Comprehensive category filters and multi-parameter recipe search
- Full recipe details view: step-by-step cooking instructions, ingredient lists,
  preparation time, and calories
- Interactive recipe creation form with multi-step inputs and dynamic ingredient
  adding
- Favorite recipes bookmarking with real-time UI updates
- User reviews and testimonials showcase

### ⚙️ Architecture & State Management

- Global state management powered by Redux Toolkit and Redux Persist
- Asynchronous API communication using Axios interceptors
- Code splitting and route-based lazy loading with React `Suspense` and custom
  loaders
- Dynamic notification system (`react-hot-toast`) for real-time user feedback

## Technologies

- HTML5
- CSS3 (Flexbox, CSS Variables)
- modern-normalize
- Responsive layout
- Adaptive layout
- JavaScript
- TypeScript
- React
- Redux Toolkit
- React Router
- CSS Modules
- Axios
- API
- VSCode
- Vite (build tool)
- Figma
- Git/GitHub
- Prettier
- Swagger
- PostgreSQL
- Prisma ORM
- JWT + bcrypt
- Zod validation
- Swagger / OpenAPI
- Docker Compose
- Cloudinary
- Redux Toolkit
- Formik
- Yup
- React Router DOM
- React Hot Toast
- clsx
- react-spinners

## Technical Requirements

- [x] Semantic HTML markup
- [x] Three responsive breakpoints
- [x] Modern-normalize included
- [x] Custom fonts connected
- [x] Optimized images (including retina)
- [x] Favicon configured
- [x] GitHub Pages deployment

## License

MIT License - see [LICENSE](LICENSE) file for details.
