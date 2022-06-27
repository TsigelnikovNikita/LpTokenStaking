#!/bin/bash

# Use this script for verify your smart-contract on the etherscan.
# Arguments of the contructor is taken from the arguments.js file. You can modify it.
# Read more here https://hardhat.org/plugins/nomiclabs-hardhat-etherscan
# Netwrok name and contract address are passed to the script.

NETWORK_NAME=$1
CONTRACT_ADDRESS=$2

npx hardhat verify --network $NETWORK_NAME --constructor-args arguments.js $CONTRACT_ADDRESS
