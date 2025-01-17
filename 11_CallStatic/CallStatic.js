// contract.callStatic.函数名(参数, {override})
import { ethers } from "ethers";

//准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// DAI的ABI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// DAI合约地址（主网）
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

// 创建DAI合约实例
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

const main = async () => {
    try {
    const address = await wallet.getAddress()
    // 1. 读取DAI合约的链上信息
    console.log("\n1. 读取测试钱包的DAI余额")
    const balanceDAI = await contractDAI.balanceOf(address)
    console.log(`DAI持仓: ${ethers.utils.formatEther(balanceDAI)}\n`)

    // 2. 用callStatic尝试调用transfer转账10000 DAI，msg.sender为V神，交易将成功
    console.log("\n2.  用callStatic尝试调用transfer转账1 DAI，msg.sender为V神地址")
    // 发起交易
    const tx = await contractDAI.callStatic.transfer("vitalik.eth", ethers.utils.parseEther("10000"), {from: "vitalik.eth"})
    console.log(`交易会成功吗？：`, tx)

    // 3. 用callStatic尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，交易将失败
    console.log("\n3.  用callStatic尝试调用transfer转账1 DAI，msg.sender为测试钱包地址")
    const tx2 = await contractDAI.callStatic.transfer("vitalik.eth", ethers.utils.parseEther("10000"), {from: address})
    console.log(`交易会成功吗？：`, tx2)

    } catch (e) {
        console.log(e);
      }
}

main()
