import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../contract';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase  from 'firebase'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface apartment {
  address: string,
  location: firebase.firestore.GeoPoint,
  approved: boolean,
  
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})


export class FolderPage implements OnInit {
  public folder: string;
apartment: Observable<apartment[]>;
apartmentsCollectionRef: AngularFirestoreCollection<apartment>;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, private activatedRoute: ActivatedRoute, private contractService: ContractService) { 

    this.afAuth.signInAnonymously();
    this.apartmentsCollectionRef = this.afs.collection('apartment');
    this.apartment = this.apartmentsCollectionRef.valueChanges();
  }

  
  title = 'LandRegistry DApp';
  accounts: any;
  transferFrom = '0x0';
  balance = '0 ETH';
  transferTo = '';
  amount = 0;
  remarks = '';
  id ;
  receiverId;
  address;
  value;
  error = "";
  addressFireBase;
  location: firebase.firestore.GeoPoint;
  _apartment: apartment;



  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.initAndDisplayAccount();
    this.getApartment("ixdaT6MVNjmOCR2a4Tu0");
  }
  initAndDisplayAccount = () => {
    let that = this;
    this.contractService.getAccountInfo().then(function (acctInfo: any) {
      console.log(acctInfo);
      that.transferFrom = acctInfo.fromAccount;
      that.balance = acctInfo.balance;
    }).catch(function (error) {
      console.log(error);
    });

  };
  getID(){
    console.log(this.id);
    this.contractService.getID(this.id, this.address);
    this.getOwned();
    this.error = "account registered";
  }
  getOwned() { 
    let that = this;
      this.contractService.registerLand(this.id, this.address, this.value).then(
        function () {
          that.error = "transfer complete";
          that.initAndDisplayAccount();
        }).catch(function (error) {
          console.log(error);
          that.error = "something went wrong in register land"
          that.initAndDisplayAccount();
        });
    
  }
  registerLand() {
    let that = this;
    console.log(this.id, this.address, this.value);
    
    if (this.getApartment(this.value)) {
      this.getID();
    this.contractService.registerLand(this.id, this.address, this.value).then(
      function () {
        that.error = "transfer complete";
        that.initAndDisplayAccount();
      }).catch(function (error) {
        console.log(error);
        that.error = "something went wrong in register land"
        that.initAndDisplayAccount();
      });
  }
  }
  transferProperty(){
    let that=this;
    console.log(this.id, this.address,this.receiverId,this.value);
    this.getID();
    this.contractService.transferProperty(this.id, this.address, this.receiverId,this.value).then(
      function () {
        that.error="transfer complete";
      that.initAndDisplayAccount();
    }).catch(function (error) {
      console.log(error);
      that.error = "receiving id is not registered"
      that.initAndDisplayAccount();
    });
  }

  createApartment(name: string, description: string, quantity: number) {
    this.apartmentsCollectionRef.add({ address: this.addressFireBase, location: this.location, approved: false });
  }
  getApartment(id: string): apartment {
    var that = this;
    var apartmentDocuments = this.afs.collection<apartment>('/apartment').doc(id);
    apartmentDocuments.ref.get()
      .then((doc) => {
        if (doc.exists) {
          console.log('Apartment: ', id, doc.data());
          var apartment = doc.data();
          that.addressFireBase = apartment.address;
          that.location = apartment.location;
          that._apartment = <apartment>apartment;
          
        } else {
          console.error('No matching invoice found');
          return null;
        }
        
      });
    return this._apartment;
  }
  // updateapartment(apartment: apartment) {
  //   this.apartmentsCollectionRef.doc(apartment.id).update({ name: 'NEW_NAME', description: 'NEW_DESC', quantity: apartment.quantity + 100 /*NEW QUANTITY*/ });
  // }
  // deleteapartment(apartment: apartment) {
  //   this.apartmentsCollectionRef.doc(apartment.id).delete();
  // }

  // transferEther(event) {
  //   let that = this;
  //   console.log(this.transferTo);
  //   this.contractService.transferEther(
  //     this.transferFrom,
  //     this.transferTo,
  //     this.amount,
  //     this.remarks
  //   ).then(function () {
  //     that.initAndDisplayAccount();
  //   }).catch(function (error) {
  //     console.log(error);
  //     that.initAndDisplayAccount();
  //   })
  // }
}
