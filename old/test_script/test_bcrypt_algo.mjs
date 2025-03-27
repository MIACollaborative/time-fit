import bcrypt from "bcrypt";
import * as dotenv from "dotenv";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


//let hash = "$2b$10$QsE0SpEj3FFnbKkZLqhyGO/RmhYqOdhmO3lkTvbJgIvbRdwts5Le6";


let hash = await bcrypt.hash(myPlaintextPassword, saltRounds).then((hashPassword) => {
    // Store hash in your password DB.
    return hashPassword;
});

console.log(`Hash: ${hash}`);


let trueCount = 0;
let totalCount = 0;

// Load hash from your password DB.
for(let i = 0; i < 20; i++){
    console.log(i);
    await bcrypt.compare(myPlaintextPassword, hash).then((result) =>{
        // result == true
        //console.log(`bcrypt.compare: ${result}`);
        trueCount++;
    });
    
    await bcrypt.compare(someOtherPlaintextPassword, hash).then((result)=> {
        // result == false
        //console.log(`bcrypt.compare: ${result}`);
    });

    totalCount++;
}

console.log(`comparison: ${trueCount}/${totalCount} true`);