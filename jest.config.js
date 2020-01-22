module.exports = {
    moduleNameMapper: {
        '\\.(css|pcss)$': 'identity-obj-proxy',
        '\\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/jest/fileMock.js'
    },
    roots: ['<rootDir>/src'],
    modulePathIgnorePatterns: ['/build/.*', '/lib/.*'],
    setupFiles: ['<rootDir>/jest/setupTests.js'],
    setupFilesAfterEnv: ['./jest/rtl.setup.js'],
    coverageDirectory: '<rootDir>/jest/coverage',
    globals: {
        PROJECT_ENV: 'development'
    }
};
