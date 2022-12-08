import CryptoJS from "crypto-js";

const password = "password";
const secret = "secret";

// echo secret | openssl enc -aes-256-cbc -base64 -k password

const encrypted = CryptoJS.AES.encrypt(secret, password);
const base64Secret = encrypted.toString();

console.log(
  `echo ${base64Secret} | openssl enc -base64 -d | openssl enc -d -aes-256-cbc -k ${password}`
);

// echo U2FsdGVkX19mcn0BTb+SadP78uw71D2tEl9JtkAz8VM= | openssl enc -base64 -d | openssl enc -d -aes-256-cbc -k 2

const decrypted = CryptoJS.AES.decrypt(base64Secret, password);

const str = decrypted.toString(CryptoJS.enc.Utf8);

console.log(str);
