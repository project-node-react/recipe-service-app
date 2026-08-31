# Foodies is a site about recipes from various cuisines, with the ability to add your own recipes and follow other users in search of gastronomic happiness.

Modern responsive site for people who are keen on cooking.

**Live Demo:**
[https://project-node-react.github.io/recipe-service-app/](https://project-node-react.github.io/recipe-service-app/)

**Backend API:**
[https://recipe-service-server.onrender.com/](https://recipe-service-server.onrender.com/)

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

- Fully responsive design (Mobile: 375px, Tablet: 768px, Desktop: 1440px)
- Semantic HTML5 markup
- Modular CSS architecture
- Optimized images with retina support
- Smooth scroll behavior
- CSS animations and transitions
- Mobile navigation menu

## Technologies

- HTML5
- CSS3 (Flexbox, CSS Variables)
- modern-normalize
- Responsive layout
- Adaptive layout
- JavaScript
- Axios
- API
- VSCode
- Vite (build tool)
- Figma
- Git/GitHub
- Prettier
- Swagger

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
