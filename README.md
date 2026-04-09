# Commsuite - Enterprise Communication Suite

Commsuite is a professional, high-performance communication platform built with Angular. It provides an enterprise-grade interface for managing internal messages, announcements, and corporate collaborations with a sleek, modern aesthetic.

![Commsuite UI](https://raw.githubusercontent.com/cata009/commsuite-c/master/docs/screenshots/dashboard_preview.png)

## 🚀 Key Features

### 📨 Advanced Messaging System
- **Real-time Conversation Management**: Efficient threading and message organization.
- **Intelligent Filtering**: Filter by Unread status, TODO items, Attachments, or specific Companies.
- **Folder Management**: Organize communications into Inbox, Drafts, and Deleted Items.
- **Rich Text Composer**: Powerful editor for creating detailed professional responses.
- **Draft Persistence**: Auto-save and manual draft management to ensure no work is lost.

### 📢 Targeted Announcements
- **Corporate Broadcasting**: Categorized announcements with status badges (Important, Informative, Recalled).
- **Interactive Details**: Full-featured announcement views with expiration tracking and attachment support.

### 🔍 Powerful Search & Discovery
- **Global Search**: High-performance search across messages and announcements with text highlighting.
- **Company Tracking**: Organization-centric view for managing cross-company participants.

### 🎨 Premium UI/UX
- **UniCredit Design System**: Consistent, professional branding using customized UI tokens.
- **Dynamic Layouts**: Collapsible sidebars and responsive panels for maximum workspace efficiency.
- **Rich Interaction**: Smooth transitions, hover effects, and micro-animations.

## 🛠️ Technology Stack

- **Core Framework**: [Angular 16](https://angular.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first, highly responsive design.
- **Icons**: [Lucide Angular](https://lucide.dev/) for a clean, consistent iconography.
- **Date Handling**: [date-fns](https://date-fns.org/) for precise temporal management.
- **Animation**: Angular Animations for professional UI feedback.

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (included with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/cata009/commsuite-c.git
   ```
2. Navigate to the project directory:
   ```bash
   cd commsuite-c
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the development server for a local preview:
```bash
npm start
```
The application will be available at `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Building
To build the project for production:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

## 📂 Project Structure

```text
src/
├── app/
│   ├── core/           # Services, models, and shared utilities
│   ├── features/       # Main modules (Messages, Announcements, etc.)
│   ├── layout/         # Shell components (Header, Nav, etc.)
│   └── shared/         # Reusable UI components (Buttons, Modals, Icons)
├── assets/             # Images, fonts, and static resources
└── styles.scss         # Global styles and tailwind configuration
```

## 🤝 Contributing

This project is maintained for enterprise communication standards. If you are a developer looking to contribute:
1. Ensure you follow the established UniCredit design tokens defined in `tailwind.config.js`.
2. Maintain high accessibility standards in all UI components.
3. Keep logic decoupled from presentation in accordance with the existing service architecture.

---
*Created and maintained as a high-fidelity communication solution.*
