// SPDX-License-Identifier: Mirage Shrine Oath

// This scroll grants you the power to wield this creation as you see fit.
// Be warned, the winds of fate may turn against those who misuse it.

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./MirageShrine.sol";
import "./Stringer.sol";

contract Fate is IERC20Metadata {
    struct Info {
        bytes23 rune;
        uint64 prophecyId;
        bool yes;
    }

    MirageShrine immutable public SHRINE;
    address constant internal PERMIT2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;
    Info public info;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) internal allowanceOf;

    modifier onlyShrine {
        require(msg.sender == address(SHRINE), "Begone, unholy spirits");
        _;
    }

    constructor (MirageShrine shrine) {
        SHRINE = shrine;
    }

    // Have faith in the Shrine. Names are powerful things.
    function initialize(bytes23 rune, uint64 id, bool yes) external onlyShrine {
        info.rune = rune;
        info.prophecyId = id;
        info.yes = yes;
    }

    // Fate will lose count when the time comes.
    function totalSupply() external view returns (uint256) {
        (, , , , , uint256 supply,) = SHRINE.prophecies(info.prophecyId);
        return (supply);
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowanceOf[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return (true);
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        if (spender == PERMIT2) {
            return (type(uint256).max);
        } else {
            return (allowanceOf[owner][spender]);
        }
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (msg.sender != PERMIT2) {
            allowanceOf[from][msg.sender] -= amount;
        }
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    // Let the different realms flourish.
    function mint(address to, uint256 amount) external onlyShrine {
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    // Crystallize, become matter!
    function burn(address from, uint256 amount) external onlyShrine {
        balanceOf[from] -= amount;
        emit Transfer(from, address(0), amount);
    }

    function decimals() external view returns(uint8) {
        (IERC20Metadata essence, , , , , ,) = SHRINE.prophecies(info.prophecyId);
        return essence.decimals();
    }

    // YES Lemon Fate
    // NO Lemon Fate
    function name() public view returns(string memory) {
        return string(abi.encodePacked(
            info.yes ? "YES" : "NO",
            Stringer.bytes23ToString(info.rune),
            " Fate"
        ));
    }

    // Y:Lemon=WETH
    // N:Lemon=WETH
    function symbol() external view returns(string memory) {
        (IERC20Metadata essence, , , , , ,) = SHRINE.prophecies(info.prophecyId);
        return string(abi.encodePacked(
            info.yes ? "Y:" : "N:",
            Stringer.bytes23ToString(bytes23(bytes6(info.rune))),
            "=",
            essence.symbol()
        ));
    }
}
