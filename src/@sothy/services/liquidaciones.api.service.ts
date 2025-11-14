import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";

export function liquidacionesAPiCreator(http: HttpClient) {
  return new LiquidacionesApiService(http);
}

@Injectable()
export class LiquidacionesApiService extends HttpService {
  override API_URL = environment.apiLiquidaciones;
}
