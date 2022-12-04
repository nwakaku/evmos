pragma solidity 0.8.13;
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "./AdvNFT.sol";
import "hardhat/console.sol";

//TODO remove approve
// TODO: add token uri func and append ipfs://
contract MusicNFT is Context, ERC721Pausable {
    using Counters for Counters.Counter;

    address public advNFTAddr;
    string public baseURI = "ipfs://";

    Counters.Counter private _tokenIdTracker;

    // Optional mapping for token URIs
    mapping(uint256 => TokenHashs) private _tokenHashes;

    struct TokenHashs {
        string metaDataHash;
        string assetHash;
    }

    address public admin;
    event MusicNFTCreated(
        uint256 tokenID,
        address indexed creator,
        string metaDataHash,
        string assetHash
    );

    using Strings for uint256;

    constructor(
        string memory name,
        string memory symbol,
        address _advNFTAddr
    ) ERC721(name, symbol) {
        advNFTAddr = _advNFTAddr;
        admin = _msgSender();
    }

    modifier onlyAdmin() {
        require(admin == _msgSender(), "sender is not admin");
        _;
    }

    function createMusic(string memory metadataHash, string memory assetHash)
        public
        returns (uint256)
    {
        _tokenIdTracker.increment();
        uint256 currentTokenID = _tokenIdTracker.current();
        _safeMint(_msgSender(), currentTokenID);
        _setTokenHash(currentTokenID, metadataHash, assetHash);

        emit MusicNFTCreated(
            currentTokenID,
            _msgSender(),
            metadataHash,
            assetHash
        );
        return currentTokenID;
    }

    function createMusicWithAdv(
        string memory musicMetadataHash,
        string memory musicAssetHash,
        string memory advMetadataHash,
        string memory advAssetHash,
        uint32 advExpirationDuration
    ) public returns (uint256) {
        AdvNFT advNFt = AdvNFT(advNFTAddr);
        uint256 tokenId = createMusic(musicMetadataHash, musicAssetHash);
        advNFt._musicNFTCreateAdSpace(
            _msgSender(),
            tokenId,
            advMetadataHash,
            advAssetHash,
            advExpirationDuration
        );

        return tokenId;
    }

    function tokenMetadataURI(uint256 tokenId)
        public
        view
        virtual
        returns (string memory)
    {
        require(_exists(tokenId), "Non-Existent NFT");
        string memory _tokenHash = _tokenHashes[tokenId].metaDataHash;
        bytes memory ipfsPrefixed = abi.encodePacked("ipfs://", _tokenHash);
        return string(ipfsPrefixed);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Non-Existent NFT");
        string memory _assetHash = _tokenHashes[tokenId].assetHash;
        bytes memory ipfsPrefixed = abi.encodePacked("ipfs://", _assetHash);
        return string(ipfsPrefixed);
    }

    function _setTokenHash(
        uint256 tokenId,
        string memory _metaDataHash,
        string memory _assetHash
    ) internal virtual {
        require(_exists(tokenId), "Non-Existent NFT");
        _tokenHashes[tokenId].metaDataHash = _metaDataHash;
        _tokenHashes[tokenId].assetHash = _assetHash;
    }

    function pause() public onlyAdmin {
        _pause();
    }

    function unpause() public onlyAdmin {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        if (from == address(0)) {
            super._beforeTokenTransfer(from, to, tokenId);
            return;
        }
        AdvNFT advNft = AdvNFT(advNFTAddr);
        bool isExpired = advNft.isExpired(tokenId);
        require(
            isExpired,
            "associated AdvNFT should be expired before the music can be transferred"
        );

        super._beforeTokenTransfer(from, to, tokenId);
    }
}
