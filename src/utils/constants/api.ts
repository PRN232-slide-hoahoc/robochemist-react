/**
 * API endpoints - Mapped to API Gateway routes
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/v1/users/login',
    REGISTER: '/auth/v1/users/register',
    ME: '/auth/v1/users/me',
    VALIDATE_TOKEN: '/auth/v1/users/validate-token',
    PUBLIC: '/auth/v1/users/public',
    PROTECTED: '/auth/v1/users/protected',
    BY_ID: (id: string) => `/auth/v1/users/${id}`,
  },
  EXAM: {
    REQUEST: '/exam/v1/exams/request',
    REQUEST_BY_ID: (id: string) => `/exam/v1/exams/request/${id}`,
    REQUEST_BY_USER: (userId: string) => `/exam/v1/exams/request/user/${userId}`,
    GENERATE: (examRequestId: string) => `/exam/v1/exams/generate/${examRequestId}`,
    EXAM_BY_ID: (id: string) => `/exam/v1/exams/${id}`,
    EXAM_STATUS: (id: string) => `/exam/v1/exams/${id}/status`,
    MATRICES_BASE: '/exam/v1/matrices',
    MATRIX_BY_ID: (id: string) => `/exam/v1/matrices/${id}`,
    QUESTIONS_BULK: '/exam/v1/questions/bulk',
    QUESTIONS: '/exam/v1/questions',
    QUESTION_BY_ID: (id: string) => `/exam/v1/questions/${id}`,
  },
  SLIDES: {
    GRADES: '/slides/v1/grades',
    GRADE_BY_ID: (id: string) => `/slides/v1/grades/${id}`,
    GENERATE: '/slides/v1/slides/generate',
    ME: '/slides/v1/slides/me',
    ALL: '/slides/v1/slides', // Admin get all slides
    SLIDE_BY_ID: (id: string) => `/slides/v1/slides/${id}`,
    SLIDE_DOWNLOAD: (id: string) => `/slides/v1/slides/${id}/download`,
    SYLLABUSES: '/slides/v1/syllabuses',
    SYLLABUS_BY_ID: (id: string) => `/slides/v1/syllabuses/${id}`,
    SYLLABUS_TOGGLE_STATUS: (id: string) => `/slides/v1/syllabuses/${id}/toggle-status`,
    TOPICS: '/slides/v1/topics',
    TOPIC_BY_ID: (id: string) => `/slides/v1/topics/${id}`,
  },
  TEMPLATE: {
    FILES_UPLOAD: '/template/v1/files/upload',
    FILES_DOWNLOAD: '/template/v1/files/download',
    FILES_DELETE: '/template/v1/files',
    TEMPLATES: '/template/v1/templates', // Returns only ACTIVE templates
    TEMPLATES_STAFF: '/template/v1/templates/staff', // Returns ALL templates (including inactive) for Staff/Admin
    TEMPLATE_BY_ID: (id: string) => `/template/v1/templates/${id}`,
    TEMPLATE_DOWNLOAD: (id: string) => `/template/v1/templates/${id}/download`,
    TEMPLATE_UPLOAD: '/template/v1/templates/upload',
    ORDERS: '/template/v1/orders',
    ORDER_BY_ID: (orderId: string) => `/template/v1/orders/${orderId}`,
    ORDER_BY_NUMBER: (orderNumber: string) => `/template/v1/orders/by-number/${orderNumber}`,
    ORDERS_BY_USER: (userId: string) => `/template/v1/orders/user/${userId}`,
    ORDER_STATUS: (orderId: string) => `/template/v1/orders/${orderId}/status`,
    ORDER_CANCEL: (orderId: string) => `/template/v1/orders/${orderId}/cancel`,
    USER_ORDER_STATS: (userId: string) => `/template/v1/orders/user/${userId}/statistics`,
  },
  WALLET: {
    CREATE_DEPOSIT_URL: '/wallet/v1/payments/create-deposit-url',
    DEPOSIT_CALLBACK: '/wallet/v1/payments/deposit-callback',
    CREATE_PAYMENT_REQUEST: '/wallet/v1/payments/create-payment-request',
    CREATE_REFUND_REQUEST: '/wallet/v1/payments/create-refund-request',
    GET_ALL_TRANSACTIONS: '/wallet/v1/payments/get-all-transaction',
    WALLETS: '/wallet/v1/wallets',
    WALLETS_BALANCE: '/wallet/v1/wallets/balance',
    WALLETS_PAYMENT: '/wallet/v1/wallets/payment',
    WALLETS_REFUND: '/wallet/v1/wallets/refund',
    TRANSACTIONS_BY_REFERENCE: (referenceId: string) => `/wallet/v1/wallets/transactions/reference/${referenceId}`,
  },
} as const;

/**
 * API configuration - Point to API Gateway
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001',
  TIMEOUT: 30000, // Increased timeout for file uploads
} as const;

