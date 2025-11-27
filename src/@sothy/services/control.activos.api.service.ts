import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";

export function controlActivosAPiCreator(http: HttpClient) {
  return new ControlActivosApiService(http);
}

@Injectable()
export class ControlActivosApiService extends HttpService {
  override API_URL = environment.apiControlActivos;
}
