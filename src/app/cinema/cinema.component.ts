import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CinemaService } from '../service/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public salles;
  public currentVille;
  public currentCinema;
  public currentProjection;
  public selectedTickets;

  constructor(private cinemaService:CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles()
    .subscribe(data=>{
      this.villes=data;
    },err=>{
      console.log(err);
    })
  }
  
  onGetCinemas(ville){
    this.currentVille=ville;
    this.salles=undefined;
    this.cinemaService.getCinemas(ville)
    .subscribe(data=>{
      this.cinemas=data;
    },err=>{
      console.log(err);
    })
  }

  onGetSalles(cinema){
    this.currentCinema=cinema;
    this.cinemaService.getSalles(cinema)
    .subscribe(data=>{
      this.salles=data;
      this.salles._embedded.salles.forEach(salle => {
        this.cinemaService.getProjections(salle)
        .subscribe(data=>{
          salle.projections=data;
        },err=>{
          console.log(err);
        })
      });
    },err=>{
      console.log(err);
    })
  }
//[ngClass]="ticket.reserve==true?'btn btn-warning ticket':'btn btn-success ticket'"
  onGetTicketsPlaces(projection){
    this.currentProjection=projection;
    this.cinemaService.getTicketsPlaces(projection)
    .subscribe(data=>{
      this.currentProjection.tickets=data;
      this.selectedTickets=[];
    },err=>{
      console.log(err);
    })
  }

  onSelectTicket(ticket){
    if(!ticket.selected){
      ticket.selected=true;
      this.selectedTickets.push(ticket);
    }
    else{
      ticket.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(ticket),1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(ticket){
    let str="btn ticket ";
    if(ticket.reserve==true)
      {str+="btn-danger ";}
    else{
      if(ticket.selected)
      {str+="btn-warning ";}
      else{
      {str+="btn-success ";}
      }
    }
    return str;
  }

  onPayTickets(dataForm){
    let tickets=[] as any;
    this.selectedTickets.forEach(tic=>{
      tickets.push(tic.id);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm)
    .subscribe(data=>{
      alert("Tickets reserves avec succes!");
      this.onGetTicketsPlaces(this.currentProjection);
    },err=>{
      console.log(err);
    })
  }

}
