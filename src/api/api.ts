export * from "./ip.service";
import { IpService } from "./ip.service";

export * from "./phone.service";
import { PhoneService } from "./phone.service";

export * from "./proxy.service";
import { ProxyService } from "./proxy.service";

export * from "./rate.service";
import { RateService } from "./rate.service";

export const APIS = [IpService, PhoneService, ProxyService, RateService];
