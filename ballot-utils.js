const web3 = require("web3");

  function ballotArgsHandler (
        name,
        question,
        endTime, // provide a Date object to this arg
        externalitiesEnabled,
        candidateNames)
  {
    return [
      this.strToBytes32(name),
      this.strToBytes32(question),
      /* getTime gives unix epoch in milliseconds, we convert it in seconds as
      used by solidity */
      Math.floor(endTime.getTime() / 1000),
      this.hashListToListBytes32(votersCodeHashes),
      externalitiesEnabled,
      this.hashListToListBytes32( // if no pictures, put a placeholder hash
          pictureHashes ?
              pictureHashes :
              new Array(candidateNames.length).fill(web3.utils.utf8ToHex("R"))
      ),
      this.strListToListBytes32(candidateNames)
    ];
  }

   function strToBytes32(str) {
    let ret;
    ret = web3.utils.utf8ToHex(str);
    ret = web3.utils.hexToBytes(ret);
    return ret.slice(0, 32);
  }

  function bytes32ToStr(str) {
    return web3.utils.hexToUtf8(str);
  }

  function strListToListBytes32(list) {
    let ret = [];
    list.forEach((el, i) => {
      ret[i] = this.strToBytes32(el);
    });
    return ret;
  }

  function hashListToListBytes32 (list) {
    let ret = [];
    list.forEach((el, i) => {
      ret[i] = web3.utils.hexToBytes(el);
    });
    return (ret);
  }

  function listBytes32ToListStr (list) {
    let ret = [];
    list.forEach((el,i) => {
      ret[i] = this.bytes32ToStr(el);
    });
    return ret;
  }

  function strToHash (str) {
    let ret = web3.utils.utf8ToHex(str);
    ret = web3.utils.hexToBytes(ret);
    ret = ret.slice(0, 32);
    ret = ret.concat(new Array(32 - ret.length).fill(0));
    ret = web3.utils.bytesToHex(ret);
    return web3.utils.soliditySha3(ret);
  }
