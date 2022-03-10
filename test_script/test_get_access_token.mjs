"use strict";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Hapi = require("@hapi/hapi");
const twilio = require("twilio");

const Bell = require("@hapi/bell");
const Wreck = require("wreck");
const path = require("path");
const JWT = require("jwt-simple");
const crypto = require("crypto");

const axios = require('axios');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

let authCode = "534f174f92c04ef197d1f7ac7c41923b3bff4fc8";

axios({
  method: 'post',
  baseURL: 'https://api.fitbit.com/',
  url: '/oauth2/token',
  // `headers` are custom headers to be sent
  headers: {
    // now sure where this comes from?
    'Authorization': 'Basic MjM4MjlYOjA0ZTIwYzZkY2U0YTg1MjcyZWJkOTljZjQ3M2UzODA5',
    'Content-Type':'application/x-www-form-urlencoded'
  },
  params: {
    clientId: '23829X',
    grant_type: 'authorization_code',
    redirect_uri: 'https://walktojoy.net/signin',
    code: authCode
  }
})
.then(function (response) {
  console.log(response.data);
});
