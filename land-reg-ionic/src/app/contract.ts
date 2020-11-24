import { Injectable } from '@angular/core';
//import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

const Web3 = require("web3");
declare let require: any;
declare let window: any;

let tokenAbi = require('../../../build/contracts/LandReg.json');

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private web3Provider: null;
  private contracts: {};


  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://192.168.190.1:7545');
    }

    window.web3 = new Web3(this.web3Provider);
    this.getAccountInfo();
  }

  getAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          window.web3.eth.getBalance(account, function (err, balance) {
            if (err === null) {
              return resolve({ fromAccount: account, balance: (window.web3.utils.fromWei(balance, "ether")) });
            } else {
              return reject({ fromAccount: "error", balance: 0 });
            }
          });
        }
      });
    });
  }
  getID(id, address) {
    let that = this;

    return new Promise((resolve, reject) => {
      let paymentContract = TruffleContract(tokenAbi);
      paymentContract.setProvider(that.web3Provider);
      //from address is the address of sender
      paymentContract.deployed().then(function (instance) {
        return instance.createUser(id, address, {
          from: address,
          value: ""
        });
      }).then(function (status) {
        if (status) {
          return resolve({ status: true });
        }
      }).catch(function (error) {
        console.log(error);

        return reject("Error in getID");
      });
    });
  }
  registerLand(id, address, value) {
    let that = this;

    return new Promise((resolve, reject) => {
      let paymentContract = TruffleContract(tokenAbi);
      paymentContract.setProvider(that.web3Provider);

      paymentContract.deployed().then(function (instance) {
        return instance.registerLand(id, address, value, {
          from: address,
          value: ""
        });
      }).then(function (status) {
        if (status) {
          return resolve({ status: true });
        }
      }).catch(function (error) {
        console.log(error);

        return reject("Error in register property");
      });
    });
  }
  transferProperty(id, address, receiverId, value) {
    let that = this;

    return new Promise((resolve, reject) => {
      let paymentContract = TruffleContract(tokenAbi);
      paymentContract.setProvider(that.web3Provider);

      paymentContract.deployed().then(function (instance) {
        return instance.transferProperty(id, address, receiverId, value, {
          from: address,
          value: ""
        });
      }).then(function (status) {
        if (status) {
          return resolve({ status: true });
        }
      }).catch(function (error) {
        console.log(error);

        return reject("Error in transferProperty");
      });
    });
  }


  // transferEther(
  //   _transferFrom,
  //   _transferTo,
  //   _amount,
  //   _remarks
  // ) {
  //   let that = this;

  //   return new Promise((resolve, reject) => {
  //     let paymentContract = TruffleContract(tokenAbi);
  //     paymentContract.setProvider(that.web3Provider);

  //     paymentContract.deployed().then(function(instance) {
  //         return instance.transferFund(
  //           _transferTo,
  //           {
  //             from:_transferFrom,
  //             value: window.web3.utils.toWei(_amount, "ether")
  //           });
  //       }).then(function(status) {
  //         if(status) {
  //           return resolve({status:true});
  //         }
  //       }).catch(function(error){
  //         console.log(error);

  //         return reject("Error in transferEther service call");
  //       });
  //   });
  // }
}