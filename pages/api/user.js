import prisma from "../../lib/prisma"
import { getSession } from "next-auth/react";
import cryptoRandomString from 'crypto-random-string';
import bcrypt from "bcrypt";


const adminUsernameList = ["test1", "test2", "test3", "test4"];

export default async function handler(req, res) {
    const session = await getSession({ req })
    if (!session) {
      // Not Signed in
      res.status(401).json({});
      res.end();
      return
    }

    
    const { function_name } = req.query;

    let sessionUserName = session.user.name;
    

    console.log(`function: ${function_name}`);


    const { username,  ...rest } = req.body;

    switch (function_name) {
        case "get":
            let itemList = [];
            if (adminUsernameList.includes(sessionUserName)) {
                itemList = await prisma.users.findMany();
            }
            res.status(200).json({ result: itemList });
            return;        
        case "update_time_preference":
            const {weekdayWakeup, weekdayBed, weekendWakeup, weekendBed, timezone } = req.body;
            const updateUser = await prisma.users.update({
                where: { username: username },
                data: {
                    weekdayWakeup,
                    weekdayBed,
                    weekendWakeup,
                    weekendBed,
                    timezone
                },
            });

            res.status(200).json({ result: "success" });
            return;
        case "update_group_assignment":
                const {gif, salience, modification } = req.body;
                console.log(`typeof gif: ${typeof gif}`);
                console.log(`typeof salience: ${typeof salience}`);
                console.log(`typeof modification: ${typeof modification}`);
                await prisma.users.update({
                    where: { username: username },
                    data: 
                    {
                        gif,
                        salience,
                        modification
                    }
                });
    
                res.status(200).json({ result: "success" });
                return;
        case "update_info":
                const{password, ...pRest} = rest;
                if(password != undefined){
                    if (adminUsernameList.includes(sessionUserName)) {
                        const aUser = await prisma.users.update({
                            where: { username: username },
                            data: rest,
                        });
                    }
                    else{
                        const aUser = await prisma.users.update({
                            where: { username: username },
                            data: pRest,
                        });
                    }
                }
                else{
                    const aUser = await prisma.users.update({
                        where: { username: username },
                        data: rest,
                    });
                }
                
    
                res.status(200).json({ result: "success" });
                return;
        case "generate_new_password":
            let saltRounds = 10;
            let pass = cryptoRandomString({ length: 8, characters: 'abcdefghijkmnpqrstuvwxyz023456789' });
            let passwordHash = await bcrypt.hash(pass, saltRounds).then((hashPassword) => {
                // Store hash in your password DB.
                return hashPassword;
            });
            res.status(200).json({ result: {
                password: pass,
                passwordHash
            } });
            return;
        case "reset":
            let deleteValue = {
                unset: true,
              };
        
            let result = await prisma.users.update({
                where: { username: username },
                data: {
                    preferredName: deleteValue,
                    phone: deleteValue,
                    timezone: deleteValue,
                    phase: "baseline",
                    joinAt: deleteValue,
                    activateAt: deleteValue,
                    completeAt: deleteValue,
                    fitbitReminderTurnOff: false,
                    saveWalkToJoyToContacts: false,
                    autoWalkTo10: false,
                    fitbitId: deleteValue,
                    fitbitDisplayName: deleteValue,
                    fitbitFullName: deleteValue,
                    accessToken: deleteValue,
                    refreshToken: deleteValue,
                    weekdayWakeup: deleteValue,
                    weekdayBed: deleteValue,
                    weekendWakeup: deleteValue,
                    weekendBed: deleteValue
                },
            });
            res.status(200).json({ result: result});
            return;
        case "get_info":
            
            const user = await prisma.users.findFirst({
                where: { username: userName },
            });

            const userInfo = JSON.parse(JSON.stringify(user, replacer));

            res.status(200).json({ result: userInfo });
            return;


        default:
            return;
    }
}
