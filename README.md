# Legal Metrology Scanner

🌐 **Live Demo**: [https://compliance-seva.netlify.app](https://compliance-seva.netlify.app)
📱 **GitHub Repository**: [https://github.com/DevAbhay07/compliance-seva](https://github.com/DevAbhay07/compliance-seva)

## Project Overview
Legal Metrology Scanner is a modern, responsive web application designed to streamline compliance checks for product labels under legal metrology standards. Built with React 18 and TypeScript, featuring comprehensive mobile compatibility and real-time camera functionality.

### Target Users
- Government officers responsible for legal metrology compliance
- Compliance managers in businesses
- General users interested in verifying product label compliance

### Core Features
- **📱 Mobile-First Design**: Fully responsive across all devices
- **📷 Camera Integration**: Native camera access for label scanning
- **📊 Dashboard**: Analytics and charts for monitoring compliance trends
- **📋 Records Management**: History of scanned labels with dual layout (table/cards)
- **⚙️ Settings**: User profile and application preferences
- **🎨 Professional UI**: Government UX4G compliant design

---

## Tech Stack
### Frontend
- **React 18.2.0**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS 3.4.19**: Utility-first responsive design framework
- **Redux Toolkit 2.5.1**: Predictable state management
- **React Router Dom 7.8.2**: Client-side routing with data loading
- **Vite 5.4.20**: Lightning-fast build tool with HMR

### Development & Deployment
- **Vite Dev Server**: Hot module replacement for development
- **Netlify**: Continuous deployment and hosting
- **TypeScript**: Static type checking and IntelliSense

---

## Project Structure
```
compliance-seva/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components (Button, Modal, etc.)
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   └── CameraModal.tsx  # Camera interface component
│   ├── pages/               # Page-level components
│   │   ├── Home.tsx         # Landing page with hero section
│   │   ├── Dashboard.tsx    # Analytics and compliance metrics
│   │   ├── Scanner.tsx      # Camera scanning interface
│   │   ├── Records.tsx      # Compliance records management
│   │   └── Settings.tsx     # User preferences
│   ├── hooks/               # Custom React hooks
│   │   └── useCamera.ts     # Camera API management
│   ├── store/               # Redux store configuration
│   │   └── index.ts         # Store setup with sidebar state
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Common utilities
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── dist/                    # Production build output
├── .gitignore               # Git ignore patterns
├── netlify.toml             # Netlify deployment configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with camera support (Chrome/Firefox/Safari)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd compliance-seva

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development
```bash
# Start dev server (runs on port 3004)
npm run dev

# Type checking
npm run type-check

# Build and preview production
npm run build && npm run preview
```

---

## Camera Functionality
The application includes sophisticated camera integration:
- **Cross-platform compatibility**: Works on mobile and desktop
- **Progressive fallback**: Multiple constraint strategies for maximum compatibility
- **Loading states**: Professional UI with loading indicators
- **Error handling**: Graceful degradation when camera unavailable

### Camera API Implementation
- Uses `MediaDevices.getUserMedia()` with environment preference
- Implements timeout handling and stream cleanup
- Supports both environment and user-facing cameras
- Mobile-optimized with proper viewport handling

---

## Mobile Responsiveness
Comprehensive mobile-first design with:
- **Responsive Navigation**: Collapsible sidebar with smooth animations
- **Touch Optimization**: 44px minimum touch targets (UX4G compliant)
- **Adaptive Layouts**: Table-to-card transformations on mobile
- **Camera Integration**: Mobile-native camera access
- **Performance**: Optimized for mobile networks and devices

---

## Deployment on Netlify

### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 18 or higher

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify (using Netlify CLI)
npx netlify deploy --prod --dir=dist
```

### Environment Variables
Configure these in Netlify dashboard if needed:
- `NODE_ENV=production`
- Any API endpoints or configuration

---

## Browser Compatibility
- **Chrome/Chromium**: Full camera support
- **Firefox**: Full functionality with camera
- **Safari**: iOS/macOS camera integration
- **Edge**: Complete Windows compatibility
- **Mobile Browsers**: Optimized experience across all devices

---

## Features in Detail

### 🏠 Home Page
- Hero section with call-to-action
- Professional government-grade design
- Mobile-responsive layout
- Camera access button

### 📊 Dashboard
- Compliance analytics with interactive charts
- Real-time statistics
- Mobile-optimized card layouts
- Responsive data visualization

### 📷 Scanner
- Native camera integration
- Progressive loading states
- Cross-platform compatibility
- Professional camera interface

### 📋 Records
- Dual-layout system (desktop table, mobile cards)
- Sortable and filterable data
- Touch-friendly mobile interactions
- Detailed compliance history

### ⚙️ Settings
- User profile management
- Application preferences
- Mobile-optimized forms
- Horizontal scroll navigation on mobile

---


## Contributing
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## Future Enhancements
- **🌙 Dark Mode**: Toggle for light/dark themes
- **🌍 Multi-Language Support**: Localization for global users
- **🔐 Authentication**: User login and role-based access
- **📊 Advanced Analytics**: Enhanced reporting capabilities
- **🤖 AI Integration**: Machine learning for label recognition
- **📱 PWA Support**: Progressive Web App capabilities

---

## Support
For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for government compliance and public service**