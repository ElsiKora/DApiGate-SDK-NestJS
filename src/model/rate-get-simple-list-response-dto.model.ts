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
import type { RateGetResponseDTO } from "./rate-get-response-dto.model";

export interface RateGetSimpleListResponseDTO {
	/**
	 * Array of RateGetResponseDTO
	 */
	items?: Set<RateGetResponseDTO>;
	/**
	 * RateGetResponseDTO Total number of items
	 */
	totalCount?: number;
}
