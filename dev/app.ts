let num = 123;
let str = "abc";

function add(a: number, b: number) {
    return a + b;
}

add(num, 5);

type User = {
    name: string;
    age: number;
    bio?: string;
}

let alice: User = {
    name: "Alice",
    age: 22,
}

interface Student {
    name: string;
    grade: "A" | "B";
}

let bob: Student = {
    name: "Bob",
    grade: "A"
}

function wrap<T>(data: T) {
    return [data];
}

wrap(alice);
wrap(bob);

let eve: User & { gender: "male" | "female" } = {
    name: "Eve",
    age: 22,
    gender: "female"
}
