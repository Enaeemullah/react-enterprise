export const APP_CONFIG = {
  name: 'Enterprise System',
  version: '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'auth_token',
    useDummyAuth: import.meta.env.VITE_USE_DUMMY_AUTH === 'true',
  },
  pagination: {
    defaultLimit: 10,
    defaultPage: 1,
  },
  theme: {
    defaultMode: 'light',
    storageKey: 'theme',
  },
};

export const DUMMY_ACCOUNT = {
  email: 'demo@example.com',
  password: 'demo123',
  name: 'Demo User',
  role: 'admin',
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
  },
  inventory: {
    list: '/inventory',
    create: '/inventory',
    update: '/inventory/:id',
    delete: '/inventory/:id',
    detail: '/inventory/:id',
  },
  branches: {
    list: '/branches',
    create: '/branches',
    update: '/branches/:id',
    delete: '/branches/:id',
    detail: '/branches/:id',
  },
  suppliers: {
    list: '/suppliers',
    create: '/suppliers',
    update: '/suppliers/:id',
    delete: '/suppliers/:id',
    detail: '/suppliers/:id',
  },
  customers: {
    list: '/customers',
    create: '/customers',
    update: '/customers/:id',
    delete: '/customers/:id',
    detail: '/customers/:id',
  },
  services: {
    list: '/services',
    create: '/services',
    update: '/services/:id',
    delete: '/services/:id',
    detail: '/services/:id',
  },
  transfers: {
    list: '/transfers',
    create: '/transfers',
    update: '/transfers/:id',
    cancel: '/transfers/:id/cancel',
    detail: '/transfers/:id',
  },
  roles: {
    list: '/roles',
    create: '/roles',
    update: '/roles/:id',
    delete: '/roles/:id',
    detail: '/roles/:id',
    permissions: '/roles/:id/permissions',
  },
  permissions: {
    list: '/permissions',
    create: '/permissions',
    update: '/permissions/:id',
    delete: '/permissions/:id',
    detail: '/permissions/:id',
    actions: '/permissions/:id/actions',
  },
  actions: {
    list: '/actions',
    create: '/actions',
    update: '/actions/:id',
    delete: '/actions/:id',
    detail: '/actions/:id',
  },
  modules: {
    list: '/modules',
    create: '/modules',
    update: '/modules/:id',
    delete: '/modules/:id',
    detail: '/modules/:id',
  },
  profile: {
    get: '/profile',
    update: '/profile',
    updatePreferences: '/profile/preferences',
  },
    employees: {
    list: '/employees',
    create: '/employees',
    update: '/employees/:id',
    delete: '/employees/:id',
    detail: '/employees/:id',
  },
  departments: {
    list: '/departments',
    create: '/departments',
    update: '/departments/:id',
    delete: '/departments/:id',
    detail: '/departments/:id',
  },
  positions: {
    list: '/positions',
    create: '/positions',
    update: '/positions/:id',
    delete: '/positions/:id',
    detail: '/positions/:id',
  },
};