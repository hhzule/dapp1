pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";
  
  // Store Images

  uint public apiCount = 0;

  mapping(uint => Api) public apis;
// changed tipAmount into like
// changed hash into hashes
// changed author into developer


// changed Image into Api and images into apis

  struct Api {
    uint id;
    string hashes;
    string description;
    string githublink;
    uint fund;
    address payable developer;

  }

  event ApiCreated(
    uint id,
    string hashes,
    string description,
    string githublink,
    uint fund,
    address payable developer

  );


  event ApiFunded(
    uint id,
    string hashes,
    string description,
    uint fund,
    address payable developer

  );

  //Create Images

  function createApi(string memory _apiHash, string memory _description, string memory _githublink) public {
    require(bytes(_apiHash).length > 0);
    
    require(bytes(_description).length > 0);

    require(bytes(_githublink).length > 0);

    require(msg.sender != address(0x0));


    // increment
    apiCount ++;
    // add image to contract
    apis[apiCount] = Api(apiCount, _apiHash, _description, _githublink, 0, msg.sender);

    emit ApiCreated(apiCount, _apiHash, _description, _githublink, 0, msg.sender);
  }


function fundApi(uint _id) public payable {
  require(_id > 0 && _id <= apiCount);
  Api memory _api = apis[_id];
  address payable _developer = _api.developer;
  address(_developer).transfer(msg.value);
  _api.fund = _api.fund + msg.value;
  apis[_id] = _api;
  emit ApiFunded(_id, _api.hashes, _api.description, _api.fund, _developer);
}


}
