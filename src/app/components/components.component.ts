import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LandingService } from './landing/landing.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as Rellax from 'rellax';

@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styles: [`
    ngb-progressbar {
        margin-top: 5rem;
    }
    `]
})

export class ComponentsComponent implements OnInit, OnDestroy {
    closeResult: string;
    data : Date = new Date();
    focus;
    focus1;
    focus3;
    focus4;
    focus5;
    focus6;
    focus7;

    form: FormGroup;
    zips: any[] = [];
    date: {year: number, month: number};
    model: NgbDateStruct;

    public isCollapsed = true;
    public isCollapsed1 = true;
    public isCollapsed2 = true;

    state_icon_primary = true;

    constructor( private modalService: NgbModal, public landingService: LandingService, private renderer : Renderer2, config: NgbAccordionConfig) {
        config.closeOthers = true;
        config.type = 'info';
    }
    isWeekend(date: NgbDateStruct) {
        const d = new Date(date.year, date.month - 1, date.day);
        return d.getDay() === 0 || d.getDay() === 6;
    }

    isDisabled(date: NgbDateStruct, current: {month: number}) {
        return date.month !== current.month;
    }

    get f(){
        return this.form.controls;
    }

    ngOnInit() {
        var rellaxHeader = new Rellax('.rellax-header');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('index-page');

        this.createForm();
    }

    ngOnDestroy(){
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }


    createForm(){
        this.form = new FormGroup({
          name:  new FormControl('', [ 
            Validators.required, 
            Validators.minLength(4),
            Validators.maxLength(200),
            Validators.pattern('^[0-9a-zA-ZÁáÀàÉéÈèÍíÌìÓóÒòÚúÙùÑñüÜ \-\']+') ]),
          email: new FormControl('', [ 
            Validators.required,
            Validators.email,
            Validators.minLength(4),
            Validators.maxLength(400)
          ]),
          message:  new FormControl('', [ 
            Validators.required, 
            Validators.minLength(10) ]),
          zip:  new FormControl('', [ 
            Validators.required, 
            Validators.pattern('[0-9]{5}') ]),
          state:  new FormControl('', [ 
            Validators.required]),
          municipality:  new FormControl('', [ 
            Validators.required ]),
          colony:  new FormControl('', [ 
            Validators.required]),

        });
    }


    requestInformationByZip(event){
        const zip = event.target.value
        this.landingService.get(zip).subscribe(
          res => {
            const catalogInfo = JSON.parse(res.CatalogoJsonString)[0]
            this.form.patchValue({
                state: catalogInfo.Municipio.Estado.sEstado,
                municipality: catalogInfo.Municipio.sMunicipio
            })
            this.zips = catalogInfo.Ubicacion;
          },
          err => {
            console.log(err)
          }
        )
    }

    open(content, type, modalDimension) {
        if (modalDimension === 'sm' && type === 'modal_mini') {
            this.modalService.open(content, { windowClass: 'modal-mini modal-primary', size: 'sm' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        } else if (modalDimension == undefined && type === 'Login') {
          this.modalService.open(content, { windowClass: 'modal-login modal-primary' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        } else {
            this.modalService.open(content).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
}
