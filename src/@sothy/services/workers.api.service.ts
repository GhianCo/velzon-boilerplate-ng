import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";

export function workersAPiCreator(http: HttpClient) {
  return new WorkersApiService(http);
}

@Injectable()
export class WorkersApiService extends HttpService {
  override API_URL = environment.apiWorkers;
}
