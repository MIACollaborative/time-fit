import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";
import csvWriter from "csv-write-stream";
import fs from "fs";
import { DateTime } from "luxon";;

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

let sampleJSONObjList = [
    {
        "id": "63b5c801efffafaa7d8fee94",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8456237365119956,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T18:40:01.049Z",
        "updatedAt": "2023-01-04T18:40:01.049Z"
    },
    {
        "id": "63b5c6d537cddf0237066474",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.45206450200844506,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T18:35:01.112Z",
        "updatedAt": "2023-01-04T18:35:01.112Z"
    },
    {
        "id": "63b5c5a937cddf0237066473",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.2919857675755806,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T18:30:01.818Z",
        "updatedAt": "2023-01-04T18:30:01.818Z"
    },
    {
        "id": "63b5c47c37cddf023706646e",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8628257533702202,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T18:25:00.745Z",
        "updatedAt": "2023-01-04T18:25:00.745Z"
    },
    {
        "id": "63b5c350e0df172075f7d943",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.25439190526217703,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T18:20:00.237Z",
        "updatedAt": "2023-01-04T18:20:00.237Z"
    },
    {
        "id": "63b5c225971aff9946133ab0",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6917351574622002,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T18:15:01.350Z",
        "updatedAt": "2023-01-04T18:15:01.351Z"
    },
    {
        "id": "63b5c0f8971aff9946133aab",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7949658435566898,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T18:10:00.266Z",
        "updatedAt": "2023-01-04T18:10:00.266Z"
    },
    {
        "id": "63b5bfcc971aff9946133aaa",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4138592414264288,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T18:05:00.091Z",
        "updatedAt": "2023-01-04T18:05:00.091Z"
    },
    {
        "id": "63b5bea2971aff9946133aa6",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T14:25:00.397Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 248,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z",
                            "2023-01-04T11:08:01.672Z",
                            "2023-01-04T11:23:06.178Z",
                            "2023-01-04T11:38:19.181Z",
                            "2023-01-04T11:53:24.418Z",
                            "2023-01-04T12:08:29.454Z",
                            "2023-01-04T12:23:40.920Z",
                            "2023-01-04T12:38:46.262Z",
                            "2023-01-04T12:53:48.860Z",
                            "2023-01-04T13:08:54.740Z",
                            "2023-01-04T13:24:02.570Z",
                            "2023-01-04T13:39:07.879Z",
                            "2023-01-04T13:54:16.963Z",
                            "2023-01-04T14:09:22.283Z",
                            "2023-01-04T14:24:29.001Z",
                            "2023-01-04T14:39:39.311Z",
                            "2023-01-04T14:54:45.192Z",
                            "2023-01-04T15:09:56.156Z",
                            "2023-01-04T15:25:02.529Z",
                            "2023-01-04T15:40:09.751Z",
                            "2023-01-04T15:55:16.867Z",
                            "2023-01-04T16:10:22.878Z",
                            "2023-01-04T16:25:27.917Z",
                            "2023-01-04T16:36:26.070Z",
                            "2023-01-04T16:40:27.728Z",
                            "2023-01-04T16:55:37.029Z",
                            "2023-01-04T17:10:44.808Z",
                            "2023-01-04T17:25:48.952Z",
                            "2023-01-04T17:40:55.172Z",
                            "2023-01-04T17:56:17.757Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            756
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T18:00:00.867+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T13:00:00.868-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.936683505416356,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T18:00:02.010Z",
        "updatedAt": "2023-01-04T18:00:02.011Z"
    },
    {
        "id": "63b5bea2971aff9946133aa9",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.34354450731119424,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T18:00:02.011Z",
        "updatedAt": "2023-01-04T18:00:02.011Z"
    },
    {
        "id": "63b5bea2971aff9946133aa8",
        "taskLabel": "intervention_salience",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T15:05:01.655Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.21963641279777635,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "messageGroup",
                    "messageLabel": "",
                    "messageGroup": "salience",
                    "avoidHistory": true
                }
            }
        },
        "messageLabel": "salience_3",
        "executionResult": {
            "type": "twilio",
            "value": {
                "body": "For your walk today, feel the weather. What kind of thoughts or emotion do you notice or feel? ",
                "numSegments": "0",
                "direction": "outbound-api",
                "from": null,
                "to": "+18474522224",
                "dateUpdated": "2023-01-04T18:00:01.000Z",
                "price": null,
                "errorMessage": null,
                "uri": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SMed0cfc95a988fe95fe65036d3da1d2d1.json",
                "accountSid": "AC74873bd3ac4b62dbe6ef1d44f6ee2a99",
                "numMedia": "0",
                "status": "accepted",
                "messagingServiceSid": "MG05ede0540932555ae0e1b9b88876a30f",
                "sid": "SMed0cfc95a988fe95fe65036d3da1d2d1",
                "dateSent": null,
                "dateCreated": "2023-01-04T18:00:01.000Z",
                "errorCode": null,
                "priceUnit": null,
                "apiVersion": "2010-04-01",
                "subresourceUris": {
                    "media": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SMed0cfc95a988fe95fe65036d3da1d2d1/Media.json"
                }
            }
        },
        "createdAt": "2023-01-04T18:00:02.011Z",
        "updatedAt": "2023-01-04T18:00:02.011Z"
    },
    {
        "id": "63b5bea2971aff9946133aa4",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 40,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z",
                            "2023-01-04T15:00:43.977Z",
                            "2023-01-04T15:16:47.084Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T18:00:00.867+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T13:00:00.868-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.8823417195785999,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T18:00:02.010Z",
        "updatedAt": "2023-01-04T18:00:02.011Z"
    },
    {
        "id": "63b5bea2971aff9946133aa5",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T15:05:01.655Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 118,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:45:19.638Z",
                            "2023-01-04T15:00:22.878Z",
                            "2023-01-04T15:15:29.793Z",
                            "2023-01-04T15:30:38.520Z",
                            "2023-01-04T15:45:50.523Z",
                            "2023-01-04T16:00:54.993Z",
                            "2023-01-04T16:16:05.801Z",
                            "2023-01-04T16:31:10.799Z",
                            "2023-01-04T16:36:34.116Z",
                            "2023-01-04T16:51:38.686Z",
                            "2023-01-04T17:06:46.233Z",
                            "2023-01-04T17:21:54.890Z",
                            "2023-01-04T17:33:04.018Z",
                            "2023-01-04T17:48:09.199Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            737,
                            710
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T18:00:00.867+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T12:00:00.868-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6916629409332458,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T18:00:02.010Z",
        "updatedAt": "2023-01-04T18:00:02.011Z"
    },
    {
        "id": "63b5bea2971aff9946133aa7",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T18:00:00.867+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T13:00:00.868-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.46755840322914066,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T18:00:02.011Z",
        "updatedAt": "2023-01-04T18:00:02.011Z"
    },
    {
        "id": "63b5bd74971aff9946133a9f",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6687920425915606,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T17:55:00.781Z",
        "updatedAt": "2023-01-04T17:55:00.782Z"
    },
    {
        "id": "63b5bc49971aff9946133a9e",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8087282628971761,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:50:01.506Z",
        "updatedAt": "2023-01-04T17:50:01.506Z"
    },
    {
        "id": "63b5bb1d971aff9946133a99",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.13815209839905007,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:45:01.336Z",
        "updatedAt": "2023-01-04T17:45:01.336Z"
    },
    {
        "id": "63b5b9f0971aff9946133a94",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5484950073082844,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T17:40:00.281Z",
        "updatedAt": "2023-01-04T17:40:00.281Z"
    },
    {
        "id": "63b5b8c4971aff9946133a93",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.38684125596784424,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:35:00.960Z",
        "updatedAt": "2023-01-04T17:35:00.960Z"
    },
    {
        "id": "63b5b799971aff9946133a8e",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4544431533473232,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:30:01.908Z",
        "updatedAt": "2023-01-04T17:30:01.908Z"
    },
    {
        "id": "63b5b66d971aff9946133a89",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6906438532126153,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:25:01.640Z",
        "updatedAt": "2023-01-04T17:25:01.640Z"
    },
    {
        "id": "63b5b540971aff9946133a84",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7357504951438367,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T17:20:00.634Z",
        "updatedAt": "2023-01-04T17:20:00.635Z"
    },
    {
        "id": "63b5b415971aff9946133a83",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5069822263862855,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:15:01.478Z",
        "updatedAt": "2023-01-04T17:15:01.478Z"
    },
    {
        "id": "63b5b2e9971aff9946133a7e",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.2530459469992179,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:10:01.296Z",
        "updatedAt": "2023-01-04T17:10:01.296Z"
    },
    {
        "id": "63b5b1bc971aff9946133a79",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.9138776351215683,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T17:05:00.146Z",
        "updatedAt": "2023-01-04T17:05:00.146Z"
    },
    {
        "id": "63b5b092971aff9946133a78",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6847052800560554,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T17:00:02.029Z",
        "updatedAt": "2023-01-04T17:00:02.029Z"
    },
    {
        "id": "63b5b092971aff9946133a77",
        "taskLabel": "intervention_salience",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T14:25:00.397Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.5934685696638216,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T17:00:02.029Z",
        "updatedAt": "2023-01-04T17:00:02.029Z"
    },
    {
        "id": "63b5b092971aff9946133a73",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 40,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z",
                            "2023-01-04T15:00:43.977Z",
                            "2023-01-04T15:16:47.084Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T17:00:00.915+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T12:00:00.916-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.9270437760132484,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T17:00:02.029Z",
        "updatedAt": "2023-01-04T17:00:02.029Z"
    },
    {
        "id": "63b5b092971aff9946133a75",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T14:25:00.397Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 244,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z",
                            "2023-01-04T11:08:01.672Z",
                            "2023-01-04T11:23:06.178Z",
                            "2023-01-04T11:38:19.181Z",
                            "2023-01-04T11:53:24.418Z",
                            "2023-01-04T12:08:29.454Z",
                            "2023-01-04T12:23:40.920Z",
                            "2023-01-04T12:38:46.262Z",
                            "2023-01-04T12:53:48.860Z",
                            "2023-01-04T13:08:54.740Z",
                            "2023-01-04T13:24:02.570Z",
                            "2023-01-04T13:39:07.879Z",
                            "2023-01-04T13:54:16.963Z",
                            "2023-01-04T14:09:22.283Z",
                            "2023-01-04T14:24:29.001Z",
                            "2023-01-04T14:39:39.311Z",
                            "2023-01-04T14:54:45.192Z",
                            "2023-01-04T15:09:56.156Z",
                            "2023-01-04T15:25:02.529Z",
                            "2023-01-04T15:40:09.751Z",
                            "2023-01-04T15:55:16.867Z",
                            "2023-01-04T16:10:22.878Z",
                            "2023-01-04T16:25:27.917Z",
                            "2023-01-04T16:36:26.070Z",
                            "2023-01-04T16:40:27.728Z",
                            "2023-01-04T16:55:37.029Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            696
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T17:00:00.915+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T12:00:00.916-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.23501809773938476,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T17:00:02.029Z",
        "updatedAt": "2023-01-04T17:00:02.029Z"
    },
    {
        "id": "63b5b092971aff9946133a76",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T17:00:00.915+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T12:00:00.916-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.9078961260821956,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T17:00:02.029Z",
        "updatedAt": "2023-01-04T17:00:02.029Z"
    },
    {
        "id": "63b5b092971aff9946133a74",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T15:05:01.655Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 114,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:45:19.638Z",
                            "2023-01-04T15:00:22.878Z",
                            "2023-01-04T15:15:29.793Z",
                            "2023-01-04T15:30:38.520Z",
                            "2023-01-04T15:45:50.523Z",
                            "2023-01-04T16:00:54.993Z",
                            "2023-01-04T16:16:05.801Z",
                            "2023-01-04T16:31:10.799Z",
                            "2023-01-04T16:36:34.116Z",
                            "2023-01-04T16:51:38.686Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            737,
                            653
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T17:00:00.915+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T11:00:00.916-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.37734974648436004,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T17:00:02.029Z",
        "updatedAt": "2023-01-04T17:00:02.029Z"
    },
    {
        "id": "63b5af65971aff9946133a6e",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.03249352454947396,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:55:01.950Z",
        "updatedAt": "2023-01-04T16:55:01.950Z"
    },
    {
        "id": "63b5ae39971aff9946133a69",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5919080891861983,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:50:01.629Z",
        "updatedAt": "2023-01-04T16:50:01.629Z"
    },
    {
        "id": "63b5ad0d971aff9946133a65",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.9353753502198423,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:45:01.464Z",
        "updatedAt": "2023-01-04T16:45:01.464Z"
    },
    {
        "id": "63b5abe1971aff9946133a60",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5872614510276373,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:40:01.260Z",
        "updatedAt": "2023-01-04T16:40:01.260Z"
    },
    {
        "id": "63b5aab5971aff9946133a5a",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.361152806664788,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:35:01.538Z",
        "updatedAt": "2023-01-04T16:35:01.538Z"
    },
    {
        "id": "63b5a989971aff9946133a55",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8166007462705629,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:30:01.927Z",
        "updatedAt": "2023-01-04T16:30:01.928Z"
    },
    {
        "id": "63b5a85c971aff9946133a50",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8741124456250624,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T16:25:00.906Z",
        "updatedAt": "2023-01-04T16:25:00.906Z"
    },
    {
        "id": "63b5a731971aff9946133a4f",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5127984074168015,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:20:01.646Z",
        "updatedAt": "2023-01-04T16:20:01.646Z"
    },
    {
        "id": "63b5a605971aff9946133a4a",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.9843304210657193,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:15:01.452Z",
        "updatedAt": "2023-01-04T16:15:01.452Z"
    },
    {
        "id": "63b5a4d8971aff9946133a45",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6645217922753845,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T16:10:00.418Z",
        "updatedAt": "2023-01-04T16:10:00.419Z"
    },
    {
        "id": "63b5a3ad971aff9946133a44",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.35383260653984405,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:05:01.069Z",
        "updatedAt": "2023-01-04T16:05:01.070Z"
    },
    {
        "id": "63b5a281971aff9946133a3b",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 40,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z",
                            "2023-01-04T15:00:43.977Z",
                            "2023-01-04T15:16:47.084Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T16:00:00.029+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T11:00:00.030-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.9641495245287321,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T16:00:01.087Z",
        "updatedAt": "2023-01-04T16:00:01.087Z"
    },
    {
        "id": "63b5a281971aff9946133a3c",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T15:05:01.655Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 109,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:45:19.638Z",
                            "2023-01-04T15:00:22.878Z",
                            "2023-01-04T15:15:29.793Z",
                            "2023-01-04T15:30:38.520Z",
                            "2023-01-04T15:45:50.523Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            737,
                            585
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T16:00:00.029+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T10:00:00.030-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.9982735219122902,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T16:00:01.087Z",
        "updatedAt": "2023-01-04T16:00:01.087Z"
    },
    {
        "id": "63b5a281971aff9946133a3d",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T14:25:00.397Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 239,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z",
                            "2023-01-04T11:08:01.672Z",
                            "2023-01-04T11:23:06.178Z",
                            "2023-01-04T11:38:19.181Z",
                            "2023-01-04T11:53:24.418Z",
                            "2023-01-04T12:08:29.454Z",
                            "2023-01-04T12:23:40.920Z",
                            "2023-01-04T12:38:46.262Z",
                            "2023-01-04T12:53:48.860Z",
                            "2023-01-04T13:08:54.740Z",
                            "2023-01-04T13:24:02.570Z",
                            "2023-01-04T13:39:07.879Z",
                            "2023-01-04T13:54:16.963Z",
                            "2023-01-04T14:09:22.283Z",
                            "2023-01-04T14:24:29.001Z",
                            "2023-01-04T14:39:39.311Z",
                            "2023-01-04T14:54:45.192Z",
                            "2023-01-04T15:09:56.156Z",
                            "2023-01-04T15:25:02.529Z",
                            "2023-01-04T15:40:09.751Z",
                            "2023-01-04T15:55:16.867Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            635
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T16:00:00.029+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T11:00:00.030-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.43781727239653057,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T16:00:01.087Z",
        "updatedAt": "2023-01-04T16:00:01.087Z"
    },
    {
        "id": "63b5a281971aff9946133a3f",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.288417745821794,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T16:00:01.087Z",
        "updatedAt": "2023-01-04T16:00:01.087Z"
    },
    {
        "id": "63b5a281971aff9946133a3e",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T16:00:00.029+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T11:00:00.030-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.13348825914385265,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T16:00:01.087Z",
        "updatedAt": "2023-01-04T16:00:01.087Z"
    },
    {
        "id": "63b5a154971aff9946133a36",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8325265100940642,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T15:55:00.956Z",
        "updatedAt": "2023-01-04T15:55:00.956Z"
    },
    {
        "id": "63b5a029971aff9946133a35",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.9532449137838022,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:50:01.780Z",
        "updatedAt": "2023-01-04T15:50:01.780Z"
    },
    {
        "id": "63b59efd971aff9946133a30",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6711974247439754,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:45:01.532Z",
        "updatedAt": "2023-01-04T15:45:01.532Z"
    },
    {
        "id": "63b59dd0971aff9946133a2b",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7156907408212854,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T15:40:00.495Z",
        "updatedAt": "2023-01-04T15:40:00.495Z"
    },
    {
        "id": "63b59ca5971aff9946133a2a",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.0422956767507332,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:35:01.189Z",
        "updatedAt": "2023-01-04T15:35:01.189Z"
    },
    {
        "id": "63b59b79971aff9946133a25",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6839063641561964,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:30:01.018Z",
        "updatedAt": "2023-01-04T15:30:01.019Z"
    },
    {
        "id": "63b59a4d971aff9946133a20",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4998166665263015,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "4SW9W9",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "4SW9W9",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "4SW9W9",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:25:01.819Z",
        "updatedAt": "2023-01-04T15:25:01.819Z"
    },
    {
        "id": "63b59921971aff9946133a1c",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7077366697703624,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:20:01.748Z",
        "updatedAt": "2023-01-04T15:20:01.748Z"
    },
    {
        "id": "63b597f5971aff9946133a16",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8613437462386975,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "4SW9W9",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "4SW9W9",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "4SW9W9",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:15:01.493Z",
        "updatedAt": "2023-01-04T15:15:01.493Z"
    },
    {
        "id": "63b596c9971aff9946133a12",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.08112561568651944,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:10:01.398Z",
        "updatedAt": "2023-01-04T15:10:01.398Z"
    },
    {
        "id": "63b5959e971aff9946133a0d",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7582857487643786,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T15:05:02.383Z",
        "updatedAt": "2023-01-04T15:05:02.383Z"
    },
    {
        "id": "63b59470971aff9946133a07",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.38146771068831375,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T15:00:00.805Z",
        "updatedAt": "2023-01-04T15:00:00.805Z"
    },
    {
        "id": "63b59470971aff9946133a06",
        "taskLabel": "investigator_end-of-day notice",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "criteria": {
                            "idList": [
                                "SV_5c09fEzWBtL1ZYy"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 5
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_5c09fEzWBtL1ZYy": []
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "criteria": {
                            "period": {
                                "start": {
                                    "reference": "activateAtDate",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 5
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "activateAtDate",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 42
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T15:00:00.175+00:00",
                        "validInterval": {
                            "s": "2022-12-03T00:00:00.000-06:00",
                            "e": "2023-01-10T00:00:00.000-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.5324855165341829,
            "theChoice": {
                "value": true,
                "chance": 1,
                "action": {
                    "type": "messageLabelToResearchInvestigator",
                    "messageLabel": "investigator_20",
                    "messageGroup": "",
                    "avoidHistory": false,
                    "surveyType": "",
                    "surveyLink": ""
                }
            }
        },
        "messageLabel": "investigator_20",
        "executionResult": {
            "type": "twilio",
            "value": {
                "body": "test2 has missed for 5 consecutive days of End-of-day survey. Give this person a call. ",
                "numSegments": "0",
                "direction": "outbound-api",
                "from": null,
                "to": "+18474522224",
                "dateUpdated": "2023-01-04T15:00:00.000Z",
                "price": null,
                "errorMessage": null,
                "uri": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SMc90d80a3896ed7d418008f4c14ed813d.json",
                "accountSid": "AC74873bd3ac4b62dbe6ef1d44f6ee2a99",
                "numMedia": "0",
                "status": "accepted",
                "messagingServiceSid": "MG05ede0540932555ae0e1b9b88876a30f",
                "sid": "SMc90d80a3896ed7d418008f4c14ed813d",
                "dateSent": null,
                "dateCreated": "2023-01-04T15:00:00.000Z",
                "errorCode": null,
                "priceUnit": null,
                "apiVersion": "2010-04-01",
                "subresourceUris": {
                    "media": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SMc90d80a3896ed7d418008f4c14ed813d/Media.json"
                }
            }
        },
        "createdAt": "2023-01-04T15:00:00.805Z",
        "updatedAt": "2023-01-04T15:00:00.805Z"
    },
    {
        "id": "63b59470971aff9946133a02",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 105,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:44:54.051Z",
                            "2023-01-04T14:45:19.638Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            737,
                            525
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T15:00:00.175+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T09:00:00.176-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.49998524097104613,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T15:00:00.804Z",
        "updatedAt": "2023-01-04T15:00:00.805Z"
    },
    {
        "id": "63b59470971aff9946133a05",
        "taskLabel": "intervention_morning nongif",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6659327178709529,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "noAction",
                    "messageLabel": "",
                    "messageGroup": "",
                    "avoidHistory": true,
                    "surveyType": "",
                    "surveyLink": ""
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T15:00:00.804Z",
        "updatedAt": "2023-01-04T15:00:00.805Z"
    },
    {
        "id": "63b59470971aff9946133a04",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T15:00:00.175+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T10:00:00.176-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.17097822954292718,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T15:00:00.804Z",
        "updatedAt": "2023-01-04T15:00:00.805Z"
    },
    {
        "id": "63b59470971aff9946133a03",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T14:25:00.397Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 235,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z",
                            "2023-01-04T11:08:01.672Z",
                            "2023-01-04T11:23:06.178Z",
                            "2023-01-04T11:38:19.181Z",
                            "2023-01-04T11:53:24.418Z",
                            "2023-01-04T12:08:29.454Z",
                            "2023-01-04T12:23:40.920Z",
                            "2023-01-04T12:38:46.262Z",
                            "2023-01-04T12:53:48.860Z",
                            "2023-01-04T13:08:54.740Z",
                            "2023-01-04T13:24:02.570Z",
                            "2023-01-04T13:39:07.879Z",
                            "2023-01-04T13:54:16.963Z",
                            "2023-01-04T14:09:22.283Z",
                            "2023-01-04T14:24:29.001Z",
                            "2023-01-04T14:39:39.311Z",
                            "2023-01-04T14:54:45.192Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            592
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T15:00:00.175+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T10:00:00.176-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.047386849901261074,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T15:00:00.804Z",
        "updatedAt": "2023-01-04T15:00:00.805Z"
    },
    {
        "id": "63b59470971aff9946133a01",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 1,
                        "messageSentTimeList": [
                            "2023-01-04T14:00:01.245Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 38,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T15:00:00.175+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T10:00:00.176-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.7757235638558302,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T15:00:00.804Z",
        "updatedAt": "2023-01-04T15:00:00.805Z"
    },
    {
        "id": "63b59344971aff9946133a00",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.0414712667534034,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T14:55:00.920Z",
        "updatedAt": "2023-01-04T14:55:00.920Z"
    },
    {
        "id": "63b59219971aff99461339fb",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8594830236371609,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T14:50:01.900Z",
        "updatedAt": "2023-01-04T14:50:01.900Z"
    },
    {
        "id": "63b590ed971aff99461339f3",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8971585645938667,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-03"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-03"
                        },
                        {
                            "value": "success",
                            "ownerId": "9BK4CS",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-03"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T14:45:01.684Z",
        "updatedAt": "2023-01-04T14:45:01.684Z"
    },
    {
        "id": "63b58fc1971aff99461339ed",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.07552821067729609,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T14:40:01.536Z",
        "updatedAt": "2023-01-04T14:40:01.536Z"
    },
    {
        "id": "63b58e94971aff99461339e8",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4603448670000012,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T14:35:00.474Z",
        "updatedAt": "2023-01-04T14:35:00.474Z"
    },
    {
        "id": "63b58d68971aff99461339e7",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.921521299840302,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T14:30:00.388Z",
        "updatedAt": "2023-01-04T14:30:00.388Z"
    },
    {
        "id": "63b58c3d971aff99461339e6",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.2358882983131534,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T14:25:01.114Z",
        "updatedAt": "2023-01-04T14:25:01.114Z"
    },
    {
        "id": "63b58b10971aff99461339e1",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.14543369899237368,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T14:20:00.980Z",
        "updatedAt": "2023-01-04T14:20:00.980Z"
    },
    {
        "id": "63b589e4971aff99461339e0",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.43057062616660446,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T14:15:00.836Z",
        "updatedAt": "2023-01-04T14:15:00.836Z"
    },
    {
        "id": "63b588b9971aff99461339df",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.005717767205062563,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T14:10:01.608Z",
        "updatedAt": "2023-01-04T14:10:01.608Z"
    },
    {
        "id": "63b5878c971aff99461339da",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.3605810420821174,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T14:05:00.520Z",
        "updatedAt": "2023-01-04T14:05:00.520Z"
    },
    {
        "id": "63b58661971aff99461339d4",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T14:00:00.292+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T09:00:00.293-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.2760438727474539,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d1",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 38,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T14:00:00.292+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T09:00:00.293-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6978025899910951,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T14:00:01.244Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d8",
        "taskLabel": "investigator_fitbit wearing notice",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "not any",
                            "wearingLowerBoundMinutes": 480,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 6
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.9069631633896018,
            "theChoice": {
                "value": true,
                "chance": 1,
                "action": {
                    "type": "messageLabelToResearchInvestigator",
                    "messageLabel": "investigator_19",
                    "messageGroup": "",
                    "avoidHistory": false,
                    "surveyType": "",
                    "surveyLink": ""
                }
            }
        },
        "messageLabel": "investigator_19",
        "executionResult": {
            "type": "twilio",
            "value": {
                "body": "test4 has accumulated 6 consecutive days of Fitbit non-worn days. Give this person a call. ",
                "numSegments": "0",
                "direction": "outbound-api",
                "from": null,
                "to": "+18474522224",
                "dateUpdated": "2023-01-04T14:00:01.000Z",
                "price": null,
                "errorMessage": null,
                "uri": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM5285e7cfbb876bfb31e2834772b042aa.json",
                "accountSid": "AC74873bd3ac4b62dbe6ef1d44f6ee2a99",
                "numMedia": "0",
                "status": "accepted",
                "messagingServiceSid": "MG05ede0540932555ae0e1b9b88876a30f",
                "sid": "SM5285e7cfbb876bfb31e2834772b042aa",
                "dateSent": null,
                "dateCreated": "2023-01-04T14:00:01.000Z",
                "errorCode": null,
                "priceUnit": null,
                "apiVersion": "2010-04-01",
                "subresourceUris": {
                    "media": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM5285e7cfbb876bfb31e2834772b042aa/Media.json"
                }
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d5",
        "taskLabel": "investigator_end-of-day notice",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "criteria": {
                            "idList": [
                                "SV_5c09fEzWBtL1ZYy"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 5
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_5c09fEzWBtL1ZYy": []
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "criteria": {
                            "period": {
                                "start": {
                                    "reference": "activateAtDate",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 5
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "activateAtDate",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 42
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T14:00:00.292+00:00",
                        "validInterval": {
                            "s": "2022-12-03T00:00:00.000-05:00",
                            "e": "2023-01-10T00:00:00.000-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.3769167290757274,
            "theChoice": {
                "value": true,
                "chance": 1,
                "action": {
                    "type": "messageLabelToResearchInvestigator",
                    "messageLabel": "investigator_20",
                    "messageGroup": "",
                    "avoidHistory": false,
                    "surveyType": "",
                    "surveyLink": ""
                }
            }
        },
        "messageLabel": "investigator_20",
        "executionResult": {
            "type": "twilio",
            "value": {
                "body": "test1 has missed for 5 consecutive days of End-of-day survey. Give this person a call. ",
                "numSegments": "0",
                "direction": "outbound-api",
                "from": null,
                "to": "+18474522224",
                "dateUpdated": "2023-01-04T14:00:00.000Z",
                "price": null,
                "errorMessage": null,
                "uri": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SMae56b5f58e0e63854ff37930b9de6eed.json",
                "accountSid": "AC74873bd3ac4b62dbe6ef1d44f6ee2a99",
                "numMedia": "0",
                "status": "accepted",
                "messagingServiceSid": "MG05ede0540932555ae0e1b9b88876a30f",
                "sid": "SMae56b5f58e0e63854ff37930b9de6eed",
                "dateSent": null,
                "dateCreated": "2023-01-04T14:00:00.000Z",
                "errorCode": null,
                "priceUnit": null,
                "apiVersion": "2010-04-01",
                "subresourceUris": {
                    "media": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SMae56b5f58e0e63854ff37930b9de6eed/Media.json"
                }
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d7",
        "taskLabel": "investigator_fitbit wearing notice",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "not any",
                            "wearingLowerBoundMinutes": 480,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 6
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6391153252013586,
            "theChoice": {
                "value": true,
                "chance": 1,
                "action": {
                    "type": "messageLabelToResearchInvestigator",
                    "messageLabel": "investigator_19",
                    "messageGroup": "",
                    "avoidHistory": false,
                    "surveyType": "",
                    "surveyLink": ""
                }
            }
        },
        "messageLabel": "investigator_19",
        "executionResult": {
            "type": "twilio",
            "value": {
                "body": "test1 has accumulated 6 consecutive days of Fitbit non-worn days. Give this person a call. ",
                "numSegments": "0",
                "direction": "outbound-api",
                "from": null,
                "to": "+18474522224",
                "dateUpdated": "2023-01-04T14:00:00.000Z",
                "price": null,
                "errorMessage": null,
                "uri": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM06059f9814df0da221e6958ede40ed1e.json",
                "accountSid": "AC74873bd3ac4b62dbe6ef1d44f6ee2a99",
                "numMedia": "0",
                "status": "accepted",
                "messagingServiceSid": "MG05ede0540932555ae0e1b9b88876a30f",
                "sid": "SM06059f9814df0da221e6958ede40ed1e",
                "dateSent": null,
                "dateCreated": "2023-01-04T14:00:00.000Z",
                "errorCode": null,
                "priceUnit": null,
                "apiVersion": "2010-04-01",
                "subresourceUris": {
                    "media": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM06059f9814df0da221e6958ede40ed1e/Media.json"
                }
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d6",
        "taskLabel": "investigator_end-of-day notice",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T06:25:00.506Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "criteria": {
                            "idList": [
                                "SV_5c09fEzWBtL1ZYy"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 5
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_5c09fEzWBtL1ZYy": []
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "criteria": {
                            "period": {
                                "start": {
                                    "reference": "activateAtDate",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 5
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "activateAtDate",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 42
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T14:00:00.292+00:00",
                        "validInterval": {
                            "s": "2022-12-03T00:00:00.000-05:00",
                            "e": "2023-01-10T00:00:00.000-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.22272217035903852,
            "theChoice": {
                "value": true,
                "chance": 1,
                "action": {
                    "type": "messageLabelToResearchInvestigator",
                    "messageLabel": "investigator_20",
                    "messageGroup": "",
                    "avoidHistory": false,
                    "surveyType": "",
                    "surveyLink": ""
                }
            }
        },
        "messageLabel": "investigator_20",
        "executionResult": {
            "type": "twilio",
            "value": {
                "body": "test3 has missed for 5 consecutive days of End-of-day survey. Give this person a call. ",
                "numSegments": "0",
                "direction": "outbound-api",
                "from": null,
                "to": "+18474522224",
                "dateUpdated": "2023-01-04T14:00:00.000Z",
                "price": null,
                "errorMessage": null,
                "uri": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM4ab7f8a7cd8bca8fb0c24a1f5177e9b5.json",
                "accountSid": "AC74873bd3ac4b62dbe6ef1d44f6ee2a99",
                "numMedia": "0",
                "status": "accepted",
                "messagingServiceSid": "MG05ede0540932555ae0e1b9b88876a30f",
                "sid": "SM4ab7f8a7cd8bca8fb0c24a1f5177e9b5",
                "dateSent": null,
                "dateCreated": "2023-01-04T14:00:00.000Z",
                "errorCode": null,
                "priceUnit": null,
                "apiVersion": "2010-04-01",
                "subresourceUris": {
                    "media": "/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM4ab7f8a7cd8bca8fb0c24a1f5177e9b5/Media.json"
                }
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d9",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.1794267621565333,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d3",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T06:25:00.506Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 231,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z",
                            "2023-01-04T11:08:01.672Z",
                            "2023-01-04T11:23:06.178Z",
                            "2023-01-04T11:38:19.181Z",
                            "2023-01-04T11:53:24.418Z",
                            "2023-01-04T12:08:29.454Z",
                            "2023-01-04T12:23:40.920Z",
                            "2023-01-04T12:38:46.262Z",
                            "2023-01-04T12:53:48.860Z",
                            "2023-01-04T13:08:54.740Z",
                            "2023-01-04T13:24:02.570Z",
                            "2023-01-04T13:39:07.879Z",
                            "2023-01-04T13:54:16.963Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            531
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T14:00:00.292+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T09:00:00.293-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.0986877841982674,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58661971aff99461339d2",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 102,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            738,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T14:00:00.292+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T08:00:00.293-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.5359201225213532,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T14:00:01.245Z",
        "updatedAt": "2023-01-04T14:00:01.245Z"
    },
    {
        "id": "63b58534971aff99461339d0",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.9913651614838683,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T13:55:00.994Z",
        "updatedAt": "2023-01-04T13:55:00.994Z"
    },
    {
        "id": "63b58409971aff99461339cb",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.08438311399020026,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:50:01.035Z",
        "updatedAt": "2023-01-04T13:50:01.035Z"
    },
    {
        "id": "63b582dc971aff99461339ca",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.31707557285285715,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:45:00.868Z",
        "updatedAt": "2023-01-04T13:45:00.868Z"
    },
    {
        "id": "63b581b1971aff99461339c9",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6007012512576619,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T13:40:01.579Z",
        "updatedAt": "2023-01-04T13:40:01.579Z"
    },
    {
        "id": "63b58084971aff99461339c4",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.40255101381683445,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:35:00.552Z",
        "updatedAt": "2023-01-04T13:35:00.552Z"
    },
    {
        "id": "63b57f58971aff99461339c3",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4219880700709888,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:30:00.455Z",
        "updatedAt": "2023-01-04T13:30:00.455Z"
    },
    {
        "id": "63b57f58971aff99461339c2",
        "taskLabel": "intervention_morning gif",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T06:25:00.506Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6743590855638957,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T13:30:00.455Z",
        "updatedAt": "2023-01-04T13:30:00.455Z"
    },
    {
        "id": "63b57e2d971aff99461339c1",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7715608910459686,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T13:25:01.054Z",
        "updatedAt": "2023-01-04T13:25:01.054Z"
    },
    {
        "id": "63b57d00971aff99461339bc",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.1626431787479874,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:20:00.077Z",
        "updatedAt": "2023-01-04T13:20:00.077Z"
    },
    {
        "id": "63b57bd4971aff99461339bb",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.19071699404889397,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:15:00.925Z",
        "updatedAt": "2023-01-04T13:15:00.925Z"
    },
    {
        "id": "63b57aa9971aff99461339ba",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7798115211314707,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T13:10:01.640Z",
        "updatedAt": "2023-01-04T13:10:01.640Z"
    },
    {
        "id": "63b5797c971aff99461339b5",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.9274733261261381,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:05:00.619Z",
        "updatedAt": "2023-01-04T13:05:00.619Z"
    },
    {
        "id": "63b57850971aff99461339b2",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T13:00:00.377+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T08:00:00.378-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.003569962053088682,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T13:00:00.892Z",
        "updatedAt": "2023-01-04T13:00:00.893Z"
    },
    {
        "id": "63b57850971aff99461339b3",
        "taskLabel": "intervention_morning gif",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.9141235102923666,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T13:00:00.892Z",
        "updatedAt": "2023-01-04T13:00:00.893Z"
    },
    {
        "id": "63b57850971aff99461339b4",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7158000418608057,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T13:00:00.893Z",
        "updatedAt": "2023-01-04T13:00:00.893Z"
    },
    {
        "id": "63b57850971aff99461339b0",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 102,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            738,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T13:00:00.377+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T07:00:00.378-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.7793492619613622,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T13:00:00.892Z",
        "updatedAt": "2023-01-04T13:00:00.893Z"
    },
    {
        "id": "63b57850971aff99461339b1",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T06:25:00.506Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 227,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z",
                            "2023-01-04T11:08:01.672Z",
                            "2023-01-04T11:23:06.178Z",
                            "2023-01-04T11:38:19.181Z",
                            "2023-01-04T11:53:24.418Z",
                            "2023-01-04T12:08:29.454Z",
                            "2023-01-04T12:23:40.920Z",
                            "2023-01-04T12:38:46.262Z",
                            "2023-01-04T12:53:48.860Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            470
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T13:00:00.377+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T08:00:00.378-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.7667323772037622,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T13:00:00.892Z",
        "updatedAt": "2023-01-04T13:00:00.893Z"
    },
    {
        "id": "63b57850971aff99461339af",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 38,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T13:00:00.377+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T08:00:00.378-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.35016417717479564,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T13:00:00.892Z",
        "updatedAt": "2023-01-04T13:00:00.893Z"
    },
    {
        "id": "63b57725971aff99461339ae",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5924021956443422,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T12:55:01.131Z",
        "updatedAt": "2023-01-04T12:55:01.131Z"
    },
    {
        "id": "63b575f8971aff99461339a9",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8348904354546438,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:50:00.110Z",
        "updatedAt": "2023-01-04T12:50:00.110Z"
    },
    {
        "id": "63b574cc971aff99461339a8",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.555474824399075,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:45:00.964Z",
        "updatedAt": "2023-01-04T12:45:00.964Z"
    },
    {
        "id": "63b573a1971aff99461339a7",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8028939592990239,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T12:40:01.608Z",
        "updatedAt": "2023-01-04T12:40:01.608Z"
    },
    {
        "id": "63b57274971aff99461339a2",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8046285374564002,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:35:00.650Z",
        "updatedAt": "2023-01-04T12:35:00.650Z"
    },
    {
        "id": "63b57148971aff99461339a1",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.6908316965601946,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:30:00.473Z",
        "updatedAt": "2023-01-04T12:30:00.473Z"
    },
    {
        "id": "63b5701d971aff99461339a0",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.1240381773284096,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T12:25:01.207Z",
        "updatedAt": "2023-01-04T12:25:01.207Z"
    },
    {
        "id": "63b56ef0971aff994613399b",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.8944207210725805,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:20:00.145Z",
        "updatedAt": "2023-01-04T12:20:00.145Z"
    },
    {
        "id": "63b56dc5971aff994613399a",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.36990683440729555,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:15:01.009Z",
        "updatedAt": "2023-01-04T12:15:01.009Z"
    },
    {
        "id": "63b56c99971aff9946133999",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4165859826069569,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T12:10:01.631Z",
        "updatedAt": "2023-01-04T12:10:01.631Z"
    },
    {
        "id": "63b56b6c971aff9946133994",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.35246458967117533,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:05:00.695Z",
        "updatedAt": "2023-01-04T12:05:00.695Z"
    },
    {
        "id": "63b56a40971aff9946133992",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T12:00:00.454+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T07:00:00.455-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6923275813586969,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T12:00:00.927Z",
        "updatedAt": "2023-01-04T12:00:00.928Z"
    },
    {
        "id": "63b56a40971aff994613398f",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 38,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T12:00:00.454+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T07:00:00.455-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6038678826238923,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T12:00:00.927Z",
        "updatedAt": "2023-01-04T12:00:00.928Z"
    },
    {
        "id": "63b56a40971aff9946133990",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 102,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            738,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T12:00:00.454+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T06:00:00.455-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6754841137566616,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T12:00:00.927Z",
        "updatedAt": "2023-01-04T12:00:00.928Z"
    },
    {
        "id": "63b56a40971aff9946133991",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T06:25:00.506Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 223,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z",
                            "2023-01-04T11:08:01.672Z",
                            "2023-01-04T11:23:06.178Z",
                            "2023-01-04T11:38:19.181Z",
                            "2023-01-04T11:53:24.418Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            409
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T12:00:00.454+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T07:00:00.455-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.6790476570269641,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T12:00:00.927Z",
        "updatedAt": "2023-01-04T12:00:00.928Z"
    },
    {
        "id": "63b56a40971aff9946133993",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.2763257059393278,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T12:00:00.927Z",
        "updatedAt": "2023-01-04T12:00:00.928Z"
    },
    {
        "id": "63b56915971aff994613398e",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.18491850383515862,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T11:55:01.199Z",
        "updatedAt": "2023-01-04T11:55:01.199Z"
    },
    {
        "id": "63b567e8971aff9946133989",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4333095850286428,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:50:00.211Z",
        "updatedAt": "2023-01-04T11:50:00.211Z"
    },
    {
        "id": "63b566bd971aff9946133988",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5880291664460493,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:45:01.056Z",
        "updatedAt": "2023-01-04T11:45:01.056Z"
    },
    {
        "id": "63b56591971aff9946133987",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.719643058708477,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T11:40:01.747Z",
        "updatedAt": "2023-01-04T11:40:01.747Z"
    },
    {
        "id": "63b56464971aff9946133982",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.02268431135653315,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:35:00.741Z",
        "updatedAt": "2023-01-04T11:35:00.741Z"
    },
    {
        "id": "63b56338971aff9946133981",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.22285616801037733,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:30:00.595Z",
        "updatedAt": "2023-01-04T11:30:00.596Z"
    },
    {
        "id": "63b5620d971aff9946133980",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.9666682512873144,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T11:25:01.233Z",
        "updatedAt": "2023-01-04T11:25:01.233Z"
    },
    {
        "id": "63b560e0971aff994613397b",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7766428852290999,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:20:00.277Z",
        "updatedAt": "2023-01-04T11:20:00.277Z"
    },
    {
        "id": "63b55fb4971aff994613397a",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.21502483431274233,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:15:00.124Z",
        "updatedAt": "2023-01-04T11:15:00.125Z"
    },
    {
        "id": "63b55e89971aff9946133979",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.2871782122935882,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T11:10:01.794Z",
        "updatedAt": "2023-01-04T11:10:01.794Z"
    },
    {
        "id": "63b55d5c971aff9946133974",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.43251885204318974,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:05:00.828Z",
        "updatedAt": "2023-01-04T11:05:00.829Z"
    },
    {
        "id": "63b55c31971aff994613396f",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test1",
        "userInfoCache": {
            "username": "test1",
            "preferredName": "Pei-Yao",
            "phone": "7342773256",
            "timezone": "America/New_York",
            "phase": "intervention",
            "joinAt": "2022-10-13T02:22:01.993Z",
            "activateAt": "2022-11-29T01:00:01.739Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": false,
            "salience": false,
            "modification": false,
            "fitbitId": "4SW9W9",
            "fitbitDisplayName": "Pei-Yao H.",
            "fitbitFullName": "Pei-Yao Hung",
            "weekdayWakeup": "2022-10-12T13:00:00.223Z",
            "weekdayBed": "2022-10-13T03:00:00.650Z",
            "weekendWakeup": "2022-10-12T14:00:00.884Z",
            "weekendBed": "2022-10-13T03:30:00.285Z",
            "createdAt": "2022-10-12T21:20:54.274Z",
            "updatedAt": "2023-01-04T07:45:00.946Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-11-03T02:49:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 38,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:02:32.549Z",
                            "2023-01-02T15:25:28.235Z",
                            "2023-01-02T15:40:35.489Z",
                            "2023-01-02T15:55:44.245Z",
                            "2023-01-02T18:17:36.638Z",
                            "2023-01-03T00:18:45.528Z",
                            "2023-01-03T00:33:53.649Z",
                            "2023-01-03T01:03:08.282Z",
                            "2023-01-03T01:34:17.807Z",
                            "2023-01-03T01:49:30.208Z",
                            "2023-01-03T02:04:35.644Z",
                            "2023-01-03T02:19:41.111Z",
                            "2023-01-03T02:34:51.835Z",
                            "2023-01-03T02:49:55.853Z",
                            "2023-01-03T03:05:01.737Z",
                            "2023-01-03T03:20:14.091Z",
                            "2023-01-03T03:35:21.497Z",
                            "2023-01-03T03:50:36.451Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T06:37:44.105Z",
                            "2023-01-03T14:40:28.840Z",
                            "2023-01-03T23:48:35.477Z",
                            "2023-01-04T00:03:44.439Z",
                            "2023-01-04T00:36:05.103Z",
                            "2023-01-04T00:51:09.556Z",
                            "2023-01-04T03:44:12.649Z",
                            "2023-01-04T05:20:00.804Z",
                            "2023-01-04T05:35:07.329Z",
                            "2023-01-04T05:50:10.879Z",
                            "2023-01-04T06:05:20.889Z",
                            "2023-01-04T06:05:20.890Z",
                            "2023-01-04T06:39:19.635Z",
                            "2023-01-04T06:54:23.083Z",
                            "2023-01-04T07:09:35.395Z",
                            "2023-01-04T07:24:43.062Z",
                            "2023-01-04T07:39:50.370Z",
                            "2023-01-04T07:55:51.169Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T11:00:00.597+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T06:00:00.598-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.4506702202871704,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T11:00:01.107Z",
        "updatedAt": "2023-01-04T11:00:01.108Z"
    },
    {
        "id": "63b55c31971aff9946133970",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 102,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            738,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T11:00:00.597+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T05:00:00.598-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.05512548803148909,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T11:00:01.108Z",
        "updatedAt": "2023-01-04T11:00:01.108Z"
    },
    {
        "id": "63b55c31971aff9946133971",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T06:25:00.506Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 219,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z",
                            "2023-01-04T10:07:35.087Z",
                            "2023-01-04T10:22:42.877Z",
                            "2023-01-04T10:37:48.961Z",
                            "2023-01-04T10:52:53.475Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            349
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T11:00:00.597+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T06:00:00.598-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.07383315993717954,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T11:00:01.108Z",
        "updatedAt": "2023-01-04T11:00:01.108Z"
    },
    {
        "id": "63b55c31971aff9946133972",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T11:00:00.597+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T06:00:00.598-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.40005343899956647,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T11:00:01.108Z",
        "updatedAt": "2023-01-04T11:00:01.108Z"
    },
    {
        "id": "63b55c31971aff9946133973",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.38038801474388695,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T11:00:01.108Z",
        "updatedAt": "2023-01-04T11:00:01.108Z"
    },
    {
        "id": "63b55b05971aff994613396e",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7599389211567409,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T10:55:01.280Z",
        "updatedAt": "2023-01-04T10:55:01.280Z"
    },
    {
        "id": "63b559d8971aff9946133969",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.3218505939056464,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:50:00.362Z",
        "updatedAt": "2023-01-04T10:50:00.362Z"
    },
    {
        "id": "63b558ac971aff9946133968",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.14950733449594455,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:45:00.203Z",
        "updatedAt": "2023-01-04T10:45:00.203Z"
    },
    {
        "id": "63b55780971aff9946133967",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.014162875581921197,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T10:40:00.839Z",
        "updatedAt": "2023-01-04T10:40:00.839Z"
    },
    {
        "id": "63b55654971aff9946133962",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.28882022537522145,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:35:00.928Z",
        "updatedAt": "2023-01-04T10:35:00.928Z"
    },
    {
        "id": "63b55528971aff9946133961",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.5230844208089354,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:30:00.788Z",
        "updatedAt": "2023-01-04T10:30:00.788Z"
    },
    {
        "id": "63b553fd971aff9946133960",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.4186523069326964,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T10:25:01.327Z",
        "updatedAt": "2023-01-04T10:25:01.327Z"
    },
    {
        "id": "63b552d0971aff994613395b",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7771256874623482,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:20:00.484Z",
        "updatedAt": "2023-01-04T10:20:00.484Z"
    },
    {
        "id": "63b551a4971aff994613395a",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7286467669935448,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:15:00.321Z",
        "updatedAt": "2023-01-04T10:15:00.321Z"
    },
    {
        "id": "63b55078971aff9946133959",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.7431190768108256,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": [
                    [
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-step",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-heart",
                            "dateTime": "2023-01-04"
                        },
                        {
                            "value": "success",
                            "ownerId": "227DYD",
                            "dataType": "activity-summary",
                            "dateTime": "2023-01-04"
                        }
                    ]
                ]
            }
        },
        "createdAt": "2023-01-04T10:10:00.918Z",
        "updatedAt": "2023-01-04T10:10:00.919Z"
    },
    {
        "id": "63b54f4c971aff9946133954",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.11713610992050927,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": true
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:05:00.997Z",
        "updatedAt": "2023-01-04T10:05:00.998Z"
    },
    {
        "id": "63b54e21971aff9946133951",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test3",
        "userInfoCache": {
            "username": "test3",
            "preferredName": "Marko",
            "phone": "7343589245",
            "timezone": "America/Detroit",
            "phase": "intervention",
            "joinAt": "2022-10-19T14:12:07.802Z",
            "activateAt": "2022-11-29T01:00:01.752Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "227DYD",
            "fitbitDisplayName": "Mark N.",
            "fitbitFullName": "Mark Newman",
            "weekdayWakeup": "2022-10-19T11:30:00.978Z",
            "weekdayBed": "2022-10-19T14:00:00.414Z",
            "weekendWakeup": "2022-10-19T14:00:00.569Z",
            "weekendBed": "2022-10-19T15:00:00.670Z",
            "createdAt": "2022-10-12T21:20:56.270Z",
            "updatedAt": "2023-01-04T06:25:00.506Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 215,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T05:00:28.297Z",
                            "2023-01-02T05:15:35.037Z",
                            "2023-01-02T05:30:39.871Z",
                            "2023-01-02T05:45:48.999Z",
                            "2023-01-02T06:00:55.614Z",
                            "2023-01-02T06:16:01.653Z",
                            "2023-01-02T06:31:08.581Z",
                            "2023-01-02T06:46:16.570Z",
                            "2023-01-02T07:01:18.552Z",
                            "2023-01-02T07:16:27.625Z",
                            "2023-01-02T07:31:34.500Z",
                            "2023-01-02T07:46:43.059Z",
                            "2023-01-02T08:01:50.297Z",
                            "2023-01-02T08:16:58.091Z",
                            "2023-01-02T08:32:03.842Z",
                            "2023-01-02T08:47:08.228Z",
                            "2023-01-02T09:02:17.606Z",
                            "2023-01-02T09:17:24.563Z",
                            "2023-01-02T09:32:29.272Z",
                            "2023-01-02T09:47:34.615Z",
                            "2023-01-02T10:02:44.805Z",
                            "2023-01-02T10:17:52.328Z",
                            "2023-01-02T10:32:57.363Z",
                            "2023-01-02T10:48:07.133Z",
                            "2023-01-02T11:03:15.013Z",
                            "2023-01-02T11:18:21.931Z",
                            "2023-01-02T11:33:25.414Z",
                            "2023-01-02T11:48:35.206Z",
                            "2023-01-02T12:03:41.634Z",
                            "2023-01-02T12:18:49.251Z",
                            "2023-01-02T12:33:55.921Z",
                            "2023-01-02T12:49:03.097Z",
                            "2023-01-02T13:04:07.561Z",
                            "2023-01-02T13:19:17.354Z",
                            "2023-01-02T13:34:20.452Z",
                            "2023-01-02T13:49:31.969Z",
                            "2023-01-02T14:04:38.742Z",
                            "2023-01-02T14:19:43.335Z",
                            "2023-01-02T14:34:52.339Z",
                            "2023-01-02T14:49:55.847Z",
                            "2023-01-02T15:05:05.101Z",
                            "2023-01-02T15:20:16.187Z",
                            "2023-01-02T15:35:23.505Z",
                            "2023-01-02T15:50:29.182Z",
                            "2023-01-02T16:05:32.622Z",
                            "2023-01-02T16:20:42.087Z",
                            "2023-01-02T16:35:51.448Z",
                            "2023-01-02T16:51:04.162Z",
                            "2023-01-02T17:06:13.238Z",
                            "2023-01-02T17:21:20.381Z",
                            "2023-01-02T17:36:27.979Z",
                            "2023-01-02T17:51:35.843Z",
                            "2023-01-02T18:06:39.254Z",
                            "2023-01-02T18:21:44.230Z",
                            "2023-01-02T18:36:54.353Z",
                            "2023-01-02T18:52:02.551Z",
                            "2023-01-02T19:07:10.979Z",
                            "2023-01-02T19:14:06.478Z",
                            "2023-01-02T19:14:10.961Z",
                            "2023-01-02T19:29:23.765Z",
                            "2023-01-02T19:44:32.368Z",
                            "2023-01-02T19:59:47.688Z",
                            "2023-01-02T20:14:54.415Z",
                            "2023-01-02T20:30:01.612Z",
                            "2023-01-02T20:45:08.474Z",
                            "2023-01-02T21:00:20.060Z",
                            "2023-01-02T21:15:32.236Z",
                            "2023-01-02T21:30:40.598Z",
                            "2023-01-02T21:45:47.777Z",
                            "2023-01-02T22:00:56.424Z",
                            "2023-01-02T22:16:05.118Z",
                            "2023-01-02T22:31:10.789Z",
                            "2023-01-02T22:46:21.956Z",
                            "2023-01-02T23:01:26.900Z",
                            "2023-01-02T23:16:32.779Z",
                            "2023-01-02T23:31:37.042Z",
                            "2023-01-02T23:46:44.641Z",
                            "2023-01-03T00:01:52.156Z",
                            "2023-01-03T00:17:03.639Z",
                            "2023-01-03T00:32:12.181Z",
                            "2023-01-03T00:47:19.250Z",
                            "2023-01-03T01:02:23.169Z",
                            "2023-01-03T01:17:36.259Z",
                            "2023-01-03T01:32:44.418Z",
                            "2023-01-03T01:47:51.193Z",
                            "2023-01-03T02:02:55.662Z",
                            "2023-01-03T02:18:05.996Z",
                            "2023-01-03T02:33:10.364Z",
                            "2023-01-03T02:48:18.334Z",
                            "2023-01-03T03:03:28.856Z",
                            "2023-01-03T03:18:38.181Z",
                            "2023-01-03T03:33:43.665Z",
                            "2023-01-03T03:48:46.021Z",
                            "2023-01-03T04:03:57.693Z",
                            "2023-01-03T04:19:01.968Z",
                            "2023-01-03T04:34:09.026Z",
                            "2023-01-03T04:49:18.477Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:04:24.198Z",
                            "2023-01-03T05:19:30.555Z",
                            "2023-01-03T05:34:38.793Z",
                            "2023-01-03T05:49:48.142Z",
                            "2023-01-03T06:04:55.045Z",
                            "2023-01-03T06:20:02.073Z",
                            "2023-01-03T06:35:09.197Z",
                            "2023-01-03T06:50:15.633Z",
                            "2023-01-03T07:05:18.898Z",
                            "2023-01-03T07:20:25.308Z",
                            "2023-01-03T07:35:31.306Z",
                            "2023-01-03T07:50:43.746Z",
                            "2023-01-03T08:05:51.160Z",
                            "2023-01-03T08:20:57.092Z",
                            "2023-01-03T08:36:01.431Z",
                            "2023-01-03T08:51:05.805Z",
                            "2023-01-03T09:06:13.786Z",
                            "2023-01-03T09:21:23.080Z",
                            "2023-01-03T09:36:31.051Z",
                            "2023-01-03T09:51:38.496Z",
                            "2023-01-03T10:06:43.344Z",
                            "2023-01-03T10:21:52.255Z",
                            "2023-01-03T10:36:56.498Z",
                            "2023-01-03T10:52:04.943Z",
                            "2023-01-03T11:07:12.732Z",
                            "2023-01-03T11:22:20.280Z",
                            "2023-01-03T11:37:29.265Z",
                            "2023-01-03T11:52:35.702Z",
                            "2023-01-03T12:07:40.923Z",
                            "2023-01-03T12:22:48.283Z",
                            "2023-01-03T12:37:54.749Z",
                            "2023-01-03T12:53:00.472Z",
                            "2023-01-03T13:08:07.767Z",
                            "2023-01-03T13:23:16.816Z",
                            "2023-01-03T13:38:27.245Z",
                            "2023-01-03T13:53:31.202Z",
                            "2023-01-03T14:08:38.938Z",
                            "2023-01-03T14:23:48.301Z",
                            "2023-01-03T14:38:55.280Z",
                            "2023-01-03T14:54:02.214Z",
                            "2023-01-03T15:09:09.750Z",
                            "2023-01-03T15:24:14.257Z",
                            "2023-01-03T15:39:23.699Z",
                            "2023-01-03T15:54:26.180Z",
                            "2023-01-03T16:09:33.725Z",
                            "2023-01-03T16:24:44.909Z",
                            "2023-01-03T16:39:50.192Z",
                            "2023-01-03T16:55:08.501Z",
                            "2023-01-03T17:10:15.464Z",
                            "2023-01-03T17:25:24.878Z",
                            "2023-01-03T17:40:30.168Z",
                            "2023-01-03T17:55:38.911Z",
                            "2023-01-03T18:10:48.258Z",
                            "2023-01-03T18:14:00.103Z",
                            "2023-01-03T18:29:06.728Z",
                            "2023-01-03T18:44:12.592Z",
                            "2023-01-03T18:59:14.638Z",
                            "2023-01-03T19:14:21.170Z",
                            "2023-01-03T19:29:29.594Z",
                            "2023-01-03T19:44:36.068Z",
                            "2023-01-03T19:59:43.527Z",
                            "2023-01-03T20:14:55.045Z",
                            "2023-01-03T20:30:04.137Z",
                            "2023-01-03T20:45:13.382Z",
                            "2023-01-03T21:00:19.695Z",
                            "2023-01-03T21:15:27.407Z",
                            "2023-01-03T21:30:33.493Z",
                            "2023-01-03T21:45:44.696Z",
                            "2023-01-03T22:00:48.062Z",
                            "2023-01-03T22:16:01.031Z",
                            "2023-01-03T22:31:07.837Z",
                            "2023-01-03T22:46:13.237Z",
                            "2023-01-03T23:01:20.766Z",
                            "2023-01-03T23:16:27.196Z",
                            "2023-01-03T23:31:37.409Z",
                            "2023-01-03T23:46:41.360Z",
                            "2023-01-04T00:01:56.793Z",
                            "2023-01-04T00:17:11.662Z",
                            "2023-01-04T00:32:15.980Z",
                            "2023-01-04T00:47:23.642Z",
                            "2023-01-04T01:02:31.755Z",
                            "2023-01-04T01:17:41.037Z",
                            "2023-01-04T01:32:49.229Z",
                            "2023-01-04T01:47:56.327Z",
                            "2023-01-04T02:03:01.435Z",
                            "2023-01-04T02:18:09.310Z",
                            "2023-01-04T02:33:21.653Z",
                            "2023-01-04T02:48:24.843Z",
                            "2023-01-04T03:03:34.548Z",
                            "2023-01-04T03:18:44.418Z",
                            "2023-01-04T03:33:50.951Z",
                            "2023-01-04T03:48:58.739Z",
                            "2023-01-04T04:04:06.533Z",
                            "2023-01-04T04:19:14.717Z",
                            "2023-01-04T04:34:22.166Z",
                            "2023-01-04T04:49:28.994Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:04:38.152Z",
                            "2023-01-04T05:19:42.172Z",
                            "2023-01-04T05:34:49.810Z",
                            "2023-01-04T05:49:58.828Z",
                            "2023-01-04T06:05:02.339Z",
                            "2023-01-04T06:20:09.961Z",
                            "2023-01-04T06:35:19.490Z",
                            "2023-01-04T06:50:24.066Z",
                            "2023-01-04T07:05:32.209Z",
                            "2023-01-04T07:20:38.404Z",
                            "2023-01-04T07:35:49.715Z",
                            "2023-01-04T07:50:56.516Z",
                            "2023-01-04T08:06:04.166Z",
                            "2023-01-04T08:21:14.857Z",
                            "2023-01-04T08:36:15.518Z",
                            "2023-01-04T08:51:26.936Z",
                            "2023-01-04T09:06:46.518Z",
                            "2023-01-04T09:22:12.447Z",
                            "2023-01-04T09:37:16.949Z",
                            "2023-01-04T09:52:28.100Z"
                        ]
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            1414,
                            1416,
                            887,
                            966,
                            1428,
                            1428,
                            1440,
                            290
                        ],
                        "resultList": [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T10:00:00.759+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T05:00:00.760-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.9665477125773194,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T10:00:01.178Z",
        "updatedAt": "2023-01-04T10:00:01.179Z"
    },
    {
        "id": "63b54e21971aff9946133952",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test4",
        "userInfoCache": {
            "username": "test4",
            "preferredName": "Pedja",
            "phone": "2066614079",
            "timezone": "America/Detroit",
            "phase": "baseline",
            "joinAt": "2022-10-19T14:10:53.098Z",
            "activateAt": null,
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "4YMR3J",
            "fitbitDisplayName": "Pedja K.",
            "fitbitFullName": "Pedja K",
            "weekdayWakeup": "2022-10-19T11:30:00.618Z",
            "weekdayBed": "2022-10-20T03:30:00.425Z",
            "weekendWakeup": "2022-10-19T12:00:00.198Z",
            "weekendBed": "2022-10-19T04:00:00.974Z",
            "createdAt": "2022-10-12T21:20:57.271Z",
            "updatedAt": "2023-01-04T06:00:00.821Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": false,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "baseline"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-19T14:23:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 0,
                        "fitbitUpdateTimeList": []
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T10:00:00.759+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T05:00:00.760-05:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.008643559427554903,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T10:00:01.178Z",
        "updatedAt": "2023-01-04T10:00:01.179Z"
    },
    {
        "id": "63b54e21971aff9946133953",
        "taskLabel": "fitbit process notification",
        "username": "system-user",
        "userInfoCache": {
            "username": "system-user",
            "preferredName": "System User",
            "phone": "",
            "timezone": "America/Detroit",
            "phase": "intervention"
        },
        "preConditionResult": {
            "result": true,
            "recordList": []
        },
        "randomizationResult": {
            "randomNumber": 0.647248134139274,
            "theChoice": {
                "value": true,
                "chance": 0.5,
                "action": {
                    "type": "processFitbitUpdate",
                    "prioritizeSystemUpdate": true,
                    "favorRecent": false
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "fitbit-process-update",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": []
            }
        },
        "createdAt": "2023-01-04T10:00:01.178Z",
        "updatedAt": "2023-01-04T10:00:01.179Z"
    },
    {
        "id": "63b54e21971aff9946133950",
        "taskLabel": "Testing: all conditions with no action but logs",
        "username": "test2",
        "userInfoCache": {
            "username": "test2",
            "preferredName": "Soo",
            "phone": "8474522224",
            "timezone": "America/Chicago",
            "phase": "intervention",
            "joinAt": "2022-10-12T21:22:32.991Z",
            "activateAt": "2022-11-29T02:00:01.152Z",
            "fitbitReminderTurnOff": true,
            "saveWalkToJoyToContacts": true,
            "gif": true,
            "salience": true,
            "modification": true,
            "fitbitId": "9BK4CS",
            "fitbitDisplayName": "Serisse C.",
            "fitbitFullName": "Serisse Choi",
            "weekdayWakeup": "2022-10-12T11:00:00.387Z",
            "weekdayBed": "2022-10-12T04:00:00.802Z",
            "weekendWakeup": "2022-10-12T11:30:00.072Z",
            "weekendBed": "2022-10-12T04:00:00.495Z",
            "createdAt": "2022-10-12T21:20:55.270Z",
            "updatedAt": "2023-01-04T07:00:00.636Z"
        },
        "preConditionResult": {
            "result": true,
            "recordList": [
                {
                    "result": true,
                    "condition": {
                        "type": "person",
                        "opposite": false,
                        "criteria": {
                            "phase": "intervention"
                        }
                    },
                    "record": {
                        "userInfoPartial": {
                            "phase": "intervention"
                        }
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "surveyFilledByThisPerson",
                        "opposite": false,
                        "criteria": {
                            "idList": [
                                "SV_81aWO5sJPDhGZNA"
                            ],
                            "idRelationship": "not any",
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "surveyResponseTimeListMap": {
                            "SV_81aWO5sJPDhGZNA": [
                                "2022-10-15T10:54:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z",
                                "2022-10-14T16:22:00.000Z"
                            ]
                        }
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "messageSentDuringPeriod",
                        "opposite": true,
                        "criteria": {
                            "messageLabel": "investigator_19",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "messageSentCount": 0,
                        "messageSentTimeList": []
                    }
                },
                {
                    "result": false,
                    "condition": {
                        "type": "hasFitbitUpdateForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 2
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "hours": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "fitbitUpdateCount": 102,
                        "fitbitUpdateTimeList": [
                            "2023-01-02T13:03:30.012Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T13:03:30.013Z",
                            "2023-01-02T16:31:07.850Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:31:07.851Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.066Z",
                            "2023-01-02T16:32:08.067Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:32:58.855Z",
                            "2023-01-02T16:48:12.072Z",
                            "2023-01-02T17:03:19.060Z",
                            "2023-01-02T17:18:24.906Z",
                            "2023-01-02T17:33:32.352Z",
                            "2023-01-02T17:48:42.733Z",
                            "2023-01-02T18:03:48.603Z",
                            "2023-01-02T18:18:55.547Z",
                            "2023-01-02T18:34:02.727Z",
                            "2023-01-02T18:49:12.282Z",
                            "2023-01-02T19:04:17.132Z",
                            "2023-01-02T19:19:25.524Z",
                            "2023-01-02T19:34:33.542Z",
                            "2023-01-02T19:49:39.131Z",
                            "2023-01-02T20:04:50.602Z",
                            "2023-01-02T20:19:56.772Z",
                            "2023-01-02T20:35:03.040Z",
                            "2023-01-02T20:50:13.425Z",
                            "2023-01-02T21:05:17.972Z",
                            "2023-01-02T21:20:30.517Z",
                            "2023-01-02T21:35:38.874Z",
                            "2023-01-02T21:50:43.825Z",
                            "2023-01-02T22:05:51.142Z",
                            "2023-01-02T22:21:00.769Z",
                            "2023-01-02T22:36:07.351Z",
                            "2023-01-02T22:51:17.600Z",
                            "2023-01-02T23:06:25.089Z",
                            "2023-01-02T23:21:31.486Z",
                            "2023-01-02T23:36:36.954Z",
                            "2023-01-02T23:51:48.647Z",
                            "2023-01-03T00:06:48.473Z",
                            "2023-01-03T00:21:56.896Z",
                            "2023-01-03T00:36:55.372Z",
                            "2023-01-03T00:52:01.914Z",
                            "2023-01-03T01:07:06.952Z",
                            "2023-01-03T01:22:17.015Z",
                            "2023-01-03T01:37:20.543Z",
                            "2023-01-03T01:52:29.593Z",
                            "2023-01-03T02:07:35.451Z",
                            "2023-01-03T02:22:45.955Z",
                            "2023-01-03T02:37:53.537Z",
                            "2023-01-03T02:53:05.083Z",
                            "2023-01-03T03:08:11.459Z",
                            "2023-01-03T03:23:18.781Z",
                            "2023-01-03T03:38:26.845Z",
                            "2023-01-03T03:53:35.762Z",
                            "2023-01-03T04:08:45.725Z",
                            "2023-01-03T04:23:52.680Z",
                            "2023-01-03T04:39:00.534Z",
                            "2023-01-03T04:54:04.303Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:09:13.150Z",
                            "2023-01-03T05:24:21.708Z",
                            "2023-01-03T05:39:27.153Z",
                            "2023-01-03T12:51:05.513Z",
                            "2023-01-03T14:00:44.269Z",
                            "2023-01-03T14:01:01.326Z",
                            "2023-01-03T14:15:21.932Z",
                            "2023-01-03T14:30:34.673Z",
                            "2023-01-03T14:36:34.472Z",
                            "2023-01-03T14:51:41.035Z",
                            "2023-01-03T15:06:49.913Z",
                            "2023-01-03T15:21:59.161Z",
                            "2023-01-03T15:37:03.040Z",
                            "2023-01-03T15:52:13.061Z",
                            "2023-01-03T16:07:17.022Z",
                            "2023-01-03T16:16:27.810Z",
                            "2023-01-03T16:31:32.668Z",
                            "2023-01-03T16:46:42.762Z",
                            "2023-01-03T17:01:47.297Z",
                            "2023-01-03T17:16:56.999Z",
                            "2023-01-03T17:32:03.440Z",
                            "2023-01-03T18:20:36.308Z"
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        "opposite": true,
                        "criteria": {
                            "idList": [
                                ""
                            ],
                            "idRelationship": "or",
                            "wearingLowerBoundMinutes": 480,
                            "wearingDayLowerBoundCount": 3,
                            "period": {
                                "start": {
                                    "reference": "today",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 7
                                        }
                                    }
                                },
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "minus",
                                        "value": {
                                            "days": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "minsList": [
                            0,
                            0,
                            0,
                            0,
                            44,
                            940,
                            738,
                            0
                        ],
                        "resultList": [
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            true,
                            false
                        ]
                    }
                },
                {
                    "result": true,
                    "condition": {
                        "type": "timeInPeriod",
                        "opposite": false,
                        "criteria": {
                            "period": {
                                "end": {
                                    "reference": "now",
                                    "offset": {
                                        "type": "plus",
                                        "value": {
                                            "days": 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "record": {
                        "dateTime": "2023-01-04T10:00:00.759+00:00",
                        "validInterval": {
                            "s": "2000-01-01T00:00:00.000Z",
                            "e": "2023-01-05T04:00:00.760-06:00",
                            "invalid": null,
                            "isLuxonInterval": true
                        }
                    }
                }
            ]
        },
        "randomizationResult": {
            "randomNumber": 0.608857578176399,
            "theChoice": {
                "value": false,
                "chance": 1,
                "action": {
                    "type": "noAction"
                }
            }
        },
        "messageLabel": "",
        "executionResult": {
            "type": "no-action",
            "value": {
                "status": "success",
                "errorMessage": "",
                "body": {}
            }
        },
        "createdAt": "2023-01-04T10:00:01.178Z",
        "updatedAt": "2023-01-04T10:00:01.178Z"
    }
];

let csvString = GeneralUtility.getTSVStringFromObjectList(sampleJSONObjList);

console.log(`JSON to TSV: ${csvString}`);

let dateString = DateTime.now().toISO({ format: 'basic', includeOffset: false });

fs.writeFile(`./test_output/json_to_csv_${dateString}.tsv`, csvString, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 

