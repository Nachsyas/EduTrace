// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {EduTraceSBT} from "../src/EduTraceSBT.sol";
import {IERC5192} from "../src/interfaces/IERC5192.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract EduTraceSBTTest is Test {
    EduTraceSBT public sbt;

    address public admin = address(0x1);
    address public teacher = address(0x2);
    address public student1 = address(0x3);
    address public student2 = address(0x4);
    address public attacker = address(0x5);

    string public sampleCid1 = "QmXoyp1eg2jotzWJaR24G1t75v847mJ675G8mG687v2G8z";
    string public sampleCid2 = "QmYwAPJzv5CZ1zXWJaR24G1t75v847mJ675G8mG687v2G8y";

    // Recreate custom errors for assertions
    error TokenIsSoulbound();
    error ERC721NonexistentToken(uint256 tokenId);

    event Locked(uint256 tokenId);
    event ReportCardMinted(address indexed student, uint256 indexed tokenId, string cid);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function setUp() public {
        vm.prank(admin);
        sbt = new EduTraceSBT("EduTrace Report Card", "ETSBT", admin);
    }

    /* =========================================================================
       1. Deployment & Roles Tests
       ========================================================================= */

    function test_DeploymentState() public {
        assertEq(sbt.name(), "EduTrace Report Card");
        assertEq(sbt.symbol(), "ETSBT");
        
        // Admin should have both DEFAULT_ADMIN_ROLE and GURU_ROLE
        assertTrue(sbt.hasRole(sbt.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(sbt.hasRole(sbt.GURU_ROLE(), admin));
    }

    function test_ConstructorRevertsWithZeroAdmin() public {
        vm.expectRevert("Admin address cannot be zero");
        new EduTraceSBT("Name", "SYM", address(0));
    }

    function test_RoleManagement() public {
        bytes32 guruRole = sbt.GURU_ROLE();

        // Admin grants GURU_ROLE to teacher
        vm.prank(admin);
        sbt.grantRole(guruRole, teacher);
        assertTrue(sbt.hasRole(guruRole, teacher));

        // Teacher mints successfully
        vm.prank(teacher);
        uint256 tokenId = sbt.mintReportCard(student1, sampleCid1);
        assertEq(sbt.ownerOf(tokenId), student1);

        // Admin revokes GURU_ROLE from teacher
        vm.prank(admin);
        sbt.revokeRole(guruRole, teacher);
        assertFalse(sbt.hasRole(guruRole, teacher));

        // Teacher cannot mint anymore
        vm.prank(teacher);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                teacher,
                guruRole
            )
        );
        sbt.mintReportCard(student1, sampleCid1);
    }

    /* =========================================================================
       2. Minting Functionality Tests
       ========================================================================= */

    function test_MintReportCard_Success() public {
        vm.prank(admin);
        
        // Asserting the exact event emissions (Locked, Transfer, ReportCardMinted)
        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), student1, 1);
        
        vm.expectEmit(true, true, true, true);
        emit Locked(1);
        
        vm.expectEmit(true, true, true, true);
        emit ReportCardMinted(student1, 1, sampleCid1);

        uint256 tokenId = sbt.mintReportCard(student1, sampleCid1);
        
        assertEq(tokenId, 1);
        assertEq(sbt.ownerOf(tokenId), student1);
        assertEq(sbt.tokenURI(tokenId), string(abi.encodePacked("ipfs://", sampleCid1)));
        assertTrue(sbt.locked(tokenId));
    }

    function test_MintReportCard_IncrementalIds() public {
        vm.startPrank(admin);
        uint256 firstToken = sbt.mintReportCard(student1, sampleCid1);
        uint256 secondToken = sbt.mintReportCard(student2, sampleCid2);
        vm.stopPrank();

        assertEq(firstToken, 1);
        assertEq(secondToken, 2);
        assertEq(sbt.ownerOf(1), student1);
        assertEq(sbt.ownerOf(2), student2);
    }

    function test_MintReportCard_RevertsIfZeroStudent() public {
        vm.prank(admin);
        vm.expectRevert("Student address cannot be zero");
        sbt.mintReportCard(address(0), sampleCid1);
    }

    function test_MintReportCard_RevertsIfCidEmpty() public {
        vm.prank(admin);
        vm.expectRevert("CID cannot be empty");
        sbt.mintReportCard(student1, "");
    }

    function test_MintReportCard_RevertsIfUnauthorized() public {
        bytes32 guruRole = sbt.GURU_ROLE();
        vm.prank(attacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                attacker,
                guruRole
            )
        );
        sbt.mintReportCard(student1, sampleCid1);
    }

    /* =========================================================================
       3. EIP-5192 & Soulbound Lock Tests
       ========================================================================= */

    function test_Locked_ReturnsTrueForValidToken() public {
        vm.prank(admin);
        uint256 tokenId = sbt.mintReportCard(student1, sampleCid1);
        assertTrue(sbt.locked(tokenId));
    }

    function test_Locked_RevertsForNonexistentToken() public {
        vm.expectRevert(
            abi.encodeWithSelector(ERC721NonexistentToken.selector, 999)
        );
        sbt.locked(999);
    }

    function test_TokenURI_RevertsForNonexistentToken() public {
        vm.expectRevert(
            abi.encodeWithSelector(ERC721NonexistentToken.selector, 999)
        );
        sbt.tokenURI(999);
    }

    function test_TransfersAreBlocked() public {
        vm.prank(admin);
        uint256 tokenId = sbt.mintReportCard(student1, sampleCid1);

        // Try transfer from student1 to student2 (initiated by student1)
        vm.prank(student1);
        vm.expectRevert(abi.encodeWithSelector(TokenIsSoulbound.selector));
        sbt.transferFrom(student1, student2, tokenId);

        // Try safeTransferFrom (initiated by student1)
        vm.prank(student1);
        vm.expectRevert(abi.encodeWithSelector(TokenIsSoulbound.selector));
        sbt.safeTransferFrom(student1, student2, tokenId);

        // Try safeTransferFrom with bytes (initiated by student1)
        vm.prank(student1);
        vm.expectRevert(abi.encodeWithSelector(TokenIsSoulbound.selector));
        sbt.safeTransferFrom(student1, student2, tokenId, "");
    }

    function test_TransferBlockedEvenIfApproved() public {
        vm.prank(admin);
        uint256 tokenId = sbt.mintReportCard(student1, sampleCid1);

        // Student approves admin/attacker (approving does not revert in base ERC721, but transfer must revert)
        vm.prank(student1);
        sbt.approve(attacker, tokenId);

        vm.prank(attacker);
        vm.expectRevert(abi.encodeWithSelector(TokenIsSoulbound.selector));
        sbt.transferFrom(student1, student2, tokenId);
    }

    /* =========================================================================
       4. Interface & Support Verification
       ========================================================================= */

    function test_SupportsInterface() public {
        // EIP-5192 interface ID: 0xb45a3c0e
        assertTrue(sbt.supportsInterface(0xb45a3c0e));
        
        // ERC721 interface ID: 0x80ac58cd
        assertTrue(sbt.supportsInterface(0x80ac58cd));

        // AccessControl interface ID: 0x7965db0b
        assertTrue(sbt.supportsInterface(0x7965db0b));

        // Random check
        assertFalse(sbt.supportsInterface(0xffffffff));
    }
}
