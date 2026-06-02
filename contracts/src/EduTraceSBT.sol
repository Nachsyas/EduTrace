// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC5192} from "./interfaces/IERC5192.sol";

/**
 * @title EduTraceSBT
 * @notice Soulbound Token (SBT) for Student Report Cards conforming to EIP-5192.
 * @dev Report card records are immutably tied to the student's address and cannot be transferred.
 */
contract EduTraceSBT is ERC721, AccessControl, IERC5192 {
    // Roles definition
    bytes32 public constant GURU_ROLE = keccak256("GURU_ROLE");

    // Token ID tracker
    uint256 private _nextTokenId;

    // IPFS CID mapping (tokenId => IPFS CID)
    mapping(uint256 => string) private _cids;

    // Custom errors
    error TokenIsSoulbound();

    // Custom events
    event ReportCardMinted(address indexed student, uint256 indexed tokenId, string cid);

    /**
     * @notice Constructor to initialize the SBT collection.
     * @param name The collection name.
     * @param symbol The collection symbol.
     * @param admin The address that will hold default admin and guru roles.
     */
    constructor(
        string memory name,
        string memory symbol,
        address admin
    ) ERC721(name, symbol) {
        require(admin != address(0), "Admin address cannot be zero");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GURU_ROLE, admin);
        _nextTokenId = 1; // Start token ID numbering at 1
    }

    /**
     * @notice Mints a new Soulbound Report Card NFT.
     * @dev Only accounts with GURU_ROLE can call this function.
     * @param student The address of the student receiving the report card.
     * @param cid The IPFS CID containing the encrypted/detailed student report data.
     * @return The minted token ID.
     */
    function mintReportCard(
        address student,
        string calldata cid
    ) external onlyRole(GURU_ROLE) returns (uint256) {
        require(student != address(0), "Student address cannot be zero");
        require(bytes(cid).length > 0, "CID cannot be empty");

        uint256 tokenId = _nextTokenId++;
        
        // Mint the token using OpenZeppelin's standard ERC721 safe mint
        _safeMint(student, tokenId);
        
        // Store CID metadata
        _cids[tokenId] = cid;

        // Emit EIP-5192 Locked event
        emit Locked(tokenId);
        
        // Emit EduTrace specific mint event
        emit ReportCardMinted(student, tokenId, cid);

        return tokenId;
    }

    /**
     * @notice Returns the locking status of an Individual Token.
     * @dev Implements EIP-5192 standard. Returns true for all valid tokens.
     * @param tokenId The identifier for an NFT.
     * @return True since all tokens are permanently locked.
     */
    function locked(uint256 tokenId) external view override returns (bool) {
        if (_ownerOf(tokenId) == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        }
        return true;
    }

    /**
     * @notice Returns the IPFS token URI associated with the token metadata.
     * @param tokenId The identifier for an NFT.
     * @return The complete ipfs:// protocol URI.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked("ipfs://", _cids[tokenId]));
    }

    /**
     * @notice ERC165 Interface checking.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return
            interfaceId == type(IERC5192).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Hook that restricts any token transfers, maintaining the soulbound property.
     * Overrides OpenZeppelin's single internal update function (OZ v5.0 standard).
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);
        
        // Block transfers (when it's not a mint [previousOwner == 0] and not a burn [to == 0])
        if (previousOwner != address(0) && to != address(0)) {
            revert TokenIsSoulbound();
        }
        
        return previousOwner;
    }
}
