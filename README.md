# biOS UI

## Prerequisites

Node version 20.x is required to install the environment properly.

## Setting up development environment

After cloning the fork, set up the local git environment as follows:

```
git remote add upstream git@bitbucket.org:elasticflash/ui-dev.git
git fetch upstream
```

There are two depending libraries:

- bios-sdk
- ipxl

They are available in separate repositories. Do the following go get them ready:

for bios-sdk:
```
git clone <bios URL> -o ../bios
cd ../bios
python3 -m venv venv
source venv/bin/activate
mvn install
cd sdk/sdk-js
USING_GCR_FOR_JAVASCRIPT=true ./build.sh 
cd bios
npm pack
```

for ipxl
```
git clone <ipxl URL> -o ../ipxl
yarn build
npm pack
```

Then the environment is ready to install by following commands.

```
yarn install
# change the version numbers to current ones
yarn add file:../bios/sdk/sdk-js/bios/bios-bios-sdk-1.2.1.tgz
yarn add file:../ipxl/bios-ipxl-1.0.4-beta.13.tgz
yarn start
```

## Build the Release Package

```
./build.sh
```

This artifacts `bios-ui.tar.gz` and `bios-doc.tar.gz` can be used for installing 
and updating UI by using `bios-lcm`.

## Turning on debug log

Add to the URL: `?biosDebug=<tag>`.  Tag can be:

- `request` - Select request
- `response` - Select response
- `select` - Select request and response
- and more - search for `debugLog(` in JS SDK code

You can also specify multiple tags separated by `-` e.g. `?biosDebug=request-response`.

## Running test cases

```
  yarn playwright test
    Runs the end-to-end tests.

  yarn playwright test example
    Runs the tests in a specific file.

  yarn playwright test Login  —debug
    Runs the tests in a specific file with browser for debugging.

  yarn playwright codegen
    Auto generate tests with Codegen.

 yarn playwright codegen --viewport-size=1600,950
    Runs codegen in different window size

yarn playwright codegen  --browser wk
    Runs codegen on specific browser
```
