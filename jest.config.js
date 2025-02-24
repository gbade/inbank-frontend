module.exports = {
testEnvironment: 'jsdom',
moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts', 'tsx'],
transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.[jt]sx?$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
},
moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.esm-bundler.js'
},
transformIgnorePatterns: [
    '/node_modules/(?!(@vue/runtime-core|@vue/runtime-dom|@vue/shared|vue|vuex|axios)/)'
],
testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
},
testMatch: [
    '<rootDir>/src/**/*.spec.[jt]s?(x)'
],
globals: {
    'ts-jest': {
    tsconfig: 'tsconfig.json',
    useESM: true
    }
}
}
