import { HttpService } from "@nestjs/axios";
import { Injectable, Optional } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

import { Configuration } from "../configuration";

import type { PhoneGetResponseDTO } from "../model/phone-get-response-dto.model";

@Injectable()
export class PhoneService {
	protected basePath = "https://reaper.dapigate.com";

	public configuration = new Configuration();

	public defaultHeaders: Record<string, string> = {};

	/**
	 * Constructor for the given class.
	 *
	 * @param {HttpService} httpClient - The HttpClient service to be used for making HTTP requests.
	 * @param {Configuration} configuration - An optional configuration object.
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
	 * Retrieves phone information based on the given phone number.
	 * @param {number} phone - The phone number for which to retrieve information.
	 * @return {Promise<PhoneGetResponseDTO>} A Promise that resolves to the phone information as PhoneGetResponseDTO.
	 */
	public get(phone: number): Promise<PhoneGetResponseDTO>;
	/**
	 * Retrieves information for a phone number.
	 *
	 * @param {number} phone - The phone number for which information needs to be retrieved.
	 * @return {Promise<any>} - A promise that resolves to the response data.
	 * @throws {Error} - If the phone parameter is null or undefined.
	 */
	public async get(phone: number): Promise<any> {
		if (phone === null || phone === undefined) {
			throw new Error("Required parameter phone was null or undefined when calling phoneControllerGet.");
		}

		const queryParameters = new URLSearchParams();
		queryParameters.append("phone", phone.toString());

		const headers = { ...this.defaultHeaders };
		const httpHeaderAccepts: Array<string> = ["application/json"];
		const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);

		if (httpHeaderAcceptSelected !== undefined) {
			headers["Accept"] = httpHeaderAcceptSelected;
		}

		try {
			const observable = this.httpClient.get<PhoneGetResponseDTO>(`${this.basePath}/v1/phone`, {
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
