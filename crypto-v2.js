import CryptoJS from "crypto-js";

const password = "123dddddd";
const secret = "test";

const encrypt = (details) => {
  // Create the main encryption.
  const encrypted = CryptoJS.AES.encrypt(details.secret, details.password, {
    iv: details.iv,
  });

  // Crypto JS Automatically gives us the values we need.
  const { iv, key, ct } = encrypted;

  // IV and Key need to be Hex
  const ivHex = CryptoJS.enc.Hex.stringify(iv);
  const keyHex = CryptoJS.enc.Hex.stringify(key);

  // Convert encrypted to a string.
  const base64Secret = encrypted.toString();

  return { base64Secret, ivHex, keyHex };
};

const data = encrypt({ secret: secret, password: password });

console.log(
  `echo ${data.base64Secret} | openssl enc -base64 -d | openssl enc -d -aes-256-cbc -K ${data.keyHex} -iv ${data.ivHex} -k ${password}`
);

// echo U2FsdGVkX1+wL7+vQSU7DfXGO5DXoqkfu0y4mTyRAqs= | openssl enc -base64 -d | openssl enc -d -aes-256-cbc -K d8a26e4b184264c6166691eeba0afa3327119c417efbaccfcbca7a762c56a863 -iv 1bd381d5d8ddb71296e042b6bdebde62 -k 123dddddd

const decrypted = CryptoJS.AES.decrypt(data.base64Secret, password);

const str = decrypted.toString(CryptoJS.enc.Utf8);

console.log(str);
