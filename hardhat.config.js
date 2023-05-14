require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.18",
			},
			{
				version: "0.8.9",
			},
		],
	},
	networks: {
		hardhat: {
			blockGasLimit: 20000000,
		},
	},
	gasReporter: {
		enabled: false,
		currency: "USD",
	},
	mocha: {
		timeout: 200000000,
	},
};
