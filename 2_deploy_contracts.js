var SafeMathLib = artifacts.require("SafeMathLib");
var CrowdsaleToken = artifacts.require("CrowdsaleToken");
var MultiSigWallet = artifacts.require("MultiSigWallet")
var FlatPricing = artifacts.require("FlatPricing")
var AllocatedCrowdsale = artifacts.require("AllocatedCrowdsale")
var DefaultFinalizeAgent = artifacts.require("DefaultFinalizeAgent")

module.exports = function (deployer) {
    // in js, month start from 0, day start from 1.
    var start_ = new Date(2018, 7, 1, 0, 0).getTime() / 1000
    var end_ = new Date(2019, 7, 1, 0, 0).getTime() / 1000
    var minimumFundingGoal_ = 0
    var deploy_address = "0xA06b548d954Fa504e54BCCAD8f7F58361d8949E4"
    deployer.deploy(SafeMathLib);
    deployer.link(SafeMathLib, [CrowdsaleToken, FlatPricing, AllocatedCrowdsale]);
    deployer.deploy([
        [MultiSigWallet, [deploy_address], 1],
        [CrowdsaleToken, "BitHeroToken", "BTH", 10**9 * 10**18, 18, false],
        [FlatPricing, 10**16]
    ]).then(function () {
        return deployer.deploy(AllocatedCrowdsale, CrowdsaleToken.address, FlatPricing.address, MultiSigWallet.address, start_, end_, minimumFundingGoal_, deploy_address);
    }).then(function () {
        return deployer.deploy(DefaultFinalizeAgent, AllocatedCrowdsale.address, CrowdsaleToken.address);
    });
};
