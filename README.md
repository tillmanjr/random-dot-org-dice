
# random-dot-org-dice

This project provides basic dice rolling functionality for the common TTRPG dice: D3, D4, D6, D8, D10, D12, D16, D20, D50, D100.

To help ensure randomization of dice rolls --something many dice rollers struggle to do well-- this project relies on random.org as its source of random values. 

To minimize external calls to random.org it implements a circular queue with a default capacity of 1000 values. The queue is fill at start by a single GET request to random.org. Each roll request removes one value from the queue. When the number of locally available random values falls below a defined threshold the queue will be refilled with a single GET request to random.org.

It publishes a dice roll with a simple method, `roll`. `roll` takes a single integer argument representing the number of faces of the die to roll then returns a roll result as an integer.

## To Do
1. Add roll tracking to prove statistical correctness
2. Add a simple REST interface to access `roll` and roll statistics.
3. (maybe) Add `docker` containerization.


## Authors

- [@tillmanjr](https://www.github.com/tillmanjr)


## Run Locally

Clone the project

```bash
  git clone git@github.com:tillmanjr/random-dot-org-dice.git
```
or
```bash
  git clone https://github.com/tillmanjr/random-dot-org-dice.git
```

Go to the project directory

```bash
  cd random-dot-org-dice

```

Install dependencies

```bash
  npm install
```
or
```bash
  yarn
```
Start the server

```bash
  npm run start
```
or
```bash
  yarn start
```


## Running Tests

_Before running any tests ensure you have jest installed and available from your active shell._

To run tests, run the following command
```bash
  npm run test
```
To include coverage when running tests, run the following command  
```bash
  npm run test.coverage
```
------
```bash
$ npm run test.coverage

> random-dot-org-dice@1.0.0 test.coverage
> jest --coverage

 PASS  tests/common/consts.test.js
 PASS  tests/config/config.test.js
 PASS  tests/common/errorFactory.test.js
 PASS  tests/queue/OverfillRules.test.js
 PASS  tests/queue/CircularQueueNonBlocking.test.js
 PASS  tests/common/utils.test.js
------------------------------|---------|----------|---------|---------|-------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|-------------------
All files                     |     100 |      100 |     100 |     100 |
 common                       |     100 |      100 |     100 |     100 |
  consts.js                   |     100 |      100 |     100 |     100 |
  errorFactory.js             |     100 |      100 |     100 |     100 |
  utils.js                    |     100 |      100 |     100 |     100 |
 config                       |     100 |      100 |     100 |     100 |
  config.js                   |     100 |      100 |     100 |     100 |
 queue                        |     100 |      100 |     100 |     100 |
  CircularQueueNonBlocking.js |     100 |      100 |     100 |     100 |
  OverfillRules.js            |     100 |      100 |     100 |     100 |
------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 6 passed, 6 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        2.487 s
Ran all test suites.
```

## non-formal tests

in `/exercise` there is a simple execution rig along with a handfull of roll files (in `JavaScript`). Each of the roll files encapsulates the abilty to a specific die type 500 times.

The execution rig creates a DiceRoller then runs each of the roll files through the single DiceRoller instance.

This is useful for checking statistical validity along with proper queue fill and refill functionality.

Recommend redirecting the results to a text file.
e.g.
```bash
$ node ./src/exercise/rollAllds.js > all.txt 
```
__NOTE:__  
If you are using `git-bash` under Windows and get the following error:
```
$ node ./src/exercise/rollAllds.js > all.txt 
bash: all.txt: command not found
stdout is not a tty
```
Load `bash` instead  
```bash 
$ "C:\Program Files\Git\bin\bash.exe"
...
$ node ./src/exercise/rollAllds.js > all.txt 
```
