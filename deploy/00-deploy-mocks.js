const {network} = require("hardhat");

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async({getNamedAccounts,deployments})=>{

    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;


    if(chainId == 31337){
        log("Local Network detected ... Deploying Mocks....");
        await deploy("MockV3Aggregator",{
            contract:"MockV3Aggregator",
            from:deployer,
            log:true,
            args:[DECIMALS,INITIAL_PRICE]       //constructure me jayega
        })
        log("Mocks Deployed!")
        log("------------------------------------------------");
    }
}


//if you want to deploy only mocks then you can add tags

module.exports.tags =["all","mocks"];