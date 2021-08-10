import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    roots: [
        "<rootDir>/test"

    ],
    testPathIgnorePatterns:[
        "<rootDir>/test/Auth",
        "<rootDir>/test/playground"
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    verbose: true
}

export default config;