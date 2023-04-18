// SPDX-License-Identifier: Mirage Shrine Vow

// This scroll grants you the power to wield this creation as you see fit.
// Be warned, the winds of fate may turn against those who misuse it.

pragma solidity ^0.8.19;

library Stringer {
    function bytes23ToString(bytes23 _x) internal pure returns (string memory) {
        unchecked {
            bytes memory bytesString = new bytes(23);
            uint charCount = 0;
            for (uint j = 0; j < 23; j++) {
                bytes1 currentChar = bytes1(_x << (8 * j));
                if (currentChar != 0) {
                    bytesString[charCount] = currentChar;
                    charCount++;
                } else {
                    break;
                }
            }
            bytes memory bytesStringTrimmed = new bytes(charCount);
            for (uint j = 0; j < charCount; j++) {
                bytesStringTrimmed[j] = bytesString[j];
            }
            return string(bytesStringTrimmed);
        }
    }
}