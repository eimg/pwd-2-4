import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";

const user = { id: 1, name: "Alice" };
const secret = "secret-key";
const token = jwt.sign(user, secret);

console.log(token);
console.log(jwt.verify(token, secret));

// console.log( faker.person.fullName() );
// console.log( faker.person.bio() );
// console.log( faker.phone.number() );
// console.log( faker.number.int({ min: 1, max: 10 }) );

const password = "Apple";

async function makeHash() {
	const hash = await bcrypt.hash(password, 10);
	console.log(hash);
    return hash;
}

async function compareHash() {
	const hash = makeHash();
	if (await bcrypt.compare("Apple", hash)) {
		console.log("Correct password");
	} else {
		console.log("Incorrect password");
	}
}

// compareHash();
