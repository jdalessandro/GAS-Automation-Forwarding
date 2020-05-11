function enableForwarding(mailbox, user) {
  var service = getOAuthService_(mailbox);
  var payload = {
    "forwardingEmail": user,
    "verificationStatus": "accepted"
  }

  if (service.hasAccess()) {
    var options = {
      "method" : "POST",
      "contentType": "application/json",
      "muteHttpExceptions": true,
      "headers" : {
        "Authorization" : 'Bearer ' + service.getAccessToken()
        },
        "payload" : JSON.stringify(payload)
    };
  }

  var url = "https://www.googleapis.com/gmail/v1/users/" + mailbox + "/settings/forwardingAddresses"

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = response.getContentText();
    Logger.log(json);
  }
  catch(ee) {
    Logger.log(JSON.stringify(ee));
  }
}

function removeForwarding(mailbox) {
  var service = getOAuthService_(mailbox);

  if (service.hasAccess()) {
    var options = {
      "method" : "DELETE",
      "contentType": "application/json",
      "muteHttpExceptions": true,
      "headers" : {
        "Authorization" : 'Bearer ' + service.getAccessToken()
        }
    };
  }

  // Calls listForwarding function to eliminate need to enter address of user specified in forwarding settings
  var user = listForwarding(mailbox)
  var url = "https://www.googleapis.com/gmail/v1/users/" + mailbox + "/settings/forwardingAddresses/" + user

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = response.getContentText();
    Logger.log(json);
  }
  catch(ee) {
    Logger.log(JSON.stringify(ee));
  }
  return user
}

function listForwarding(mailbox) {
  var service = getOAuthService_(mailbox);

  if (service.hasAccess()) {
    var options = {
      "method" : "GET",
      "contentType": "application/json",
      "muteHttpExceptions": true,
      "headers" : {
        "Authorization" : 'Bearer ' + service.getAccessToken()
      }
    };
  }
  var url = "https://www.googleapis.com/gmail/v1/users/" + mailbox + "/settings/forwardingAddresses"

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    return json.forwardingAddresses[0].forwardingEmail
  }
  catch(ee) {
    Logger.log("Error: ", JSON.stringify(ee));
  }
}
