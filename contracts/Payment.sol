pragma solidity >=0.4.22 <0.8.0;

contract Payment {
    address payable public transferFrom;
    address payable public transferTo;
    uint256 public paymentAmount;

    constructor() public {
        transferFrom = msg.sender;
    }

    event TransferFundEvent(
        address _transferTo,
        address _transferFrom,
        uint256 amount
    );

    function transferFund(address payable _transferTo)
        public
        payable
        returns (bool)
    {
        transferTo = _transferTo;
        transferTo.transfer(msg.value);
        emit TransferFundEvent(transferTo, transferFrom, msg.value);
        return true;
    }

    function getBalanceOfCurrentAccount() public payable returns (uint256) {
        return transferFrom.balance;
    }


}
