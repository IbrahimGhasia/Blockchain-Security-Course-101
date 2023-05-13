const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DoS", function () {
	let deployer, attacker, user;
	beforeEach(async function () {
		[deployer, attacker, user] = await ethers.getSigners();
		const AuctionV2 = await ethers.getContractFactory(
			"AuctionV2",
			deployer
		);
		this.auctionV2 = await AuctionV2.deploy();

		this.auctionV2.bid({ value: 100 });
	});

	describe.skip("Auction", function () {
		describe("If bid is lower than highestBid", function () {
			it("should not accept bids lower than current", async function () {
				await expect(
					this.auction.connect(user).bid({ value: 50 })
				).to.be.revertedWith("Bid not high enough");
			});
		});

		describe("If bid is higher than highestBit", function () {
			it("should accept it and update the highestBid", async function () {
				await this.auction.connect(user).bid({ value: 150 });
				expect(await this.auction.highestBid()).to.eq(150);
			});

			it("should make msg.sender the current leader", async function () {
				await this.auction.connect(user).bid({ value: 150 });
				expect(await this.auction.currentLeader()).to.eq(user.address);
			});

			it("should add previous leader and highestBid to the refunds", async function () {
				await this.auction.connect(user).bid({ value: 150 });
				[addr, amount] = await this.auction.refunds(0);
				expect(addr).to.eq(deployer.address);
				expect(amount).to.eq(100);
			});
		});

		describe("When calling refundAll function", function () {
			it("Should refunds the bidder that didn't win", async function () {
				await this.auction.connect(user).bid({ value: 150 });
				await this.auction.bid({ value: 200 });

				const UserBalanceBefore = await ethers.provider.getBalance(
					user.address
				);
				await this.auction.refundAll();
				const UserBalanceAfter = await ethers.provider.getBalance(
					user.address
				);
				expect(UserBalanceAfter).to.eq(UserBalanceBefore.add(150));
			});

			it("should revert if the amount of computation hits the block gas limit", async function () {
				for (let i = 0; i < 1500; i++) {
					await this.auction
						.connect(attacker)
						.bid({ value: 150 + i });
				}
				await this.auction.refundAll();
			});
		});
	});

	describe("AuctionV2", function () {
		describe("Pull over push solution", function () {
			it("A user should be able to refunded for a small number of bids", async function () {
				await this.auctionV2
					.connect(user)
					.bid({ value: ethers.utils.parseEther("1") });

				await this.auctionV2.bid({
					value: ethers.utils.parseEther("2"),
				});

				const UserBalanceBefore = await ethers.provider.getBalance(
					user.address
				);

				await this.auctionV2.connect(user).withdrawRefund();

				const UserBalanceAfter = await ethers.provider.getBalance(
					user.address
				);

				expect(UserBalanceAfter).to.be.gt(UserBalanceBefore);
			});

			it("A user should be able to refunded for a large number of bids", async function () {
				for (let i = 0; i < 1500; i++) {
					await this.auctionV2
						.connect(user)
						.bid({ value: ethers.utils.parseEther("0.0001") + i });
				}

				const UserBalanceBefore = await ethers.provider.getBalance(
					user.address
				);

				await this.auctionV2.connect(user).withdrawRefund();

				const UserBalanceAfter = await ethers.provider.getBalance(
					user.address
				);

				expect(UserBalanceAfter).to.be.gt(UserBalanceBefore);
			});
		});
	});
});
