// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.js";
import "@openzeppelin/contracts/utils/Counters.js";

// Contrato ERC-721 para os NFTs de Especialistas
contract Specialist is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Construtor: Define o nome e o símbolo do seu NFT
    constructor() ERC721("Fumegator Specialist", "FUME") {}

    // Função para criar (mintar) um novo NFT. Apenas o dono do contrato pode chamar.
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
}
