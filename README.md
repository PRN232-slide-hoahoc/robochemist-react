# RoboChemist React Application

Dự án React + TypeScript + Tailwind CSS cho RoboChemist

## 📋 Yêu cầu hệ thống

- Node.js >= 18.x
- npm hoặc yarn

## 🚀 Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
# Tạo file .env và thêm các biến môi trường
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=RoboChemist
VITE_APP_VERSION=1.0.0
```

3. Chạy development server:
```bash
npm run dev
```

4. Build production:
```bash
npm run build
```

## 📁 Cấu trúc dự án

```
src/
├── assets/                 # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Modal/
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Container.tsx
│   │   └── Layout.tsx
│   └── features/         # Feature-specific components
├── pages/                # Page components
│   ├── HomePage/
│   ├── DashboardPage/
│   └── NotFoundPage/
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   ├── useToggle.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
├── services/             # API services
│   ├── api/
│   │   ├── axios.config.ts
│   │   └── endpoints.ts
│   ├── auth/
│   │   └── authService.ts
│   └── user/
│       └── userService.ts
├── store/                # State management (Zustand)
│   ├── authStore.ts
│   └── index.ts
├── types/                # TypeScript definitions
│   ├── api.types.ts
│   ├── models.types.ts
│   └── common.types.ts
├── utils/                # Utility functions
│   ├── helpers/
│   │   ├── cn.ts
│   │   ├── formatDate.ts
│   │   └── validation.ts
│   └── constants/
│       ├── routes.ts
│       ├── api.ts
│       └── config.ts
├── contexts/             # React Context
│   └── ThemeContext.tsx
├── styles/               # Global styles
│   └── globals.css
├── App.tsx
└── main.tsx
```

## 🎨 Tính năng

- ✅ React 18 với TypeScript
- ✅ Tailwind CSS cho styling
- ✅ Zustand cho state management
- ✅ React Router cho routing
- ✅ Axios cho API calls
- ✅ React Hook Form + Zod cho form validation
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Code splitting với lazy loading
- ✅ ESLint + Prettier cho code quality

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Check linting errors
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code với Prettier
- `npm run type-check` - Check TypeScript errors

## 🔧 Path Aliases

Dự án sử dụng path aliases để import dễ dàng:

```typescript
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { API_ENDPOINTS } from '@/utils/constants/api';
```

## 🎯 Coding Standards

Dự án tuân theo các coding standards:

- **Components**: PascalCase (VD: `Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase với prefix "use" (VD: `useAuth.ts`)
- **Utils**: camelCase (VD: `formatDate.ts`)
- **Types**: PascalCase với suffix "Types.ts" (VD: `UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (VD: `API_ENDPOINTS.ts`)

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [React Router Documentation](https://reactrouter.com)

## 👥 Team

RoboChemist Development Team

## 📄 License

Copyright © 2025 RoboChemist

