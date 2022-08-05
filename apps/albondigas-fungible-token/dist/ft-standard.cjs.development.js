'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@clarigen/core');

// prettier-ignore
var FtTraitInterface = {
  "functions": [],
  "fungible_tokens": [],
  "maps": [],
  "non_fungible_tokens": [],
  "variables": []
};

var ftTraitContract = function ftTraitContract(provider) {
  var contract = core.proxy(FtTraitInterface, provider);
  return contract;
};
var ftTraitInfo = {
  contract: ftTraitContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'contracts/ft-trait.clar'
};

// prettier-ignore
var ExampleTokenInterface = {
  "functions": [{
    "access": "public",
    "args": [],
    "name": "get-token-uri",
    "outputs": {
      "type": {
        "response": {
          "error": "none",
          "ok": {
            "optional": {
              "string-utf8": {
                "length": 19
              }
            }
          }
        }
      }
    }
  }, {
    "access": "public",
    "args": [{
      "name": "amount",
      "type": "uint128"
    }, {
      "name": "sender",
      "type": "principal"
    }, {
      "name": "recipient",
      "type": "principal"
    }, {
      "name": "memo",
      "type": {
        "optional": {
          "buffer": {
            "length": 34
          }
        }
      }
    }],
    "name": "transfer",
    "outputs": {
      "type": {
        "response": {
          "error": "uint128",
          "ok": "bool"
        }
      }
    }
  }, {
    "access": "read_only",
    "args": [{
      "name": "owner",
      "type": "principal"
    }],
    "name": "get-balance",
    "outputs": {
      "type": {
        "response": {
          "error": "none",
          "ok": "uint128"
        }
      }
    }
  }, {
    "access": "read_only",
    "args": [],
    "name": "get-decimals",
    "outputs": {
      "type": {
        "response": {
          "error": "none",
          "ok": "uint128"
        }
      }
    }
  }, {
    "access": "read_only",
    "args": [],
    "name": "get-name",
    "outputs": {
      "type": {
        "response": {
          "error": "none",
          "ok": {
            "string-ascii": {
              "length": 13
            }
          }
        }
      }
    }
  }, {
    "access": "read_only",
    "args": [],
    "name": "get-symbol",
    "outputs": {
      "type": {
        "response": {
          "error": "none",
          "ok": {
            "string-ascii": {
              "length": 7
            }
          }
        }
      }
    }
  }, {
    "access": "read_only",
    "args": [],
    "name": "get-total-supply",
    "outputs": {
      "type": {
        "response": {
          "error": "none",
          "ok": "uint128"
        }
      }
    }
  }],
  "fungible_tokens": [{
    "name": "example-token"
  }],
  "maps": [],
  "non_fungible_tokens": [],
  "variables": []
};

var exampleTokenContract = function exampleTokenContract(provider) {
  var contract = core.proxy(ExampleTokenInterface, provider);
  return contract;
};
var exampleTokenInfo = {
  contract: exampleTokenContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'contracts/example-token.clar'
};

var contracts = {
  ftTrait: ftTraitInfo,
  exampleToken: exampleTokenInfo
}; // prettier-ignore

var accounts = {
  "deployer": {
    "mnemonic": "fetch outside black test wash cover just actual execute nice door want airport betray quantum stamp fish act pen trust portion fatigue scissors vague",
    "balance": 1000000,
    "address": "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE"
  },
  "wallet_1": {
    "mnemonic": "spoil sock coyote include verify comic jacket gain beauty tank flush victory illness edge reveal shallow plug hobby usual juice harsh pact wreck eight",
    "balance": 1000000,
    "address": "ST1J4G6RR643BCG8G8SR6M2D9Z9KXT2NJDRK3FBTK"
  },
  "wallet_2": {
    "mnemonic": "arrange scale orient half ugly kid bike twin magnet joke hurt fiber ethics super receive version wreck media fluid much abstract reward street alter",
    "balance": 1000000,
    "address": "ST20ATRN26N9P05V2F1RHFRV24X8C8M3W54E427B2"
  },
  "wallet_3": {
    "mnemonic": "glide clown kitchen picnic basket hidden asset beyond kid plug carbon talent drama wet pet rhythm hero nest purity baby bicycle ghost sponsor dragon",
    "balance": 1000000,
    "address": "ST21HMSJATHZ888PD0S0SSTWP4J61TCRJYEVQ0STB"
  },
  "wallet_4": {
    "mnemonic": "pulp when detect fun unaware reduce promote tank success lecture cool cheese object amazing hunt plug wing month hello tunnel detect connect floor brush",
    "balance": 1000000,
    "address": "ST2QXSK64YQX3CQPC530K79XWQ98XFAM9W3XKEH3N"
  },
  "wallet_5": {
    "mnemonic": "replace swing shove congress smoke banana tired term blanket nominee leave club myself swing egg virus answer bulk useful start decrease family energy february",
    "balance": 1000000,
    "address": "ST3DG3R65C9TTEEW5BC5XTSY0M1JM7NBE7GVWKTVJ"
  },
  "wallet_6": {
    "mnemonic": "apology together shy taxi glare struggle hip camp engage lion possible during squeeze hen exotic marriage misery kiwi once quiz enough exhibit immense tooth",
    "balance": 1000000,
    "address": "ST3R3B1WVY7RK5D3SV5YTH01XSX1S4NN5B3QK2X0W"
  },
  "wallet_7": {
    "mnemonic": "antenna bitter find rely gadget father exact excuse cross easy elbow alcohol injury loud silk bird crime cabbage winter fit wide screen update october",
    "balance": 1000000,
    "address": "ST3ZG8F9X4VKVTVQB2APF4NEYEE1HQHC2EDBF09JN"
  },
  "wallet_8": {
    "mnemonic": "east load echo merit ignore hip tag obvious truly adjust smart panther deer aisle north hotel process frown lock property catch bless notice topple",
    "balance": 1000000,
    "address": "STEB8ZW46YZJ40E3P7A287RBJFWPHYNQ2AB5ECT8"
  },
  "wallet_9": {
    "mnemonic": "market ocean tortoise venue vivid coach machine category conduct enable insect jump fog file test core book chaos crucial burst version curious prosper fever",
    "balance": 1000000,
    "address": "STFCVYY1RJDNJHST7RRTPACYHVJQDJ7R1DWTQHQA"
  }
};

exports.accounts = accounts;
exports.contracts = contracts;
//# sourceMappingURL=ft-standard.cjs.development.js.map
