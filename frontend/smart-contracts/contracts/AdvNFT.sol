pragma solidity 0.8.13;
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "hardhat/console.sol";

contract AdvNFT is Context, ERC721Burnable, ERC721Pausable {
    using Counters for Counters.Counter;
    address public nftContractAddr;
    Counters.Counter private _tokenIdTracker;

    // MusicTokenId to AdvNftId
    mapping(uint256 => uint256) private _musicIdToAdvId;

    mapping(uint256 => AdvNft) private _advIdToAdv;

    function setNftContractAddr(address _nftContractAddr) external {
        require(
            nftContractAddr == address(0),
            "address is already initialized"
        );
        nftContractAddr = _nftContractAddr;
    }

    struct AdvNft {
        string metaDataHash;
        string assetHash;
        uint32 expirationDuration;
        uint256 expirationTime;
        address creator;
    }
    address public admin;
    address public marketplaceAddress;
    event AdvNFTCreated(
        string metaDataHash,
        string assetHash,
        uint256 tokenID,
        uint32 expirationDuration,
        uint256 musicNFTId
    );

    event AdvNFTHashUpdated(uint256 tokenId, string metaHash, string assetHash);

    using Strings for uint256;

    constructor(
        string memory name,
        string memory symbol,
        address _marketplaceAddress
    ) ERC721(name, symbol) {
        marketplaceAddress = _marketplaceAddress;
        admin = _msgSender();
    }

    modifier slotEmpty(uint256 musicTokenId) {
        require(
            IERC721(nftContractAddr).ownerOf(musicTokenId) == _msgSender(),
            "sender is not owner of the music"
        );
        _;
    }

    modifier onlyAdmin() {
        require(admin == _msgSender(), "sender is not admin");
        _;
    }

    modifier onlyOwner(uint256 tokenId) {
        require(
            ownerOf(tokenId) == _msgSender(),
            "sender is not owner of token"
        );
        _;
    }

    modifier onlyMusicNFTOwner(address owner, uint256 musicTokenId) {
        require(
            IERC721(nftContractAddr).ownerOf(musicTokenId) == owner,
            "sender is not owner of the music"
        );
        _;
    }

    modifier onlyNftAddrExist() {
        require(
            nftContractAddr != address(0),
            "please initialize nft contract address"
        );
        _;
    }

    // Only music NFT address can be sender
    modifier onlyMusicNFT() {
        require(
            _msgSender() == nftContractAddr,
            "sender is not Music NFT contract"
        );
        _;
    }

    function isExpired(uint256 musicTokenId) public view returns (bool) {
        uint256 advNftId = _musicIdToAdvId[musicTokenId];
        AdvNft memory advNft = _advIdToAdv[advNftId];
        // expiration duration is 0 only when the mapping is null since we don't allow duration 0
        bool isAdvNotExistYet = advNft.expirationDuration == 0;
        if (isAdvNotExistYet) {
            return true;
        }
        // expiration time is 0 when it is not transferred and therefore not used yet
        bool hasNotBeenInUse = advNft.expirationTime == 0;
        console.log(
            "isExpired: hasNotBeenInUse %s, tokenid %d",
            hasNotBeenInUse,
            advNftId
        );
        if (hasNotBeenInUse) {
            return false;
        }
        return block.timestamp > advNft.expirationTime;
    }

    modifier onlyExpired(uint256 musicTokenId) {
        require(isExpired(musicTokenId), "Adspace is not expired yet");
        _;
    }

    function createAdSpace(
        uint256 musicNFTId,
        string memory metadataHash,
        string memory assetHash,
        uint32 expirationDuration
    ) public returns (uint256) {
        return
            _createAdSpace(
                _msgSender(),
                musicNFTId,
                metadataHash,
                assetHash,
                expirationDuration
            );
    }

    function _musicNFTCreateAdSpace(
        address owner,
        uint256 musicNFTId,
        string memory metadataHash,
        string memory assetHash,
        uint32 expirationDuration
    ) public onlyMusicNFT returns (uint256) {
        return
            _createAdSpace(
                owner,
                musicNFTId,
                metadataHash,
                assetHash,
                expirationDuration
            );
    }

    function _createAdSpace(
        address owner,
        uint256 musicNFTId,
        string memory metadataHash,
        string memory assetHash,
        uint32 _expirationDuration
    )
        internal
        onlyMusicNFTOwner(owner, musicNFTId)
        onlyExpired(musicNFTId)
        onlyNftAddrExist
        returns (uint256)
    {
        require(
            _expirationDuration <= 2592000,
            "adspace for more than 30 days is not allowed"
        );

        require(
            _expirationDuration >= 259200,
            "adspace for less than 3 days is not allowed"
        );

        _tokenIdTracker.increment();
        uint256 currentTokenID = _tokenIdTracker.current();
        _safeMint(owner, currentTokenID);
        _musicIdToAdvId[musicNFTId] = currentTokenID;
        _advIdToAdv[currentTokenID].metaDataHash = metadataHash;
        _advIdToAdv[currentTokenID].assetHash = assetHash;
        _advIdToAdv[currentTokenID].creator = owner;
        _advIdToAdv[currentTokenID].expirationDuration = _expirationDuration;

        _setApprovalForAll(owner, marketplaceAddress, true);

        emit AdvNFTCreated(
            metadataHash,
            assetHash,
            currentTokenID,
            _expirationDuration,
            musicNFTId
        );
        return currentTokenID;
    }

    function getCurrentAdvAssetUri(uint256 musicNFTId)
        external
        view
        returns (string memory)
    {
        uint256 advNFTid = _musicIdToAdvId[musicNFTId];
        bool isExpiredRes = isExpired(musicNFTId);
        require(!isExpiredRes, "AdvNFT has expired");
        return tokenMetadataURI(advNFTid);
    }

    function tokenMetadataURI(uint256 tokenId)
        public
        view
        virtual
        returns (string memory)
    {
        require(_exists(tokenId), "Non-Existent NFT");
        string memory _metaDataHash = _advIdToAdv[tokenId].metaDataHash;
        bytes memory ipfsPrefixed = abi.encodePacked("ipfs://", _metaDataHash);
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
        string memory _assetHash = _advIdToAdv[tokenId].assetHash;
        bytes memory ipfsPrefixed = abi.encodePacked("ipfs://", _assetHash);
        return string(ipfsPrefixed);
    }

    function pause() public onlyAdmin {
        _pause();
    }

    function unpause() public onlyAdmin {
        _unpause();
    }

    function updateHash(
        uint256 tokenId,
        string memory _metaDataHash,
        string memory _dataHash
    ) external {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "sender is not approved nor owner of token"
        );
        _advIdToAdv[tokenId].metaDataHash = _metaDataHash;
        emit AdvNFTHashUpdated(tokenId, _metaDataHash, _dataHash);
    }

    //Some checks to avoid token being transfer to other marketplace where it is not possible to detect sale and therefore not possible to initilize expirationTime
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Pausable) {
        // If minted then go through normal flow and return
        if (from == address(0)) {
            super._beforeTokenTransfer(from, to, tokenId);
            return;
        }

        AdvNft memory advNft = _advIdToAdv[tokenId];

        // Expire the token if it is being burn
        if (to == address(0)) {
            if (advNft.expirationTime > block.timestamp) {
                // Set to 1 since 0 means it is not used (transferred) yet
                _advIdToAdv[tokenId].expirationTime = 1;
            }
            super._beforeTokenTransfer(from, to, tokenId);
            return;
        }

        // If the address is approved then it is possibly a marketplace therefore skip init code
        if (isApprovedForAll(from, to) || getApproved(tokenId) == to) {
            super._beforeTokenTransfer(from, to, tokenId);
            return;
        }

        // Set expiration time when it is trasnferred
        if (advNft.expirationTime == 0) {
            _advIdToAdv[tokenId].expirationTime =
                block.timestamp +
                advNft.expirationDuration;
        }

        super._beforeTokenTransfer(from, to, tokenId);
    }
}
