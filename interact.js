// interact.js

const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to the local blockchain (Ganache)
const web3 = new Web3('http://localhost:7545'); // For local development

// Load the contract ABI and address
const contractPath = path.resolve(__dirname, 'build', 'contracts', 'Marketplace.json');
const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const contractAbi = contractData.abi;
const contractAddress = contractData.networks['5777'].address; // Use the appropriate network id

// Create contract instance
const marketplace = new web3.eth.Contract(contractAbi, contractAddress);

// Function to create an asset
const createAsset = async (name, uri, price, fromAddress) => {
    try {
        await marketplace.methods.createAsset(name, uri, price).send({ from: fromAddress, gas: 3000000 });
        console.log(`Asset created: ${name}`);
    } catch (error) {
        console.error(`Error creating asset: ${error.message}`);
    }
};

const purchaseAsset = async (id, fromAddress, value) => {
    try {
        await marketplace.methods.purchaseAsset(id).send({ from: fromAddress, value: web3.utils.toWei(value, 'ether'), gas: 3000000 });
        console.log(`Asset purchased: ID ${id}`);
    } catch (error) {
        console.error(`Error purchasing asset: ${error.message}`);
    }
};


// Main function to interact with the contract
const main = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Accounts:", accounts);

        console.log("Creating asset...");
        await createAsset('3D Model 1', 'https://example.com/model1', web3.utils.toWei('1', 'ether'), accounts[0]);

        console.log("Purchasing asset...");
        await purchaseAsset(1, accounts[1], '1');
    } catch (error) {
        console.error(`Error in main function: ${error.message}`);
    }
};

main();
