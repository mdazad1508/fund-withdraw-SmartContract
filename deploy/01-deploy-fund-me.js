
/* module.exports = async(hre)=>{
    const {getNamedAccounts,deployments} = hre;
} */

const {networkConfig,developmentChains} = require("../helper-hardhat-config")
const {network} = require("hardhat");
const {verify} = require("../utils/verfiy");
require("dotenv").config();

module.exports = async({getNamedAccounts,deployments})=>{
    
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;

    if(developmentChains.includes(network.name)){
        //deployments.get gives you the information of latest deployment
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }

    log("----------------------------------------------------")
    log(`Deploying FundMe on  ----- ${network.name.toUpperCase()}. ----- and waiting for confirmations...  `)

    const fundMe = await deploy("FundMe",{
        contract:"FundMe",
        from:deployer,
        log:true,
        args:[ethUsdPriceFeedAddress],
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`FundMe deployed at ${fundMe.address}`)
     

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY ){
        await verify(fundMe.address,[ethUsdPriceFeedAddress]);
    }
     

}

module.exports.tags =["all","FundMe"];