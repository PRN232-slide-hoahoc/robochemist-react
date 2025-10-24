# 📁 Cấu trúc dự án RoboChemist React

Tài liệu này giải thích chi tiết về cấu trúc thư mục và vai trò của từng file trong dự án React + TypeScript + Tailwind CSS.

---

## 📋 Mục lục

1. [Tổng quan cấu trúc](#tổng-quan-cấu-trúc)
2. [Thư mục gốc](#thư-mục-gốc)
3. [Thư mục src](#thư-mục-src)
4. [Chi tiết từng thư mục](#chi-tiết-từng-thư-mục)
5. [Quy tắc đặt tên](#quy-tắc-đặt-tên)
6. [Path Aliases](#path-aliases)

---

## 🌳 Tổng quan cấu trúc

```
robochemist-react/
├── .vscode/                    # Cấu hình VS Code
├── public/                     # Static files (sẽ được copy vào build)
├── src/                        # Source code chính
│   ├── assets/                # Tài nguyên tĩnh (images, icons, fonts)
│   ├── components/            # React components
│   ├── contexts/              # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Cấu hình thư viện bên thứ 3
│   ├── pages/                 # Page components (routes)
│   ├── services/              # API services & business logic
│   ├── store/                 # State management (Zustand)
│   ├── styles/                # Global styles & Tailwind config
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions & constants
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # Vite environment types
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── index.html                # HTML template
├── package.json              # Dependencies & scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript config for Node
├── vite.config.ts            # Vite bundler configuration
└── README.md                 # Hướng dẫn sử dụng dự án
```

---

## 📂 Thư mục gốc

### File cấu hình chính

#### `package.json`
```json
{
  "name": "robochemist-react",
  "scripts": {
    "dev": "vite",              // Chạy development server
    "build": "tsc && vite build", // Build production
    "lint": "eslint .",         // Kiểm tra lỗi code
    "format": "prettier --write" // Format code
  }
}
```
- **Mục đích**: Quản lý dependencies, scripts và metadata của dự án
- **Dependencies chính**:
  - `react`, `react-dom`: Core React
  - `typescript`: Hỗ trợ TypeScript
  - `tailwindcss`: CSS framework
  - `zustand`: State management
  - `axios`: HTTP client
  - `react-router-dom`: Routing
  - `react-hook-form`, `zod`: Form validation

#### `tsconfig.json`
```typescript
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]  // Path alias
    }
  }
}
```
- **Mục đích**: Cấu hình TypeScript compiler
- **Tính năng**:
  - Strict mode bật để type checking chặt chẽ
  - Path aliases cho import ngắn gọn
  - JSX support cho React

#### `vite.config.ts`
- **Mục đích**: Cấu hình Vite bundler
- **Tính năng**:
  - React plugin
  - Path aliases resolution
  - Dev server port (3000)
  - Build output configuration

#### `tailwind.config.ts`
- **Mục đích**: Cấu hình Tailwind CSS
- **Tính năng**:
  - Custom colors (primary, secondary)
  - Dark mode support
  - Custom animations
  - Extended spacing & border radius

#### `.eslintrc.json`
- **Mục đích**: Cấu hình ESLint để kiểm tra code quality
- **Rules**: TypeScript, React, React Hooks rules

#### `.prettierrc`
- **Mục đích**: Cấu hình Prettier để format code tự động
- **Settings**: Single quotes, 2 spaces, trailing commas

#### `.gitignore`
- **Mục đích**: Định nghĩa files/folders không commit vào Git
- **Bao gồm**: node_modules, dist, .env, IDE settings

---

## 📁 Thư mục src/

### `src/main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
- **Vai trò**: Entry point của ứng dụng
- **Chức năng**: 
  - Mount React app vào DOM
  - Import global styles
  - Bật StrictMode để phát hiện lỗi

### `src/App.tsx`
```typescript
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```
- **Vai trò**: Root component của ứng dụng
- **Chức năng**:
  - Setup routing
  - Wrap providers (Theme, Auth, etc.)
  - Lazy loading pages

---

## 🎯 Chi tiết từng thư mục

### 📦 `src/assets/`

Chứa tài nguyên tĩnh của ứng dụng.

```
assets/
├── images/          # Hình ảnh (logo, banners, photos)
├── icons/           # Icon files (SVG, PNG)
└── fonts/           # Custom fonts
```

**Cách sử dụng**:
```typescript
import logo from '@/assets/images/logo.png';
import Icon from '@/assets/icons/check.svg';
```

**Lưu ý**: 
- Sử dụng SVG cho icons để scale tốt
- Optimize images trước khi thêm vào dự án
- Đặt tên file rõ ràng, có ý nghĩa

---

### 🧩 `src/components/`

Chứa tất cả React components, được chia thành các nhóm:

#### **`components/ui/`** - Base UI Components

Các component UI cơ bản, tái sử dụng được:

```
ui/
├── Button/
│   ├── Button.tsx         # Component implementation
│   ├── Button.types.ts    # TypeScript types/interfaces
│   └── index.ts           # Export barrel file
├── Input/
│   ├── Input.tsx
│   ├── Input.types.ts
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   └── index.ts
└── Modal/
    ├── Modal.tsx
    ├── Modal.types.ts
    └── index.ts
```

**Ví dụ Button component**:
```typescript
// Button.types.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

// Button.tsx
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <button className={cn(baseStyles, variants[variant])}>
      {children}
    </button>
  );
};

// index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

**Quy tắc**:
- Mỗi component một folder riêng
- Có file `.types.ts` riêng cho types
- Export qua `index.ts` để import sạch
- Sử dụng `cn()` utility để merge Tailwind classes

#### **`components/forms/`** - Form Components

Components liên quan đến forms:

```
forms/
├── LoginForm/
│   ├── LoginForm.tsx
│   └── index.ts
├── RegisterForm/
├── SearchBar/
└── FilterForm/
```

**Đặc điểm**:
- Sử dụng `react-hook-form` cho form handling
- Validation với `zod` schema
- Error handling và display

**Ví dụ**:
```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        label="Email" 
        error={errors.email?.message}
        {...register('email')} 
      />
      <Button type="submit">Login</Button>
    </form>
  );
};
```

#### **`components/layout/`** - Layout Components

Components định nghĩa bố cục trang:

```
layout/
├── Header.tsx        # Navigation bar, logo, user menu
├── Footer.tsx        # Footer information
├── Sidebar.tsx       # Side navigation
├── Container.tsx     # Content container với max-width
└── Layout.tsx        # Main layout wrapper
```

**Layout.tsx**:
```typescript
export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
```

**Sử dụng**:
```typescript
// In pages
<Layout>
  <Container>
    <YourPageContent />
  </Container>
</Layout>
```

#### **`components/features/`** - Feature-specific Components

Components phục vụ cho từng tính năng cụ thể:

```
features/
├── UserProfile/
│   ├── UserAvatar.tsx
│   ├── UserInfo.tsx
│   └── UserSettings.tsx
├── Dashboard/
│   ├── StatCard.tsx
│   ├── ActivityFeed.tsx
│   └── ChartWidget.tsx
└── Chemistry/
    ├── PeriodicTable.tsx
    ├── MoleculeViewer.tsx
    └── ExperimentCard.tsx
```

**Đặc điểm**:
- Chứa business logic cụ thể
- Có thể sử dụng các UI components
- Kết nối với services/APIs

---

### 📄 `src/pages/`

Chứa các page components (route components):

```
pages/
├── HomePage/
│   ├── HomePage.tsx
│   └── index.ts
├── DashboardPage/
│   ├── DashboardPage.tsx
│   ├── DashboardPage.types.ts
│   └── index.ts
├── NotFoundPage/
│   ├── NotFoundPage.tsx
│   └── index.ts
└── [FeaturePage]/
```

**Đặc điểm**:
- Mỗi page một folder riêng
- Tên file có suffix "Page" (VD: `HomePage.tsx`)
- Thường wrap trong Layout component
- Lazy loading trong App.tsx

**Ví dụ HomePage**:
```typescript
export const HomePage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <h1>Chào mừng đến RoboChemist</h1>
        {/* Page content */}
      </Container>
    </Layout>
  );
};
```

---

### 🪝 `src/hooks/`

Custom React hooks cho logic tái sử dụng:

```
hooks/
├── useAuth.ts          # Authentication logic
├── useToggle.ts        # Boolean state toggle
├── useLocalStorage.ts  # LocalStorage sync
├── useDebounce.ts      # Debounce values
└── useMediaQuery.ts    # Responsive breakpoints
```

**Quy tắc**:
- Tên bắt đầu với `use`
- Một hook một file
- Export named export

**Ví dụ useToggle**:
```typescript
export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  
  const toggle = useCallback(() => setState(prev => !prev), []);
  const setValue = useCallback((value: boolean) => setState(value), []);
  
  return [state, toggle, setValue] as const;
};

// Sử dụng
const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
```

**Hooks có sẵn**:

1. **`useAuth.ts`**
   - Quản lý authentication state
   - Login, logout, register functions
   - User information

2. **`useToggle.ts`**
   - Toggle boolean state
   - Open/close modals, menus

3. **`useLocalStorage.ts`**
   - Sync state với localStorage
   - Persist data across sessions

4. **`useDebounce.ts`**
   - Debounce input values
   - Tối ưu search, API calls

5. **`useMediaQuery.ts`**
   - Detect responsive breakpoints
   - Mobile, tablet, desktop detection

---

### 🌐 `src/services/`

API services và business logic:

```
services/
├── api/
│   ├── axios.config.ts      # Axios instance, interceptors
│   └── endpoints.ts         # API endpoint constants
├── auth/
│   └── authService.ts       # Authentication APIs
└── user/
    └── userService.ts       # User management APIs
```

#### **`services/api/axios.config.ts`**

Cấu hình Axios instance:

```typescript
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### **`services/auth/authService.ts`**

Authentication service:

```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', credentials);
    const authData = response.data.data;
    
    // Save token
    localStorage.setItem('auth_token', authData.token);
    
    return authData;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();
```

#### **`services/user/userService.ts`**

User management service:

```typescript
class UserService {
  async getUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    const response = await axiosInstance.get('/users', {
      params: { page, pageSize }
    });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data.data;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await axiosInstance.post('/users', data);
    return response.data.data;
  }
}

export const userService = new UserService();
```

---

### 🗄️ `src/store/`

State management với Zustand:

```
store/
├── slices/              # Individual stores
│   └── ...
├── authStore.ts         # Authentication state
└── index.ts            # Export all stores
```

**authStore.ts**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => 
        set({ user, token, isAuthenticated: true }),
      logout: () => 
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
```

**Sử dụng**:
```typescript
const { user, login, logout } = useAuthStore();
```

**Ưu điểm Zustand**:
- ✅ Simple API, ít boilerplate
- ✅ TypeScript support tốt
- ✅ Persist middleware cho localStorage
- ✅ Performance tốt hơn Context API

---

### 📝 `src/types/`

TypeScript type definitions:

```
types/
├── api.types.ts        # API response types
├── models.types.ts     # Data model types
└── common.types.ts     # Common utility types
```

#### **`api.types.ts`**
```typescript
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
```

#### **`models.types.ts`**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
}
```

#### **`common.types.ts`**
```typescript
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
```

---

### 🛠️ `src/utils/`

Utility functions và constants:

```
utils/
├── helpers/
│   ├── cn.ts              # Class name merger (Tailwind)
│   ├── formatDate.ts      # Date formatting
│   └── validation.ts      # Validation functions
└── constants/
    ├── routes.ts          # Route constants
    ├── api.ts             # API endpoints
    └── config.ts          # App configuration
```

#### **`helpers/cn.ts`**
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sử dụng
<div className={cn(
  'base-class',
  isActive && 'active-class',
  className // from props
)} />
```

#### **`helpers/formatDate.ts`**
```typescript
export function formatDate(date: Date | string, locale = 'vi-VN'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
}
```

#### **`helpers/validation.ts`**
```typescript
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
}

export function isStrongPassword(password: string): boolean {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}
```

#### **`constants/routes.ts`**
```typescript
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
} as const;
```

#### **`constants/api.ts`**
```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
} as const;
```

#### **`constants/config.ts`**
```typescript
export const APP_CONFIG = {
  NAME: 'RoboChemist',
  VERSION: '1.0.0',
  LOCALE: 'vi-VN',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;
```

---

### 🎨 `src/contexts/`

React Context providers:

```
contexts/
├── AuthContext.tsx     # Authentication context (alternative to Zustand)
└── ThemeContext.tsx    # Theme management (dark/light mode)
```

**ThemeContext.tsx**:
```typescript
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

**Sử dụng**:
```typescript
// In App.tsx
<ThemeProvider>
  <YourApp />
</ThemeProvider>

// In components
const { theme, toggleTheme } = useTheme();
<button onClick={toggleTheme}>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

---

### 💅 `src/styles/`

Global styles và Tailwind setup:

```
styles/
└── globals.css         # Global CSS + Tailwind layers
```

**globals.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
  h1 {
    @apply text-4xl font-bold;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-lg 
           bg-primary-600 px-4 py-2 text-sm font-medium text-white 
           hover:bg-primary-700 focus:ring-2;
  }
  
  .input-field {
    @apply w-full rounded-lg border border-gray-300 px-4 py-2 
           focus:border-primary-500 focus:ring-2;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 📐 Quy tắc đặt tên

### Files & Folders

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Pages | PascalCase + "Page" | `HomePage.tsx`, `DashboardPage.tsx` |
| Hooks | camelCase + "use" prefix | `useAuth.ts`, `useToggle.ts` |
| Utils | camelCase | `formatDate.ts`, `validation.ts` |
| Types | PascalCase + ".types.ts" | `User.types.ts`, `Api.types.ts` |
| Constants | camelCase | `routes.ts`, `config.ts` |
| Services | camelCase + "Service" | `authService.ts`, `userService.ts` |

### Variables & Functions

```typescript
// ✅ ĐÚNG
const userName = 'John';
const isAuthenticated = true;
const handleSubmit = () => {};
const getUserById = (id: string) => {};

// ❌ SAI
const UserName = 'John';       // Không PascalCase cho biến
const authenticated = true;     // Thiếu is/has prefix cho boolean
const submit = () => {};        // Tên quá ngắn
const getUser = () => {};       // Không rõ ràng
```

### Components & Interfaces

```typescript
// ✅ ĐÚNG
export const Button: React.FC<ButtonProps> = () => {};
interface User {
  id: string;
  name: string;
}

// ❌ SAI
export const button = () => {};     // Không PascalCase
interface IUser {}                  // Tránh prefix I
type TUser = {};                    // Tránh prefix T
```

---

## 🔗 Path Aliases

Dự án sử dụng path aliases để import ngắn gọn:

### Cấu hình trong `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/store/*": ["./src/store/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/contexts/*": ["./src/contexts/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

### Cách sử dụng:

```typescript
// ❌ Import tương đối (khó đọc, dễ lỗi)
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../../hooks/useAuth';
import { formatDate } from '../../../utils/helpers/formatDate';

// ✅ Import với alias (sạch, dễ đọc)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/helpers/formatDate';
```

---

## 🎯 Best Practices

### 1. Component Organization
```typescript
// ✅ ĐÚNG: Tổ chức component tốt
import React from 'react';           // External imports
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';  // Internal imports
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/helpers/cn';

import { UserCardProps } from './UserCard.types';  // Local imports

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  // 1. Hooks
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 2. State
  const [isOpen, setIsOpen] = useState(false);

  // 3. Effects
  useEffect(() => {
    // ...
  }, []);

  // 4. Handlers
  const handleClick = () => {
    // ...
  };

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### 2. Type Safety
```typescript
// ✅ ĐÚNG: Định nghĩa types rõ ràng
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  return axiosInstance.get<User>(`/users/${id}`);
}

// ❌ SAI: Sử dụng any
function getUser(id: any): Promise<any> {  // Tránh any
  return axiosInstance.get(`/users/${id}`);
}
```

### 3. Error Handling
```typescript
// ✅ ĐÚNG: Handle errors properly
try {
  const user = await userService.getUserById(id);
  setUser(user);
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data.message);
  } else {
    toast.error('Đã xảy ra lỗi');
  }
}
```

### 4. Performance Optimization
```typescript
// ✅ ĐÚNG: Memoize expensive operations
const expensiveValue = useMemo(() => {
  return users.filter(u => u.isActive).sort();
}, [users]);

const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// ✅ ĐÚNG: Lazy load components
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
```

---

## 🚀 Workflow Development

### 1. Tạo component mới
```bash
# 1. Tạo folder
mkdir src/components/ui/NewComponent

# 2. Tạo files
touch src/components/ui/NewComponent/NewComponent.tsx
touch src/components/ui/NewComponent/NewComponent.types.ts
touch src/components/ui/NewComponent/index.ts
```

### 2. Implement component
```typescript
// NewComponent.types.ts
export interface NewComponentProps {
  title: string;
  onAction: () => void;
}

// NewComponent.tsx
import React from 'react';
import { NewComponentProps } from './NewComponent.types';

export const NewComponent: React.FC<NewComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

// index.ts
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './NewComponent.types';
```

### 3. Sử dụng component
```typescript
import { NewComponent } from '@/components/ui/NewComponent';

function MyPage() {
  return (
    <NewComponent 
      title="Hello" 
      onAction={() => console.log('Clicked')} 
    />
  );
}
```

---

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Router](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 💡 Tips & Tricks

1. **Sử dụng TypeScript strict mode** để catch errors sớm
2. **Format code với Prettier** trước khi commit
3. **Chạy ESLint** để đảm bảo code quality
4. **Lazy load pages** để cải thiện performance
5. **Sử dụng path aliases** thay vì relative imports
6. **Memoize components** khi cần thiết với `React.memo`
7. **Tách logic phức tạp** thành custom hooks
8. **Reuse UI components** thay vì duplicate code

---

**Cập nhật lần cuối**: 24/10/2025
**Version**: 1.0.0

