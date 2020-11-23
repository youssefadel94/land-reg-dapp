pragma solidity >=0.4.22 <0.8.0;


contract LandReg {
    //is Ownable{
    
    // struct Data {  
    //     string name;  
    //     string long;
    //     string lat; 
    //     string owner;
    // }

    address public owner;

    mapping(uint256 => address) public users;
    //mapping(address => mapping(uint256 => data)) public property;
    mapping(address => mapping(uint256 => bool)) public propertyFireBase;
    //mapping(address => mapping(address => bool)) private ;

    //log
    event LogBool(bool state);
    event LogUint256(uint256 state);
    //event LogFixed128x18(fixed128x18 state);

    event CreateUserEvent(uint256 _id);

    event DeclarePropertyEvent(
        uint256 sender,
        uint256 value
    );

    event TransferPropertyEvent(
        uint256 sender,
        uint256 receiver,
        uint256 value
    );

    constructor() public {
        owner = (address(this));//msg.sender;//make contract owner of itself
    }

    // function createUser(uint256 _id, address _address) public returns (bool) {
    //     //require(users[_id] == _address, "user already registered");
    //     users[_id] = _id;
    //     emit CreateUserEvent(_id);
    //     return true;
    // }

    function enterUser(uint256 _id, address _address) public returns (bool) {
        require(users[_id] == address(0), "user already registered");
        users[_id] = _address;
        //emit CreateUserEvent(_id);
        return true;
    }
    // function isUserReg(uint256 _id) private returns (bool) {
    //     uint256 state = users[_id];
    //     //emit LogUint256(state);
    //     return state == 0;
    // }
    //function registerLand test
    function registerLand(
        uint256 sender,
        uint256 value
    ) public returns (bool) {
        require(users[sender] != address(0), "receiver is not registered");
        require(!(propertyFireBase[users[sender]][value]), "you own this property");
        //delete propertyFireBase[users[sender]][value];
        propertyFireBase[users[sender]][value] = true;
        emit DeclarePropertyEvent(sender, value);//, long, lat);
        return true;
    }

    //function send test
    function transferProperty(
        uint256 sender,
        uint256 receiver,
        uint256 value
    ) public returns (bool) {
        require(users[receiver] != address(0), "receiver is not registered");
        require(propertyFireBase[users[sender]][value] , "you do not own this property");
        delete propertyFireBase[users[sender]][value];
        propertyFireBase[users[receiver]][value] = true;
        emit TransferPropertyEvent(sender, receiver, value);//, long, lat);
        return true;
    }

}
