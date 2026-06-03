if (typeof window === 'undefined') {
  // A robust mock of indexedDB for server-side environments (SSR/Build-time)
  const noop = () => {};
  const mockRequest = {
    onerror: null,
    onsuccess: null,
    onupgradeneeded: null,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
    result: null,
    error: null,
    source: null,
    transaction: null,
    readyState: 'pending'
  };

  const mockIndexedDB = {
    open: () => mockRequest,
    deleteDatabase: () => mockRequest,
    cmp: () => 0,
    databases: () => Promise.resolve([])
  };

  try {
    Object.defineProperty(global, 'indexedDB', {
      value: mockIndexedDB,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } catch (e) {
    (global as any).indexedDB = mockIndexedDB;
  }
}
