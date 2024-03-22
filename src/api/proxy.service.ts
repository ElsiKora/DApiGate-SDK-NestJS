import { lastValueFrom } from 'rxjs';
import { HttpService } from "@nestjs/axios";
import { Injectable, Optional } from "@nestjs/common";
import { Configuration } from "../configuration";
import type { ProxyGetListResponseDTO } from "../model/proxy-get-list-response-dto.model";

@Injectable()
export class ProxyService {
	protected basePath = "https://reaper.dapigate.com";
	public configuration = new Configuration();
	public defaultHeaders: Record<string, string> = {};

	/**
	 * Constructor for the class.
	 *
	 * @param {HttpService} httpClient - The HTTP service to be used for making requests.
	 * @param {Configuration} configuration - The optional configuration object for the class.
	 */
	constructor(
		protected httpClient: HttpService,
		@Optional() configuration: Configuration,
	) {
		this.configuration = configuration || this.configuration;
		this.basePath = configuration?.basePath || this.basePath;
	}

	private canConsumeForm(consumes: string[]): boolean {
		const form = "multipart/form-data";
		return consumes.includes(form);
	}

	/**
	 * Retrieves a list of proxy data based on the specified limit, page, and optional country.
	 *
	 * @param {number} limit - The number of proxy entries to retrieve per page.
	 * @param {number} page - The page number of the proxy entries to retrieve.
	 * @param {string} [country] - The country filter for the proxy entries (optional).
	 * @returns {Promise<ProxyGetListResponseDTO>} A promise that resolves with the response data containing the list of proxy entries.
	 * @throws {Error} If the required parameters limit or page are null or undefined.
	 * @throws {Error} If there is an error retrieving the proxy data.
	 */
	public async getList(limit: number, page: number, country?: string): Promise<ProxyGetListResponseDTO> {
		if (limit === null || limit === undefined) {
			throw new Error("Required parameter limit was null or undefined when calling proxyControllerGetList.");
		}

		if (page === null || page === undefined) {
			throw new Error("Required parameter page was null or undefined when calling proxyControllerGetList.");
		}

		const queryParameters = new URLSearchParams();
		queryParameters.append("limit", limit.toString());
		queryParameters.append("page", page.toString());

		if (country !== undefined && country !== null) {
			queryParameters.append("country", country);
		}

		const headers = { ...this.defaultHeaders };
		const httpHeaderAccepts: string[] = ["application/json"];
		const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);

		if (httpHeaderAcceptSelected !== undefined) {
			headers["Accept"] = httpHeaderAcceptSelected;
		}

		try {
			const observable = this.httpClient.get<ProxyGetListResponseDTO>(`${this.basePath}/v1/proxy`, {
				headers: headers,
				params: queryParameters,
				withCredentials: this.configuration.withCredentials,
			});

			const response = await lastValueFrom(observable);
			return response.data; // Assuming the response format is as expected.
		} catch (error) {
			// Implement error handling here
			// You could either rethrow the error or handle it based on your error handling strategy
			throw error;
		}
	}
}
