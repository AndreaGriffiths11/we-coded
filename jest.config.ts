import type { Config } from 'jest';

const config: Config = {
	clearMocks: true,
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testMatch: ['**/?(*.)+(test|spec).[tj]s?(x)'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

export default config;

