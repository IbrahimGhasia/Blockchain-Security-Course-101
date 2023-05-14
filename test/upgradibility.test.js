const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Upgradable Proxy Pattern", function () {
	let deployer, user;

	beforeEach(async function () {
		[deployer, user] = await ethers.getSigners();

		const LogicV1 = await ethers.getContractFactory("LogicV1", deployer);
		this.logicV1 = await LogicV1.deploy();

		const LogicV2 = await ethers.getContractFactory("LogicV2", deployer);
		this.logicV2 = await LogicV2.deploy();

		const Proxy = await ethers.getContractFactory("Proxy", deployer);
		this.proxy = await Proxy.deploy(this.logicV1.address);

		this.proxyPattern = await ethers.getContractAt(
			"LogicV1",
			this.proxy.address
		);
		this.proxyPattern2 = await ethers.getContractAt(
			"LogicV2",
			this.proxy.address
		);
	});

	describe("Proxy", function () {
		it("Should return the address of LogicV1 when calling logicContract()", async function () {
			expect(await this.proxy.logicContract()).to.eq(
				this.logicV1.address
			);
		});

		it("Should revert if anyone other than owner tries to upgrade it", async function () {
			await expect(
				this.proxy.connect(user).upgrade(this.logicV2.address)
			).to.be.revertedWith("Access Restricted");
		});

		it("Should allow the owner to update the logic contract", async function () {
			await this.proxy.upgrade(this.logicV2.address);
			expect(await this.proxy.logicContract()).to.eq(
				this.logicV2.address
			);
		});

		it("Calling increaseX on logicV1 should add 1 to x's Proxy's state", async function () {
			await this.proxyPattern.connect(user).increaseX();
			expect(await this.proxy.x()).to.eq(1);
			expect(await this.logicV1.x()).to.eq(0);
		});

		it("Calling increaseX on logicV2 should add 2 to x's Proxy's state", async function () {
			await this.proxy.upgrade(this.logicV2.address);
			await this.proxyPattern2.connect(user).increaseX();
			expect(await this.proxy.x()).to.eq(2);
			expect(await this.logicV2.x()).to.eq(0);
		});

		it("Should set y", async function () {
			await this.proxy.upgrade(this.logicV2.address);
			await this.proxyPattern2.connect(user).setY(5);

			// expect(await this.proxy.owner()).to.eq(
			// 	"0x0000000000000000000000000000000000000005"
			// );

			const byte32Y = await ethers.provider.getStorageAt(
				this.proxy.address,
				3
			);
			const y = await ethers.BigNumber.from(byte32Y);
			expect(y).to.eq(5);
		});
	});
});
