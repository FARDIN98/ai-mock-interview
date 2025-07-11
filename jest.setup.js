/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom'

// Mock Firebase Client SDK
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn()
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn()
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn()
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn()
}))

// Mock Firebase Admin SDK
jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
  cert: jest.fn()
}))

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
    createUser: jest.fn(),
    getUserByEmail: jest.fn()
  }))
}))

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      add: jest.fn(),
      where: jest.fn(),
      orderBy: jest.fn(),
      limit: jest.fn(),
      get: jest.fn()
    }))
  }))
}))

// Mock Vapi SDK
jest.mock('@/lib/vapi.sdk', () => ({
  vapi: {
    start: jest.fn(),
    stop: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    send: jest.fn()
  }
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockedImage = ({ src, alt, ...props }) => {
    return <img src={src} alt={alt} {...props} />
  }
  MockedImage.displayName = 'Image'
  return MockedImage
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockedLink = ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  }
  MockedLink.displayName = 'Link'
  return MockedLink
})

// Mock Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  }
}))

// Mock AI SDK
jest.mock('ai', () => ({
  generateText: jest.fn(),
  streamText: jest.fn(),
  generateObject: jest.fn()
}))

// Mock Google AI SDK (only if installed)
try {
  jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: jest.fn()
      }))
    }))
  }))
} catch (error) {
  // Google AI SDK not installed, skip mock
}

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))