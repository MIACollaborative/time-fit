import TimeEngine from "./time-engine/TimeEngine.mjs";
import DatabaseHelper from "./utility/DatabaseHelper.mjs";

// Register a function to get user list (so developers can decide whether user list needs to be retrieve every time or not)
async function myGetUserList(){
    let users = await DatabaseHelper.getUsers();
    
    const userList = users.map((userInfo) => {
      return exclude(userInfo, [
        "password",
        "hash",
        "accessToken",
        "refreshToken",
      ]);
    });

    return userList;
}

// Register a function to get task list (so developers can decide whether task list needs to be retrieve every time or not)

// Start the time engine
TimeEngine.start();