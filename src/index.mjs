import TimeEngine from "./time-engine/TimeEngine.mjs";
import DatabaseHelper from "./utility/DatabaseHelper.mjs";

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

async function myGetTaskList(){
    let tasks = await DatabaseHelper.getTasksSortedByPriority("asc");
    return tasks;
}


// Register a function to get user list (so developers can decide whether user list needs to be retrieve every time or not)
TimeEngine.registerGetUserListFunction(myGetUserList);
// Register a function to get task list (so developers can decide whether task list needs to be retrieve every time or not)
TimeEngine.registerGetTaskListFunction(myGetTaskList);

// Register a function to insert event
TimeEngine.registerInsertEventFunction(DatabaseHelper.insertEvent);

// Register a function to insert taskLog
TimeEngine.registerInsertTaskLogListFunction(DatabaseHelper.insertTaskLogList);

// Start the time engine
TimeEngine.start();