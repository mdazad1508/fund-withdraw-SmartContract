const {getNamedAccounts,ethers} = require("hardhat");

const main =async()=>{

    const  {deployer} = getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe",deployer);


    console.log("withdrawing...")
    const transcationResponse  = await fundMe.withdraw();
    await transcationResponse.wait(1);

    console.log("withdrawn...")


}


main().then(()=>{
    process.exit(0);
}).catch((err)=>{
    console.log(err);
    process.exit(1);
})