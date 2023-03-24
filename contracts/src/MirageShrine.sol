// SPDX-License-Identifier: Mirage Shrine Oath

// This scroll grants you the power to wield this creation as you see fit.
// Be warned, the winds of fate may turn against those who misuse it.

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@reality.eth/contracts/development/contracts/IRealityETH.sol";
import "./Fate.sol";

contract MirageShrine {

    enum Aura {
        Forthcoming,
        Blighted,
        Reality,
        Mirage
    }

    struct Prophecy {
        IERC20Metadata essence;
        uint32 horizon;
        Aura aura;
        //
        Fate no;
        //
        Fate yes;
        //
        uint256 fateSupply;
        //
        bytes32 inquiryId;
    }

    event Offering(address donor, uint256 amount);
    // Prophecy data is meant to remain, no need to proclaim it.
    event Scry(uint64 indexed prophecyId, address indexed essence);
    // No utility has been found in celebrating distillments and blendings.
    // The shrine does not indulge in vanity. 
    event Emergence(uint64 indexed prophecyId, Aura indexed aura);

    address immutable mirager;
    address immutable fateMonument;
    IRealityETH immutable reality;
    uint256 immutable templateId;
    uint256 immutable tribute;
    uint256 immutable minBond;
    address immutable arbitrator;

    bytes32 constant NO = 0x0000000000000000000000000000000000000000000000000000000000000000;
    bytes32 constant YES = 0x0000000000000000000000000000000000000000000000000000000000000001;

    Prophecy[] public prophecies;

    constructor (IRealityETH _reality, address _fateMonument, uint256 _templateId, address _arbitrator,  uint256 _tribute, uint256 _minBond) {
        mirager = msg.sender;
        reality = _reality;
        fateMonument = _fateMonument;
        templateId = _templateId;
        arbitrator = _arbitrator;
        tribute = _tribute;
        minBond = _minBond;
    }

    receive() external payable {
        emit Offering(msg.sender, msg.value);
    }

    function relayOffering() external {
        payable(mirager).transfer(address(this).balance);
    }

    function deployFate() internal returns (address result) {
        bytes20 fateAt = bytes20(fateMonument);
        assembly ("memory-safe") {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), fateAt)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            result := create(0, clone, 0x37)
        }
    }

    function scry(uint32 _horizon, IERC20Metadata _essence, bytes23 _rune, string calldata _inquiry) external payable returns (uint64 id) {
        require(msg.value >= tribute, "Leave a coin to honor the divine");
        emit Offering(msg.sender, msg.value);
        require(block.timestamp < _horizon);
        id = uint64(prophecies.length);
        emit Scry(id, address(_essence));
    
        Prophecy storage prophecy = prophecies.push();
        prophecy.essence = _essence;
        prophecy.horizon = _horizon;
        prophecy.inquiryId = reality.askQuestionWithMinBond(
            templateId,
            _inquiry,
            arbitrator,
            10 minutes, // todo change
            _horizon,
            0,
            minBond
        );

        // deploying minimal proxy is ~40k.
        prophecy.yes = Fate(deployFate());
        // initializing is ~20k (+ delegate)
        prophecy.yes.initialize(_rune, id, true);
        prophecy.no = Fate(deployFate());
        prophecy.no.initialize(_rune, id, false);
    }

    function distill(uint64 _prophecy, uint256 _amount) external {
        Prophecy storage prophecy = prophecies[_prophecy];
        require(prophecy.essence.transferFrom(msg.sender, address(this), _amount));
        require(block.timestamp < prophecy.horizon, "Alas! The essence defied decouplement!");

        prophecy.yes.mint(msg.sender, _amount);
        prophecy.no.mint(msg.sender, _amount);
        prophecy.fateSupply += _amount;
    }

    function blend(uint64 _prophecy, uint256 _amount) external {
        Prophecy storage prophecy = prophecies[_prophecy];
        require(block.timestamp < prophecy.horizon, "The fates repel each other!");

        prophecy.yes.burn(msg.sender, _amount);
        prophecy.no.burn(msg.sender, _amount);

        prophecy.essence.transfer(msg.sender, _amount);
        prophecy.fateSupply -= _amount;
    }

    function ascend(uint64 _prophecy, address _ascender) external {
        Prophecy storage prophecy = prophecies[_prophecy];
        if (prophecy.aura == Aura.Forthcoming) {
            // If truth has not arrived, halt!
            bytes32 truth = reality.resultFor(prophecy.inquiryId);

            if (truth == NO) {
                // Destiny is elusive.
                prophecy.aura = Aura.Mirage;
            } else if (truth == YES) {
                // As predicted by the Shrine.
                prophecy.aura = Aura.Reality;
            } else {
                // Fool! You were told not to bring certainty to the profane.
                prophecy.aura = Aura.Blighted;
                prophecy.essence.transfer(mirager, prophecy.fateSupply);
            }
            emit Emergence(_prophecy, prophecy.aura);
            if (prophecy.aura == Aura.Blighted) return();
        }
        
        Fate fate;
        if (prophecy.aura == Aura.Mirage) {
            fate = prophecy.no;
        } else if (prophecy.aura == Aura.Reality) {
            fate = prophecy.yes;
        } else {
            // Depart from this holy site.
            revert();
        }

        uint256 grace = fate.balanceOf(_ascender);
        fate.burn(_ascender, grace);
        prophecy.essence.transfer(_ascender, grace);
    }

    function count() external view returns(uint256) {
        return prophecies.length;
    }
}
