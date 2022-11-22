# Voting DApp

## Link
[https://voting-dapp-david-quenet.vercel.app/](https://voting-dapp-david-quenet.vercel.app/)
## Demo video
[https://youtu.be/57DFA0ukBxE](https://youtu.be/57DFA0ukBxE)


## Installation

Install dependencies

```sh
# Install Truffle globally and run `truffle unbox`
$ cd client
$ yarn install
$ cd ../truffle
$ yarn install
```

Deploy contract on ganache or goerli (You must add a .env with infura keys)

```sh
# cd truffle
$ yarn migrate-dev
$ yarn migrate-goerli
```

Start the react dev server.

```sh
$ cd client
$ yarn start
```


## Truffle box FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Create React App](https://create-react-app.dev). Either one would be a great place to start!
