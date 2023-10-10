const {deployments,getNamedAccounts,ethers}=require("hardhat");
const {assert,expect} = require("chai");
const { TransactionResponse } = require("ethers");
const {developmentChains} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)?describe.skip:
describe("FundMe",async()=>{
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendEth = "1000000000000000000";
    beforeEach(async()=>{
        //deploy our contracts ..
        
        //const accounts = ethers.getSigner(); //it will give you list of all the accounts of your network
        // accountZero = accounts[0]; //same as deployer , as defualt is 0 in hardhat config
        //const {deployer} =await getNamedAccounts();
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);    //this allows to deploy all the contracts in deploy folder having tag all
        fundMe = await ethers.getContract("FundMe",deployer);    //this gives the  most recently deployed FundME CONTRACT , and deployer is connect to this contract and whatever transaction we do , we will do with this account , to use diffrent account you got to connect it with diffrent account 
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer);
        
    });

    describe("Constructor",async()=>{
        it("sets aggregator address corrrectly",async()=>{
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.target);
        })
    })
     
   
    describe("fund",async()=>{
        it("Fails if you don't send enought ETH ", async()=>{
            await   expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
            //we are expecting a failure.. i'm not sending any eth..
        })
 
        it("Updates the amount funded data structures",async()=>{
            await fundMe.fund({value:sendEth});
            const amountFunded  = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(sendEth.toString(),amountFunded.toString());
        })

        it("add  funder to the s_getFunder array",async()=>{
            await fundMe.fund({value:sendEth});
            const funder = await fundMe.getFunder(0);
            assert.equal(deployer,funder);
        })
 

    })

    describe("withdraw",async()=>{
        
        beforeEach(async()=>{
           await fundMe.fund({value:sendEth});
        })

        it("allow us to withdraw with single Funder",async()=>{   
          //Arrange
           const fundMeStartingBalance = await ethers.provider.getBalance(fundMe.target);
           const deployerStartingBalance = await ethers.provider.getBalance(deployer);
           //console.log(fundMe.target,deployer);
          
           //act
           const transaction = await fundMe.withdraw();
           const transactionResponse = await transaction.wait(1);
           const {gasPrice,gasUsed} = transactionResponse;
          // console.log(typeof(gasUsed)," :",gasUsed," " ,typeof(gasPrice)," :",gasPrice);
          // in eth v6 no need to use .mul .div etc
           const gasCost = gasUsed*gasPrice;
 
           const fundMeEndingBalance = await ethers.provider.getBalance(fundMe.target);
           const deployerEndingBalance = await ethers.provider.getBalance(deployer);

           //assert
           assert.equal(fundMeEndingBalance,0);
           assert.equal((fundMeStartingBalance + deployerStartingBalance).toString(),(deployerEndingBalance + gasCost).toString());
          })

          it("cheaper withdraw with single Funder",async()=>{   
            //Arrange
             const fundMeStartingBalance = await ethers.provider.getBalance(fundMe.target);
             const deployerStartingBalance = await ethers.provider.getBalance(deployer);
             //console.log(fundMe.target,deployer);
            
             //act
             const transaction = await fundMe.cheaperWithdraw();
             const transactionResponse = await transaction.wait(1);
             const {gasPrice,gasUsed} = transactionResponse;
            // console.log(typeof(gasUsed)," :",gasUsed," " ,typeof(gasPrice)," :",gasPrice);
            // in eth v6 no need to use .mul .div etc
             const gasCost = gasUsed*gasPrice;
   
             const fundMeEndingBalance = await ethers.provider.getBalance(fundMe.target);
             const deployerEndingBalance = await ethers.provider.getBalance(deployer);
  
             //assert
             assert.equal(fundMeEndingBalance,0);
             assert.equal((fundMeStartingBalance + deployerStartingBalance).toString(),(deployerEndingBalance + gasCost).toString());
            })

          it("allows us withdraw with multiple funder",async()=>{
              const accounts = await ethers.getSigners();
              //accounts[0] = deployer or owner of contract

              for(let i=1;i<6;i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({value:sendEth});
              }

              //note but fundMe is still connected to deployer, 
              const fundMeStartingBalance = await ethers.provider.getBalance(fundMe.target);
              const deployerStartingBalance = await ethers.provider.getBalance(deployer);

              const transaction = await fundMe.withdraw();
              const transactionResponse = await transaction.wait(1);
              const {gasPrice,gasUsed} = transactionResponse;


            const gasCost = gasUsed*gasPrice;
 
           const fundMeEndingBalance = await ethers.provider.getBalance(fundMe.target);
           const deployerEndingBalance = await ethers.provider.getBalance(deployer);

           //assert
           assert.equal(fundMeEndingBalance,0);
           assert.equal((fundMeStartingBalance + deployerStartingBalance).toString(),(deployerEndingBalance + gasCost).toString());

           //also check that the getFunder is empty and should return error

          await  expect(fundMe.getFunder(0)).to.be.reverted;

          // check getAddressToAmountFunded have 0 for all the addresses

             for(let i=1;i<6;i++){
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0);
            }
        })

        it("cheaper  withdraw with multiple funder",async()=>{
            const accounts = await ethers.getSigners();
            //accounts[0] = deployer or owner of contract

            for(let i=1;i<6;i++){
              const fundMeConnectedContract = await fundMe.connect(accounts[i]);
              await fundMeConnectedContract.fund({value:sendEth});
            }

            //note but fundMe is still connected to deployer, 
            const fundMeStartingBalance = await ethers.provider.getBalance(fundMe.target);
            const deployerStartingBalance = await ethers.provider.getBalance(deployer);

            const transaction = await fundMe.cheaperWithdraw();
            const transactionResponse = await transaction.wait(1);
            const {gasPrice,gasUsed} = transactionResponse;


          const gasCost = gasUsed*gasPrice;

         const fundMeEndingBalance = await ethers.provider.getBalance(fundMe.target);
         const deployerEndingBalance = await ethers.provider.getBalance(deployer);

         //assert
         assert.equal(fundMeEndingBalance,0);
         assert.equal((fundMeStartingBalance + deployerStartingBalance).toString(),(deployerEndingBalance + gasCost).toString());

         //also check that the getFunder is empty and should return error

        await  expect(fundMe.getFunder(0)).to.be.reverted;

        // check getAddressToAmountFunded have 0 for all the addresses

           for(let i=1;i<6;i++){
              assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0);
          }
      })
        
        it("only allows owner to withdraw",async()=>{
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        })
    })
})