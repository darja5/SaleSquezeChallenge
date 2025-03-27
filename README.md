# SaleSquezeChallenge

A simple shopping cart system built with TypeScript to manage products, attributes, and dynamic pricing rules.

## Project Description

SaleSquezeChallenge solution is a product cart system that allows users to add/remove products, update product attributes, and apply rules for dynamic pricing and tax calculation. It is built with TypeScript and uses Jest for testing.

## Known Issues and Limitations

When implementing constructor and getter both with name totalPrice or taxValues (as the challange suggests) I ran into Typescript error. I had to rename the getters for the code to work.

## Future Improvements

There is still room for code improvment using less any types and constructing Cart claass in a way that both a getter and a contructors can have the same names.

## Acknowledgments

Special thanks to SaleSqueze for giving me the opportunity to work on this challenge. I had a blast programming it and enjoyed every part of the process.

## Installation

To get started, clone the repository and install the required dependencies:

```bash
# Clone the repository
git clone https://github.com/darja5/SaleSquezeChallenge.git

# Install dependencies
npm install

# Run tests
npm test

```
