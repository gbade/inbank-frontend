// Import Vue Test Utils globals
const { config } = require('@vue/test-utils')

// Mock browser globals
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
    dispatchEvent: jest.fn(),
}))
})

// Configure Vue Test Utils global mocks/stubs
config.global.mocks = {
// Add any global mocks here
$t: (msg) => msg,
$store: {
    state: {},
    commit: jest.fn(),
    dispatch: jest.fn(),
}
}

// Configure Vue Test Utils global plugins
config.global.plugins = []

// Configure Vue Test Utils global directives
config.global.directives = {
// Add any global directives here
}

// Configure Vue Test Utils global components
config.global.components = {
// Add any global components here
}

// Configure Vue Test Utils global stubs
config.global.stubs = {
transition: false,
'transition-group': false
}

// Jest DOM specific setup
Object.defineProperty(window, 'getComputedStyle', {
value: () => ({
    getPropertyValue: () => ''
})
})

