import DataRecordHelper from "../data-source/DataRecordHelper.js";
import FitbitAPIHelper from "../data-source/fitbit/FitbitAPIHelper.js";

export default class FitbitDataHelper {
  constructor() {}

  static generateCompositeIDForFitbitUpdate(aList = []) {
    return aList.join("_");
  }

  static async queryAndStoreFitbitActivitySummaryAtTargetDateForUser(
    userInfo,
    targetDate,
    insertToDB = true,
    numOfDays = 1,
    suppressTokenValidation = false
  ) {
    let resultData = {};

    // validate user token first
    // { value: "success", data: userInfo };
    // { value: "failed", data: inspect(error.response.data) };

    let updatedUserInfo = userInfo;

    if (!suppressTokenValidation) {
      const validateTokenResult = await FitbitDataHelper.ensureTokenValidForUser(
        userInfo,
        true,
        30 * 60
      );

      if (validateTokenResult.value == "success") {
        updatedUserInfo = validateTokenResult.data;
      } else {
        return validateTokenResult;
      }
    }

    let resultList = [];
    // now query the data
    for (let i = 0; i < numOfDays; i++) {
      const curDate = targetDate.plus({ days: i });

      const activityResult =
        await FitbitAPIHelper.getActvitySummaryAtDateForFitbitId(
          updatedUserInfo.fitbitId,
          updatedUserInfo.accessToken,
          curDate
        )
          .then((responseData) => {
            return { value: "success", data: responseData };
          })
          .catch((error) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(`Data: ${error.response.data}`);
              console.log(`Status: ${error.response.status}`);
              console.log(`StatusText: ${error.response.statusText}`);
              console.log(`Headers: ${error.response.headers}`);

              console.log(`Error response`);
              // which means, authentication falil
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);

              console.log(`Error request`);
            } else {
              // Something happened in setting up the request that triggered an Error
              // console.log('Error', error.message);

              console.log("Error else");
            }
            //res.status(error.response.status).json({ response: inspect(error.response.data) });

            const resultObj = eval(`(${inspect(error.response.data)})`);
            return { value: "failed", data: resultObj };
          });


      if (insertToDB == true && activityResult.value == "success") {
        resultData = activityResult.data;

        // now insert the data
        // To Do: decide the schema
        const dataType =
          FitbitAPIHelper.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY;


        const dateTime = curDate.toISODate();
        const compositeId = FitbitDataHelper.generateCompositeIDForFitbitUpdate([
          updatedUserInfo.fitbitId,
          dataType,
          dateTime,
        ]);
        const lastModified =
          resultData.activities.length > 0
            ? resultData.activities[0].lastModified
            : "";

        const oldDocument = await prisma.fitbit_data.findFirst({
          where: {
            compositeId: compositeId,
          },
        });

        const newDocument = await prisma.fitbit_data.upsert({
          where: {
            compositeId: compositeId,
          },
          update: {
            lastModified: lastModified,
            content: resultData,
          },
          create: {
            compositeId: compositeId,
            dataType: dataType,
            ownerId: updatedUserInfo.fitbitId,
            dateTime: dateTime,
            lastModified: lastModified,
            content: resultData,
          },
        });

        // now, see if I can calculate the diff
        let documentDiff = {};

        if (oldDocument == null) {
          documentDiff = DataRecordHelper.getObjectAsJSONDiff({}, newDocument);
        } else {
          documentDiff = DataRecordHelper.getObjectAsJSONDiff(
            oldDocument,
            newDocument
          );
        }
        await prisma.update_diff.create({
          data: {
            collectionName: "fitbit_data",
            documentId: newDocument.id,
            documentDiff: documentDiff,
          },
        });
      }

      resultList.push(activityResult);
    }

    let resultStatus = "success";
    let resultErrorMessage = "";

    for (let i = 0; i < resultList.length; i++) {
      const curResult = resultList[i];
      // one failed is failed
      if (curResult.value == "failed") {
        resultStatus = "failed";
        resultErrorMessage += `${curResult.data} - `;
      }
    }

    return {
      value: resultStatus,
      data: resultErrorMessage,
    };
  }
  static async queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB=true, numOfDays=1){

    let resultData = {};
    const validateTokenResult = await FitbitAPIHelper.ensureTokenValidForUser(userInfo, true, 30 * 60);
    let updatedUserInfo;

    if(validateTokenResult.value == "success"){
        updatedUserInfo = validateTokenResult.data;
    }
    else{
        return validateTokenResult;
    }

    let resultList = [];
    // now query the data
    for(let i = 0; i < numOfDays; i++){
        let curDate = targetDate.plus({"days": i});

        const activityResult = await FitbitHelper.getHeartRateAtDateForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, curDate)
        .then((responseData) => {
          console.log(
            `FitbitHelper.getHeartRateAtDateForFitbitId: ${JSON.stringify(
              responseData
            )}`
          );
    
          /*
          if(responseData.status == 400){
              // cannot auth: Bad Request
              // I supposed this mean we need to authenticate again
          }
          */
    
          //accessToken = responseData.access_token;
    
          // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
          //refreshToken = responseData.refresh_token;
    
          // To Do: ideally, store both
          //updateToken(hashCode, accessToken, refreshToken);
    
          return {value: "success", data: responseData};
    
          //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(`Data: ${error.response.data}`);
            console.log(`Status: ${error.response.status}`);
            console.log(`StatusText: ${error.response.statusText}`);
            console.log(`Headers: ${error.response.headers}`);
    
            console.log(`Error response`);
            // which means, authentication falil
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
    
            console.log(`Error request`);
          } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
    
            console.log("Error else");
          }
          //res.status(error.response.status).json({ response: inspect(error.response.data) });
    
          let resultObj = eval(`(${inspect(error.response.data)})`);
          return {value: "failed", data: resultObj};
        });


        console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: query result: ${activityResult.value}`);


        if(insertToDB == true && activityResult.value == "success"){
            resultData = activityResult.data;

            // now insert the data
            // To Do: decide the schema
            let dataType = "activities-heart";
            let dateTime = curDate.toISODate(); //resultData[dataType][0].dateTime;
            let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);
            let lastModified = ""; // no this field for heart rate

            const updateRecord = await prisma.fitbit_data.upsert({
                where: {
                    compositeId: compositeId
                },
                update: {
                    lastModified: lastModified,
                    content: resultData
                },
                create: {
                    compositeId: compositeId,
                    dataType: dataType,
                    ownerId: updatedUserInfo.fitbitId,
                    dateTime: dateTime,
                    lastModified: lastModified, 
                    content: resultData
                },
            })
        }


        resultList.push(activityResult);

    }



    let resultStatus = "success";
    let resultErrorMessage = "";

    for(let i = 0 ; i < resultList.length; i++){
        let curResult = resultList[i];
        // one failed is failed
        if (curResult.value == "failed"){
            resultStatus = "failed";
            resultErrorMessage += `${curResult.data} - `;
        }
    }

    //return activityResult;
    //return resultList;

    return {
        value: resultStatus,
        data: resultErrorMessage
    };
    
}
  static async ensureTokenValidForUser(
    userInfo,
    autoRefresh = false,
    minValidthresholdInSeconds = 8 * 60 * 60
  ) {

    let introspectResult = undefined;

    const myIntrospectResult = await FitbitAPIHelper.myIntrospectToken(
      userInfo.accessToken,
      userInfo.accessToken
    );

    if (myIntrospectResult.type == "response") {
      introspectResult = myIntrospectResult.result;
    } else {
    }

    if (introspectResult != undefined && introspectResult.active == true) {
      const expiredDate = DateTime.fromMillis(introspectResult["exp"]);
      const nowDate = DateTime.now();

      const diffInSeconds = expiredDate.diff(nowDate, "seconds").toObject()[
        "seconds"
      ];

      // token is still valid
      if (autoRefresh == false) {
        return { value: "success", data: userInfo };
      } else {
        if (diffInSeconds > minValidthresholdInSeconds) {
          return { value: "success", data: userInfo };
        } else {
        }
      }
    }

    // accessToken is not valid
    // or, diffInSeconds is small than the minimum tolerable threshold (too close to the expire time)
    const refreshResult = await FitbitAPIHelper.refreshToken(userInfo.refreshToken)
      .then((responseData) => {
        const newAccessToken = responseData.access_token;

        // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
        const newRefreshToken = responseData.refresh_token;

        return {
          value: "success",
          data: {
            ...userInfo,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        };
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(`Data: ${error.response.data}`);
          console.log(`Status: ${error.response.status}`);
          console.log(`StatusText: ${error.response.statusText}`);
          console.log(`Headers: ${error.response.headers}`);

          console.log(`Error response`);
          // which means, authentication falil
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
        }
        return { value: "failed", data: inspect(error.response.data) };
      });

    if (refreshResult.value == "success") {
      // need to actually update the token
      const updatedUserInfo = await DatabaseUtility.updateToken(
        userInfo.hash,
        refreshResult.data.accessToken,
        refreshResult.data.refreshToken,
        userInfo
      );

      return { value: "success", data: updatedUserInfo };
    }

    return refreshResult;
  }
}
