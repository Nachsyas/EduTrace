// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EIP-5192: Minimal Soulbound Tokens
 * @dev Interface for minimal soulbound tokens (non-transferable NFTs).
 * https://eips.ethereum.org/EIPS/eip-5192
 */
interface IERC5192 {
    /// @notice Emitted when a soulbound token is locked.
    /// @dev This event MUST be emitted when a token is locked.
    event Locked(uint256 tokenId);

    /// @notice Emitted when a soulbound token is unlocked.
    /// @dev This event MUST be emitted when a token is unlocked.
    event Unlocked(uint256 tokenId);

    /// @notice Returns the locking status of an Individual Token.
    /// @dev Throws if `tokenId` is not a valid NFT.
    /// @param tokenId The identifier for an NFT.
    function locked(uint256 tokenId) external view returns (bool);
}
