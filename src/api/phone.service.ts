/**
 * DApiGate
 * DApiGate `Reaper API` documentation
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpService } from "@nestjs/axios";
import { Injectable, Optional } from "@nestjs/common";

import { Configuration } from "../configuration";

import type { PhoneGetResponseDTO } from "../model/phone-get-response-dto.model";
import type { AxiosResponse } from "axios";
import type { Observable } from "rxjs";

@Injectable()
export class PhoneService {
	protected basePath = "https://reaper.dapigate.com";

	public configuration = new Configuration();

	public defaultHeaders: Record<string, string> = {};

	constructor(
		protected httpClient: HttpService,
		@Optional() configuration: Configuration,
	) {
		this.configuration = configuration || this.configuration;
		this.basePath = configuration?.basePath || this.basePath;
	}

	/**
	 * @param consumes string[] mime-types
	 * @return true: consumes contains 'multipart/form-data', false: otherwise
	 */
	private canConsumeForm(consumes: Array<string>): boolean {
		const form = "multipart/form-data";

		return consumes.includes(form);
	}

	/**
	 * Fetching &#x60;Phone&#x60;
	 * This method is used for fetching &#x60;Phone&#x60;
	 * @param phone Phone wallet number
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public phoneControllerGet(phone: number): Observable<AxiosResponse<PhoneGetResponseDTO>>;
	public phoneControllerGet(phone: number): Observable<any> {
		if (phone === null || phone === undefined) {
			throw new Error("Required parameter phone was null or undefined when calling phoneControllerGet.");
		}

		const queryParameters = new URLSearchParams();

		if (phone !== undefined && phone !== null) {
			queryParameters.append("phone", <any>phone);
		}

		const headers = { ...this.defaultHeaders };

		// to determine the Accept header
		const httpHeaderAccepts: Array<string> = ["application/json"];
		const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);

		if (httpHeaderAcceptSelected != undefined) {
			headers["Accept"] = httpHeaderAcceptSelected;
		}

		// to determine the Content-Type header
		const consumes: Array<string> = [];

		return this.httpClient.get<PhoneGetResponseDTO>(`${this.basePath}/v1/phone`, {
			headers: headers,
			params: queryParameters,
			withCredentials: this.configuration.withCredentials,
		});
	}
}
