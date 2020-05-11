var CLIENT_JSON = {
    "private_key": "-----BEGIN PRIVATE KEY-----\{Insert Here}\n-----END PRIVATE KEY-----\n",
    "client_email": "Insert Here",
    "client_id": "Insert Here"
};

function getOAuthService_(mailbox) {
    return OAuth.OAuth2.createService("Service Account")
        .setTokenUrl('https://oauth2.googleapis.com/token')
        .setPrivateKey(CLIENT_JSON.private_key)
        .setIssuer(CLIENT_JSON.client_email)
        .setSubject(mailbox)
        .setClientId(CLIENT_JSON.client_id)
        .setParam('access_type', 'offline')
        .setScope(['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.settings.sharing', 'https://www.googleapis.com/auth/gmail.settings.basic', 'https://www.googleapis.com/auth/gmail.compose', 'https://www.googleapis.com/auth/gmail.send']);
}

function initialize() {
  //SCD: User this first, just to force the script to prompt for authorization.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty("SS_KEY",ss.getId());
  Logger.log(JSON.stringify(PropertiesService.getScriptProperties())); //SCD: Google Security change... This returns an empty JSON object now {} !!
  return true;
}

function reset() {
    var service = getOAuthService_();
    service.reset();
}
