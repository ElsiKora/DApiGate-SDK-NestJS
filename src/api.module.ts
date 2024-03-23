import { HttpModule, HttpService } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";

import { IpService } from "./api/ip.service";
import { PhoneService } from "./api/phone.service";
import { ProxyService } from "./api/proxy.service";
import { RateService } from "./api/rate.service";
import { Configuration } from "./configuration";

import type { AsyncConfiguration, ConfigurationFactory } from "./configuration";
import type { DynamicModule, Provider } from "@nestjs/common";

@Global()
@Module({
	exports: [IpService, PhoneService, ProxyService, RateService],
	imports: [HttpModule],
	providers: [IpService, PhoneService, ProxyService, RateService],
})
export class ApiModule {
	constructor(httpService: HttpService) {}

	/**
	 * Creates a dynamic module for the ApiModule with a custom configuration factory.
	 *
	 * @param {Function} configurationFactory - The function that returns the custom configuration.
	 * @returns {DynamicModule} - The dynamic module object.
	 */
	public static forRoot(configurationFactory: () => Configuration): DynamicModule {
		return {
			module: ApiModule,
			providers: [{ provide: Configuration, useFactory: configurationFactory }],
		};
	}

	/**
	 * Creates a dynamic module for the root of the application asynchronously.
	 *
	 * @param {AsyncConfiguration} options - The configuration options for creating the module asynchronously.
	 * @returns {DynamicModule} A dynamic module object that can be used for bootstrapping the application.
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

	/**
	 * Creates an asynchronous configuration provider based on the provided options.
	 *
	 * This method is used internally and should not be called directly.
	 *
	 * @param {AsyncConfiguration} options - The options for creating the configuration provider.
	 * @returns {Provider} - The created configuration provider.
	 *
	 * @private
	 */
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

	/**
	 * Creates an array of AsyncConfiguration providers based on the given options.
	 *
	 * @param {AsyncConfiguration} options - The options for creating the providers.
	 * @private
	 * @returns {Array<Provider>} - An array of AsyncConfiguration providers.
	 */
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
