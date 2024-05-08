// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MintXPassToken is ERC721Enumerable, Ownable {
    uint constant public MAX_TOKEN_COUNT = 1000;
    string public tokenName = "XPassToken";
    string public tokenSymbol = "XPT";
    string public metadataURI = "https://gametok.co.kr/metadata/json/sample";

    // 10^18 Peb = 1 Klay ( 10^14 = 0.0001 klay)
    uint public xPassTokenPrice = 100000000000000;


    string baseURI;
    string notRevealedUri;
    bool public revealed = false;
    bool public publicMintEnabled = false;

    ////////////////////////////////////////////////////////////////////////////////
    //for whitelist
    mapping(address => uint) private map_addr;
    bool use_whitelist = true;
    uint count = 0;

    function is_whitelist(address addr) public view returns(uint) {
        return map_addr[addr];
    }

    function is_whitelist_2() public view returns(uint) {
        return map_addr[msg.sender];
    }

    function add_whitelist(address a) public onlyOwner {
        require(map_addr[a] == 0);

        map_addr[a] = 1;
    }
    
    function del_whitelist(address a) public onlyOwner {
        require(map_addr[a] != 0);

        // map_data[a] = 0;
        delete map_addr[a];
    }

    function set_use_whitelist(bool b) public onlyOwner {
        use_whitelist = b;
    }
    
    function mint_a() public {
        if(use_whitelist) {
            require(is_whitelist_2() != 0);
        }

        count++;
        // _mint(no, link);
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    function _baseURI() override internal view returns (string memory) {
      return baseURI;
    }

    function _notrevealedURI() internal view returns (string memory) {
      return notRevealedUri;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
      baseURI = _newBaseURI;
    }

    function setNotRevealedURI(string memory _newNotRevealedURI) public onlyOwner {
      notRevealedUri = _newNotRevealedURI;
    }

    function reveal(bool _state) public onlyOwner{
      revealed = _state;
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    /*
    constructor (string memory _name, string memory _symbol, string memory _metadataURI) Ownable(msg.sender) ERC721(_name, _symbol) {
        metadataURI = _metadataURI;
    }
    */
    constructor () Ownable(msg.sender) ERC721(tokenName, tokenSymbol) {
      //metadataURI = "https://gametok.co.kr/metadata/json/sample";
      address a = msg.sender;
      map_addr[a] = 1;
    }

    function tokenURI(uint _tokenId) override public view returns (string memory) {

        return string(abi.encodePacked(metadataURI, '/', Strings.toString(_tokenId), ".json"));
  }

  function mintXPassToken() public payable {
    if(use_whitelist) {
      require(is_whitelist_2() != 0);
    }
    require(xPassTokenPrice <= msg.value, "Not enough Klay.");
    require(MAX_TOKEN_COUNT > totalSupply(), "No more minting is possible.");

    uint tokenId = totalSupply() + 1;

    payable(owner()).transfer(msg.value);

    _mint(msg.sender, tokenId);
  }
  //////////////////////////////////////////////////////////////////////////////////////
  function safeMint(address to) public {
     if(use_whitelist) {
      require(is_whitelist_2() != 0);
    }
        //uint256 tokenId = _tokenIdCounter.current();
        //_tokenIdCounter.increment();
        require(MAX_TOKEN_COUNT > totalSupply(), "No more minting is possible.");
        uint tokenId = totalSupply() + 1;
        
        _safeMint(to, tokenId);
  }

  function batchMint(address to, uint amount) public {
    if(use_whitelist) {
      require(is_whitelist_2() != 0);
    }

        for (uint i = 0; i < amount; i++) {
            safeMint(to);
        }
  }
  

}