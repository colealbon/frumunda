# albondigas

### WARNING !!!  
this project is under heavy development.  

albondigas is the name of the monorepo. 

news-train is the code behind [cafe-society.news](https://cafe-society.news), a web based RSS reader with machine learning.

### stack:
react, blockstack, netlify

### vision:  
cafe-society.news exploits externalities emerging from a peer-to-peer decentralized application infrastructure.  cafe-society.news relies primarily on user supplied storage, networking, CPU, and software development.

### current features:  
- ability to add or delete unlimited news feeds
- ability to add or delete news categories (sections)
- thumbs up / thumbs down style machine learning
- ability to sync machine learning investment between devices via blockstack

### future features:
- ability to share curated content via blockstack (not just algos but content too)
- financial reporting, report value of tokens based on existing actual bids.
- option to publish your settings/machine learning work to classifieds section
- smart contract enabled marketplace allowing readers to share and monetize their investment in machine learning training.
- revenue from operations gets distributed in real time.
 1) 33% gets converted into token purchase limit order x percent below market price. self-market-maker 2) 33% goes to dividend splitter  3) 33% goes to "gravitas" (R&D, advertising and operations (purchase STX tokens, filecoin tokens, ETH gas etc)  4) 1% purchase and destroy albondigas tokens

- pyramid marketing infrastructure
- dividend splitter (profits sent to holders of albondigas tokens)

## installation:
~~~~
git clone https://gitlab.com/cole.albon/news-train.git
cd news-train
yarn install
netlify dev
~~~~

## team (only add your own name):
- Cole Albon

### please support us with a vote on [PRODUCT HUNT](https://www.producthunt.com/posts/cafe-society)



<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>


This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from 
`@albondigas/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.



## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
