// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./MintXPassToken.sol";

contract SaleXPassToken {
    MintXPassToken public mintXPassToken;

    constructor(address _mintXPassToken) {
        mintXPassToken = MintXPassToken(_mintXPassToken);
    }

    struct XPassTokenData {
        uint tokenId;
        uint tokenPrice;
    }

    mapping(uint => uint) public tokenPrices;

    uint[] public onSaleTokens;

    function setForSaleXPassToken(uint _tokenId, uint _price) public {
        address tokenOwner = mintXPassToken.ownerOf(_tokenId);

        require(tokenOwner == msg.sender, "Caller is not XPass token owner.");
        require(_price > 0, "Price is zero or lower.");
        require(tokenPrices[_tokenId] == 0, "This XPass token is already on sale.");
        require(mintXPassToken.isApprovedForAll(msg.sender, address(this)), "XPass token onwer did not approve token.");

        tokenPrices[_tokenId] = _price;

        onSaleTokens.push(_tokenId);
    }

    function purchaseXPassToken(uint _tokenId) public payable {
        address tokenOwner = mintXPassToken.ownerOf(_tokenId);

        require(tokenOwner != msg.sender, "Caller is XPass token owner.");
        require(tokenPrices[_tokenId] > 0, "This XPass token not sale.");
        require(tokenPrices[_tokenId] <= msg.value, "Caller sent lower than price.");

        payable(tokenOwner).transfer(msg.value);

        mintXPassToken.safeTransferFrom(tokenOwner, msg.sender, _tokenId);

        tokenPrices[_tokenId] = 0;

        popOnSaleToken(_tokenId);
    }

    function popOnSaleToken(uint _tokenId) private {
        for(uint i = 0; i < onSaleTokens.length; i++) {
            if(onSaleTokens[i] == _tokenId) {
                onSaleTokens[i] = onSaleTokens[onSaleTokens.length - 1];
                onSaleTokens.pop();
            }
        }
    }

    function getXPassTokens(address _tokenOwner) public view returns(XPassTokenData[] memory) {
        uint balanceLength = mintXPassToken.balanceOf(_tokenOwner);

        require(balanceLength > 0, "Token owner did not have token.");

        XPassTokenData[] memory xPassTokens = new XPassTokenData[](balanceLength);

        for(uint i = 0; i < balanceLength; i++) {
            uint tokenId = mintXPassToken.tokenOfOwnerByIndex(_tokenOwner, i);
            
            (uint tokenPrice) = getXPassTokenInfo(tokenId);

            xPassTokens[i] = XPassTokenData(tokenId, tokenPrice);
        }

        return xPassTokens;
    }

    function getSaleXPassTokens() public view returns(XPassTokenData[] memory) {
        require(onSaleTokens.length > 0, "Not exist on sale token.");

        XPassTokenData[] memory xPassTokens = new XPassTokenData[](onSaleTokens.length);

        for(uint i = 0; i < onSaleTokens.length; i++) {
            uint tokenId = onSaleTokens[i];

            (uint tokenPrice) = getXPassTokenInfo(tokenId);

            xPassTokens[i] = XPassTokenData(tokenId, tokenPrice);
        }

        return xPassTokens;
    }

    function getLatestMintedXPassToken(address _tokenOwner) public view returns(XPassTokenData memory) {
        uint balanceLength = mintXPassToken.balanceOf(_tokenOwner);

        uint tokenId = mintXPassToken.tokenOfOwnerByIndex(_tokenOwner, balanceLength - 1);

        ( uint tokenPrice) = getXPassTokenInfo(tokenId);

        return XPassTokenData(tokenId, tokenPrice);
    }

    function getXPassTokenInfo(uint _tokenId) public view returns(uint) {
  
        uint tokenPrice = tokenPrices[_tokenId];

        return (tokenPrice);
    } 
}