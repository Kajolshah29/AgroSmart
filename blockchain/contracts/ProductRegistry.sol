// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProductRegistry {
    struct Product {
        uint256 productId;
        string name;
        uint256 price;
        string unit;
        bool isOrganic;
        address seller;
    }

    uint256 public nextProductId;
    mapping(uint256 => Product) public products;

    event ProductAdded(
        uint256 productId,
        string name,
        uint256 price,
        string unit,
        bool isOrganic,
        address seller
    );

    function addProduct(
        string memory _name,
        uint256 _price,
        string memory _unit,
        bool _isOrganic
    ) public {
        products[nextProductId] = Product(
            nextProductId,
            _name,
            _price,
            _unit,
            _isOrganic,
            msg.sender
        );

        emit ProductAdded(
            nextProductId,
            _name,
            _price,
            _unit,
            _isOrganic,
            msg.sender
        );

        nextProductId++;
    }

    function getProduct(uint256 _productId) public view returns (Product memory) {
        return products[_productId];
    }
}
