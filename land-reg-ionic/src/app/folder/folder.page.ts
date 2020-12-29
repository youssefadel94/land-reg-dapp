import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../contract';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase'
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
  success: string;
  register: boolean = true;
  transfer: boolean = false;
  regText = "register property";
  title = 'LandRegistry DApp';
  whyID = 'for simplicity we use id can be any unique id only you know and pass... or we can switch to higher security with crypto address and private key';
  accounts: any;
  transferFrom = '0x0';
  balance = '0 ETH';
  transferTo = '';
  amount = 0;
  remarks = '';
  id;
  receiverId;
  address;
  value;
  error = "";
  addressFireBase;
  location: firebase.firestore.GeoPoint;
  _apartment: apartment;
  signIn = true;
  transText: string = "toggle Transfer Property";


  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, private activatedRoute: ActivatedRoute, private contractService: ContractService) {

    this.afAuth.signInAnonymously();
    this.apartmentsCollectionRef = this.afs.collection('apartment');
    this.apartment = this.apartmentsCollectionRef.valueChanges();
  }

  apartmentSeed = "ixdaT6MVNjmOCR2a4Tu0";
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
  getID() {
    console.log(this.id);
    this.contractService.getID(this.id, this.address).then(() => { 
      this.signIn = !this.signIn;
      this.register = !this.register;
      this.success = "welcome " + this.id;
      this.error = "";
    }).catch((error) => { 
      console.log(error);
      this.success = "";
      this.error = "wrong log data";
    });
    //this.getOwned();
    
  }
  apartments=[];
  getOwned(apart) {
    let that = this;
    this.apartments.push({ id: this.apartmentSeed, data: apart});
    console.log(this.apartments);
    // this.contractService.registerLand(this.id, this.address, this.value).then(
    //   function () {
    //     that.success = "transfer complete"; 
    //     that.error = ""
    //     that.initAndDisplayAccount();
    //   }).catch(function (error) {
    //     console.log(error);
    //     that.success = ""; 
    //     that.error = "something went wrong in register land"
    //     that.initAndDisplayAccount();
    //   });

  }
  registerLand() {
    if (this.register) {
      let that = this;
      console.log(this.id, this.address, this.value);

      if (this.getApartment(this.value)) {
        //this.getID();
        this.contractService.registerLand(this.id, this.address, this.value).then(
          function () {
            that.success = "register complete";

            that.error = "";
            that.initAndDisplayAccount();
          }).catch(function (error) {
            console.log(error);
            that.success = "";
            that.error = "something went wrong in register land";
            that.initAndDisplayAccount();
          });
      }
    }
    else {
      this.register = true;
      this.transfer = false;
      this.regText = "register property"; this.transText = "toggle Transfer Property";
    }
  }
  transferProperty() {
    if (this.transfer) {
      let that = this;
      console.log(this.id, this.address, this.receiverId, this.value);
      //this.getID();
      this.contractService.transferProperty(this.id, this.address, this.receiverId, this.value).then(
        function () {
          that.success = "transfer complete";
          that.error = "";
          that.initAndDisplayAccount();
        }).catch(function (error) {
          console.log(error);
          that.success = ""; 
          that.error = "receiving id is not registered"
          that.initAndDisplayAccount();
        });
    }
    else { 
      this.transfer = true;
      this.register = false; console.log(this.register, this.transfer);
      this.regText = "toggle register property";
      this.transText = "Transfer Property"
    }
  }

  createApartment(name: string, description: string, quantity: number) {
    this.apartmentsCollectionRef.add({ address: this.addressFireBase, location: this.location, approved: false });
  }
  // https://www.google.com/maps/dir/33.93729,-106.85761/33.91629,-106.866761/33.98729,-106.85861//@
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
          this.getOwned(doc.data());
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
