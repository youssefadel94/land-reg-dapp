pragma solidity >=0.4.22 <0.8.0;


contract LandReg {
    //is Ownable{
    address public owner;
    mapping(uint256 => bool) public users;
    //mapping(address => mapping(address => bool)) private ;

    //log
    event LogBool(bool state);
    event LogUint256(uint256 state);
    event LogFixed128x18(fixed128x18 state);

    event CreateUserEvent(uint256 _id);

    constructor() public {
        owner = msg.sender;
    }

    function createUser(uint256 _id) public returns (bool) {
        emit CreateUserEvent(_id);
        return true;
    }

    function isUserReg(uint256 _id) public returns (bool) {
        emit LogBool(users[_id]);
        return true;
    }

    // function registerLand(fixed128x18 long, fixed128x18 lat)
    //     public
    //     returns (bool)
    // {
        
    //     return true;
    //     }
}
