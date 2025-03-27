# SaleSquezeChallenge

A simple shopping cart system built with TypeScript to manage products, attributes, and dynamic pricing rules.
Find more instruction on https://kb.salesqueze.com/s/4f82d75a-e4b0-4b4e-9ad3-a33c9f0a5842

## Project Description

SaleSquezeChallenge solution is a product cart system that allows users to add/remove products, update product attributes, and apply rules for dynamic pricing and tax calculation. It is built with TypeScript and uses Jest for testing.

## Known Issues and Limitations

While implementing both a constructor and getter with the same name (`totalPrice` and `taxValues`), as suggested in the challenge, I encountered a TypeScript error. This issue was caused by TypeScript's restrictions on having a constructor and getter with identical names. To resolve this, I had to rename the getters to ensure the code would work properly.

## Future Improvements

There is still room for improvement in the code, specifically regarding the use of `any` types. I plan to refine the code by reducing the use of `any` and implementing more specific types for better type safety. Additionally, there is a possibility to restructure the `Cart` class to allow both a getter and a constructor to have the same name without causing conflicts, which would streamline the code and make it more maintainable.

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
