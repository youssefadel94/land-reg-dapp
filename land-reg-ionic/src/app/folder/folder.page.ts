import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../contract';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute, private contractService: ContractService) { }

  title = 'your first DApp in Angular';
  accounts: any;
  transferFrom = '0x0';
  balance = '0 ETH';
  transferTo = '';
  amount = 0;
  remarks = '';

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.initAndDisplayAccount();
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

  transferEther(event) {
    let that = this;
    console.log(this.transferTo);
    this.contractService.transferEther(
      this.transferFrom,
      this.transferTo,
      this.amount,
      this.remarks
    ).then(function () {
      that.initAndDisplayAccount();
    }).catch(function (error) {
      console.log(error);
      that.initAndDisplayAccount();
    })
  }
}
