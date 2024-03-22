import { HttpModule, HttpService } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";

import { PhoneService } from "./api/phone.service";
import { ProxyService } from "./api/proxy.service";
import { RateService } from "./api/rate.service";
import { Configuration } from "./configuration";

import type { AsyncConfiguration, ConfigurationFactory } from "./configuration";
import type { DynamicModule, Provider } from "@nestjs/common";

@Global()
@Module({
	exports: [PhoneService, ProxyService, RateService],
	imports: [HttpModule],
	providers: [PhoneService, ProxyService, RateService],
})
export class ApiModule {
	constructor(httpService: HttpService) {}

	public static forRoot(configurationFactory: () => Configuration): DynamicModule {
		return {
			module: ApiModule,
			providers: [{ provide: Configuration, useFactory: configurationFactory }],
		};
	}

	/**
	 * Register the module asynchronously.
	 */
	static forRootAsync(options: AsyncConfiguration): DynamicModule {
		const providers = [...this.createAsyncProviders(options)];

		return {
			exports: providers,
			imports: options.imports || [],
			module: ApiModule,
			providers,
		};
	}

	private static createAsyncConfigurationProvider(options: AsyncConfiguration): Provider {
		if (options.useFactory) {
			return {
				inject: options.inject || [],
				provide: Configuration,
				useFactory: options.useFactory,
			};
		}

		return {
			inject: (options.useExisting && [options.useExisting]) || (options.useClass && [options.useClass]) || [],
			provide: Configuration,
			useFactory: async (optionsFactory: ConfigurationFactory) => optionsFactory.createConfiguration(),
		};
	}

	private static createAsyncProviders(options: AsyncConfiguration): Array<Provider> {
		if (options.useClass) {
			return [
				this.createAsyncConfigurationProvider(options),
				{
					provide: options.useClass,
					useClass: options.useClass,
				},
			];
		}

		return [this.createAsyncConfigurationProvider(options)];
	}
}
