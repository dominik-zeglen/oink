import {createHmac, randomBytes} from "crypto";

function createPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = createHmac('SHA512', salt).update(password);
  return {
    pass: hash.digest('hex'),
    salt,
  };
}
