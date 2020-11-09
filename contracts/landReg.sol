pragma solidity >=0.4.22 <0.8.0;

contract LandReg {
    //is Ownable{
    address public owner;
    mapping(uint256 => uint256) public users;
    //mapping(address => mapping(address => bool)) private ;

    //log
    event LogBool(bool state);
    event LogUint256(uint256 state);
    event LogFixed128x18(fixed128x18 state);

    event CreateUserEvent(uint256 _id);

    event SendSomethingEvent(
        uint256 sender,
        uint256 receiver,
        fixed128x18 long,
        fixed128x18 lat
    );

    constructor() public {
        owner = msg.sender;
    }

    function createUser(uint256 _id) public returns (bool) {
        require(users[_id] == 0, "user already registered");
        users[_id] = _id;
        emit CreateUserEvent(_id);
        return true;
    }

    // function isUserReg(uint256 _id) private returns (bool) {
    //     uint256 state = users[_id];
    //     //emit LogUint256(state);
    //     return state == 0;
    // }

    //function send test
    function sendSomething(
        uint256 sender,
        uint256 receiver,
        fixed128x18 long,
        fixed128x18 lat
    ) public returns (bool) {
        require(users[receiver] != 0, "receiver is not registered");
        emit SendSomethingEvent(sender, receiver, long, lat);
        return true;
    }

    // function registerLand(fixed128x18 long, fixed128x18 lat)
    //     public
    //     returns (bool)
    // {

    //     return true;
    //     }
}
