// Import the ethers library
const { ethers } = require("hardhat");
const { TokenboundClient } = require("@tokenbound/sdk");
const provider = new ethers.AlchemyProvider("goerli", process.env.ALCHEMY_KEY)
const operatorAbi = require("../artifacts/contracts/Operator.sol/Operator.json")


async function Operator() {

  // Get the signers from ethers
  let owner;
  [owner] = await ethers.getSigners();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  console.log(`SERVER_WALLET_PRIVATE_KEY=${process.env.PRIVATE_KEY}`)
  console.log(`SERVER_WALLET_ADDRESS=${wallet.address}`)
  const tokenboundClient = new TokenboundClient({ signer: wallet, chainId: 5 })

  // Deploy NPC contract
  const NPCContract = await ethers.getContractFactory("CosmicCowboys");
  const npcContract = await NPCContract.deploy(owner.address);
  const npcContractAddress = await npcContract.getAddress()
  console.log(`NPC_CONTRACT_ADDRESS=${npcContractAddress}`);

  // Deploy ERC-20 Contract
  const CurrencyContract = await ethers.getContractFactory("GoldenCorn");
  const currencyContract = await CurrencyContract.deploy(owner.address);
  const currencyContractAddress = await currencyContract.getAddress()
  console.log(`CURRENCY_CONTRACT_ADDRESS=${currencyContractAddress}`)

  // Deploy 1155 Contracts
  const FoodContract = await ethers.getContractFactory("SpaceSlop");
  const foodContract = await FoodContract.deploy(owner.address);
  const foodContractAddress = await foodContract.getAddress()
  console.log(`FOOD_CONTRACT_ADDRESS=${foodContractAddress}`);

  const SupplyContract = await ethers.getContractFactory("JupiterJunk");
  const supplyContract = await SupplyContract.deploy(owner.address);
  const supplyContractAddress = await supplyContract.getAddress()
  console.log(`SUPPLY_CONTRACT_ADDRESS=${supplyContractAddress}`);

  // Deploy ERC6551
  /* const RegistryContract = await ethers.getContractFactory("ERC6551Registry");
  const registryContract = await RegistryContract.deploy();
  const registryContractAddress = await registryContract.getAddress()
  console.log("Registry Contract deployed to address:", registryContractAddress);

  const AccountContract = await ethers.getContractFactory("ERC6551Account");
  const accountContract = await AccountContract.deploy();
  const accountContractAddress = await accountContract.getAddress()
  console.log("Account Contract deployed to address:", accountContractAddress); */

  // Deploy Operator Contract
  const OperatorContract = await ethers.getContractFactory("Operator");
  const operatorContract = await OperatorContract.deploy(owner.address, npcContractAddress, currencyContractAddress, foodContractAddress, supplyContractAddress)
  const operatorContractAddress = await operatorContract.getAddress()
  console.log("OPERATOR_CONTRACT_ADDRESS", operatorContractAddress)

  /* const operatorContract = new ethers.Contract("0x575C0B5777eF7F620E51ff33b33ccB854B856e84", operatorAbi.abi, wallet)
  npcContractAddress = "0xF0fEFC86335E227c85aA778b24061B6B70B80Ef4" */

  // Transfer NPC contract to Operator
  await npcContract.transferOwnership(operatorContractAddress);
  await currencyContract.transferOwnership(operatorContractAddress);
  await foodContract.transferOwnership(operatorContractAddress);
  await supplyContract.transferOwnership(operatorContractAddress);

  const npcTx = await operatorContract.createNPC(owner.address, `ipfs://QmQbwCMwDETHHZ1g8YaSHqLBwCRgVHqFuRNRfiGyNqCcXj/1.json`)
  const npcTxReceipt = await npcTx.wait()
  console.log("NFT Minted")

  const stats = await operatorContract.getNPCStats(0)
  console.log(stats)


  /* for (let i = 16; i < 21; i++) {
    // create NPC
    const npcTx = await operatorContract.createNPC(owner.address, `ipfs://QmQbwCMwDETHHZ1g8YaSHqLBwCRgVHqFuRNRfiGyNqCcXj/${i}.json`)
    const npcTxReceipt = await npcTx.wait()
    console.log("NPC Created")

    // After the NPC is created
    const latestTokenId = await operatorContract.getLatestTokenId();

    // create TBA for NPC
    const tba = await tokenboundClient.createAccount({
      tokenContract: npcContractAddress,
      tokenId: latestTokenId,
    })
    console.log("TBA:", tba)

    // equip NPC via TBA

    const equipTx = await operatorContract.equipNPC(tba, 20, 5, 5)
    const equipTxReceipt = await equipTx.wait()
    console.log("NPC Equipped")
  } */
}

Operator()
