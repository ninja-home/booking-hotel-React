
const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

const MNEMONIC = 'evoke muffin awesome merit cool magnet fence fetch capable figure expect raccoon';
const PROJECTID = '3040491c81044721b2170a2d88a89b7f';

module.exports = {

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache, geth, or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${PROJECTID}`),
      network_id: "4",
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  //0xcC61066f9480E19b3f7f8990dd2A247f31278E8E
  //BlockNumber: 11271009
  //truffle migrate --network rinkeby

  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abi',

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.14",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
      //  evmVersion: "byzantium"
      }
    }
  },

  };
