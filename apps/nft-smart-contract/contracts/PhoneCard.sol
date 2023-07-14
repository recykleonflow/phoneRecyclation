// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhoneCard is ERC1155, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => string) public tokenIdToUri;
    mapping(address => bool) private allowedMinters;
    mapping(string => bool) private validIpfsUrls;

    constructor() ERC1155("") {}

    modifier onlyAllowedMinters() {
        require(allowedMinters[msg.sender], "Caller is not an allowed minter");
        _;
    }

    modifier onlyValidIpfsUrl(string memory _ipfsUrl) {
        require(validIpfsUrls[_ipfsUrl], "The provided IPFS URL is not valid");
        _;
    }

    function allowMinter(address _minter) public onlyOwner {
        allowedMinters[_minter] = true;
    }

    function revokeMinter(address _minter) public onlyOwner {
        allowedMinters[_minter] = false;
    }

    function addValidIpfsUrl(string memory _ipfsUrl) public onlyOwner {
        validIpfsUrls[_ipfsUrl] = true;
    }

    function removeValidIpfsUrl(string memory _ipfsUrl) public onlyOwner {
        validIpfsUrls[_ipfsUrl] = false;
    }

    function mint(string memory _ipfsUrl) public {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        tokenIdToUri[tokenId] = _ipfsUrl;
        _mint(msg.sender, tokenId, 1, "");
    }

    function uri(uint256 _tokenId) public view override returns (string memory) {
        return tokenIdToUri[_tokenId];
    }

    function name() public view virtual returns (string memory) {
        return 'Recykle NFT';
    }

    function symbol() public view virtual returns (string memory) {
        return 'RCK';
    }
}