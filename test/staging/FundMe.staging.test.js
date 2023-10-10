const {network,ethers,deployments,getNamedAccounts} =require("hardhat");
const {developmentChains} = require("../../helper-hardhat-config")
const {assert} = require("chai");

developmentChains.includes(network.name)?describe.skip:
describe("FundMe",async()=>{
    let fundMe;
    let sendEth = "100000000000000000"  //100 dollors
    let deployer;
    beforeEach(async()=>{

        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe",deployer);
    })

    it("allows user's to fund and withdraw",async()=>{
       const fundTxnResponse =  await fundMe.fund({value:sendEth});
       await fundTxnResponse.wait(1);

       const withDrawTxnResponse = await fundMe.withdraw();
       await withDrawTxnResponse.wait(1);

       const contractBalance = await ethers.provider.getBalance(fundMe.target);

       console.log("contract Balance: ", contractBalance)

       assert.equal(contractBalance.toString(),"0");

    })
})