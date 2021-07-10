import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host:string="http://localhost:8080"

  constructor(private http:HttpClient) { }

  public getVilles(){
    return this.http.get(this.host+"/villes");
  }

  public getCinemas(ville){
    return this.http.get(ville._links.cinemas.href);
  }

  public getSalles(cinema){
    return this.http.get(cinema._links.salles.href);
  }

  public getProjections(salle){
    let url =salle._links.projections.href.replace("{?projection}","?projection=p1");
    return this.http.get(url);
  }

  public getTicketsPlaces(projection)
  {
    let url =projection._links.tickets.href.replace("{?projection}","?projection=ticketProj");
  return this.http.get(url);
  }

  public payerTickets(dataForm){
    return this.http.post(this.host+"/payerTickets",dataForm);
  }
}
