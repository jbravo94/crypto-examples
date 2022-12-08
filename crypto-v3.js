import CryptoJS from "crypto-js";

var message = "SuperSecret!!";
var password = "Password01";

var getKeyAndIV = function (password) {
  var keyBitLength = 256;
  var ivBitLength = 128;
  var iterations = 234;

  var bytesInSalt = 128 / 8;
  var salt = CryptoJS.lib.WordArray.random(bytesInSalt);

  var iv128Bits = CryptoJS.PBKDF2(password, salt, {
    keySize: 128 / 32,
    iterations: iterations,
  });
  var key256Bits = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: iterations,
  });

  return {
    iv: iv128Bits,
    key: key256Bits,
  };
};

var skey = getKeyAndIV(password);

var data = CryptoJS.AES.encrypt(message, skey.key, { iv: skey.iv });

const { iv, key, ct } = data;

const ivHex = CryptoJS.enc.Hex.stringify(iv);
const keyHex = CryptoJS.enc.Hex.stringify(key);
const base64Secret = data.toString();

console.log(
  `echo ${base64Secret} | openssl enc -base64 -d | openssl enc -d -aes-256-cbc -K ${keyHex} -iv ${ivHex} -k ${password} -nosalt`
);

// echo mTbfrvvvGVHY+LCZfzSeqg== | openssl enc -base64 -d | openssl enc -d -aes-256-cbc -K 31c3f03aa212477e314973b15259dec6ee094c6607772a5dfc6cc8a75a068f07 -iv 31c3f03aa212477e314973b15259dec6 -k Password01 -nosalt

var dc = data.ciphertext.toString(CryptoJS.enc.Base64);
var dk = data.key.toString(CryptoJS.enc.Base64);
var di = data.iv.toString(CryptoJS.enc.Base64);

var bciphertext = CryptoJS.enc.Base64.parse(dc);
var bkey = CryptoJS.enc.Base64.parse(dk);
var biv = CryptoJS.enc.Base64.parse(di);

var params = {
  ciphertext: bciphertext,
  salt: "",
};

var clearText = CryptoJS.AES.decrypt(params, bkey, { iv: biv });

console.log(clearText.toString(CryptoJS.enc.Utf8));
