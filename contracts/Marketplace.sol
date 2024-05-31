// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Asset {
        uint id;
        address payable owner;
        string name;
        string uri;
        uint price;
        bool forSale;
    }

    uint public assetCount;
    mapping(uint => Asset) public assets;

    event AssetCreated(
        uint id,
        address owner,
        string name,
        string uri,
        uint price,
        bool forSale
    );

    event AssetPurchased(
        uint id,
        address owner,
        string name,
        string uri,
        uint price,
        bool forSale
    );

    function createAsset(string memory _name, string memory _uri, uint _price) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_uri).length > 0, "URI cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        assetCount++;
        assets[assetCount] = Asset(assetCount, payable(msg.sender), _name, _uri, _price, true);

        emit AssetCreated(assetCount, msg.sender, _name, _uri, _price, true);
    }

    function purchaseAsset(uint _id) public payable {
        Asset memory _asset = assets[_id];
        require(_asset.id > 0 && _asset.id <= assetCount, "Asset does not exist");
        require(msg.value >= _asset.price, "Not enough ether to purchase the asset");
        require(_asset.forSale, "Asset is not for sale");
        require(_asset.owner != msg.sender, "Cannot purchase your own asset");

        address payable _seller = _asset.owner;
        _asset.owner = payable(msg.sender);
        _asset.forSale = false;
        assets[_id] = _asset;

        _seller.transfer(msg.value);

        emit AssetPurchased(_id, _asset.owner, _asset.name, _asset.uri, _asset.price, _asset.forSale);
    }
}
