const { task } = require("hardhat/config");

task("account-details","gives you all account details",async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(`  ${account.address}`);
    }
  }
);
