import { BaseProvider, Contract } from '@clarigen/core';
import type { ExampleTokenContract } from './types';
export type { ExampleTokenContract } from './types';
export declare const exampleTokenContract: (provider: BaseProvider) => ExampleTokenContract;
export declare const exampleTokenInfo: Contract<ExampleTokenContract>;
