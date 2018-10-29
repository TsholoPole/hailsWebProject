import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class SuggestionService
{
  constructor(private http: Http){}

  connection = "127.1.1.0:3000";

  private headers = new Headers ({
    'Content-Type': 'application/json',
    // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  });

  getSuggestions() : any
  {
    let uri = 'http://'+this.connection+'/api/gaze-data';

    return this.http.get(uri, {headers : this.headers})
  }

  checkIfDataExists() : any{
    let uri = 'http://'+this.connection+'/api/check-data';

    return this.http.get(uri, {headers : this.headers})
  }

}
