pragma solidity >=0.4.22 <0.8.0;

import "@nomiclabs/buidler/console.sol";


contract Payment {
    //is Ownable{
    address public owner;
    mapping(uint256 => bool) public users;
    //mapping(address => mapping(address => bool)) private ;

    event CreateUserEvent(uint256 _id);

    constructor() public {
        owner = msg.sender;
    }

    function createUser(uint256 _id) public returns (bool) {
        emit CreateUserEvent(_id);
        return true;
    }

    function isUserReg(uint256 _id) public returns (bool) {
        console.log(users[_id]);
        return true
    }

    function registerLand(fixed128x18 long, fixed128x18 lat)
        public
        returns (bool)
    {}
}
