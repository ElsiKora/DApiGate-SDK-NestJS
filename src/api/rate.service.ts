import { HttpService } from "@nestjs/axios";
import { Injectable, Optional } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

import { Configuration } from "../configuration";

import type { RateGetSimpleListResponseDTO } from "../model/rate-get-simple-list-response-dto.model";

@Injectable()
export class RateService {
	protected basePath = "https://reaper.dapigate.com";

	public configuration = new Configuration();

	public defaultHeaders: Record<string, string> = {};

	/**
	 * Creates an instance of the constructor.
	 * @param {HttpService} httpClient - The HTTP client service.
	 * @param {Configuration} configuration - Optional configuration object.
	 */
	constructor(
		protected httpClient: HttpService,
		@Optional() configuration: Configuration,
	) {
		this.configuration = configuration || this.configuration;
		this.basePath = configuration?.basePath || this.basePath;
	}

	private canConsumeForm(consumes: Array<string>): boolean {
		const form = "multipart/form-data";

		return consumes.includes(form);
	}

	/**
	 * Retrieves a simple list of rates based on a specified base currency.
	 *
	 * @param {string} base - The base currency.
	 *
	 * @returns {Promise<RateGetSimpleListResponseDTO>} A promise that resolves with the response data.
	 * @throws {Error} If the base parameter is null or undefined.
	 */
	public async getSimpleList(base: string): Promise<RateGetSimpleListResponseDTO> {
		if (base === null || base === undefined) {
			throw new Error("Required parameter base was null or undefined when calling rateControllerGetSimpleList.");
		}

		const queryParameters = new URLSearchParams();
		queryParameters.append("base", base);

		const headers = { ...this.defaultHeaders };
		const httpHeaderAccepts: Array<string> = ["application/json"];
		const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);

		if (httpHeaderAcceptSelected !== undefined) {
			headers["Accept"] = httpHeaderAcceptSelected;
		}

		try {
			const observable = this.httpClient.get<RateGetSimpleListResponseDTO>(`${this.basePath}/v1/rate`, {
				headers: headers,
				params: queryParameters,
				withCredentials: this.configuration.withCredentials,
			});

			const response = await lastValueFrom(observable);

			return response.data; // Assuming the response format is as expected.
		} catch (error) {
			// Error handling logic here
			// You can rethrow the error or handle it as per your application's error handling strategy
			throw error;
		}
	}
}
