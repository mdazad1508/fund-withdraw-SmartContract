const {ethers,getNamedAccounts} = require("hardhat");

const main =async()=>{

const {deployer } = await getNamedAccounts();
const fundMe = await ethers.getContract("FundMe",deployer);

console.log("funding....contract");
const transactionResponse = await fundMe.fund({value:ethers.parseEther("0.1")})
await transactionResponse.wait(1);

console.log("funded!!!!!!!!!!!!!!!!!!!!!");

}


main(()=>{
  process.exit(0);
}).catch((e)=>{
  console.error(e);
  process.exit(1);
})