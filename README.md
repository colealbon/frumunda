# albondigas

### WARNING !!!
this project is under heavy development.  

albondigas is the name of the monorepo. 

cafe-society.news is the code behind [cafe-society.news](https://cafe-society.news), a web based RSS reader with machine learning.

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

## installation - dev environment:
clone the albondigas project
open terminal #1
~~~~
cd albondigas
nx build cafe-society.news --watch --verbose --configuration=development
~~~~
open terminal #2
~~~~
cd albondigas
 ./restartdev.sh; fswatch -o ./dist/apps/cafe-society.news | xargs -n1 -I{} ./restartdev.sh
~~~~

## deployment:
clone the albondigas project
open terminal #1
~~~~
cd albondigas
nx build cafe-society.news --verbose --configuration=production; netlify deploy --prod
~~~~

## team (only add your own name):
- Cole Albon