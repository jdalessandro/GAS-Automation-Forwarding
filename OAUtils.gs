//************************ OAUTH SUPPORT ****************************************************************************************************************

/**
 * Resets the OAuth Authorization state...
 */
function oauthReset() {
  //reset service
  var service = getService();
  service.reset();
  //reset owner (if needed)
  var scriptOwner = PropertiesService.getScriptProperties().getProperty("SCRIPT_OWNER");
  if ((scriptOwner = null) || (scriptOwner = "")) {
    var ui = SpreadsheetApp.getUi();
    var userEmail = Session.getActiveUser().getEmail();
    var setSheet = ss.getSheetByName("Settings");
    var range = setSheet.getRange(3,2,1,1);
    range.setValue(userEmail);
    PropertiesService.getScriptProperties().setProperty("SCRIPT_OWNER",userEmail);
  }
}

/**
 * Authorizes and makes a request to the Admin SDK. (No parameters needed.)
 */
function runOAuth() {
  //var ui = SpreadsheetApp.getUi();
  var timeStamp = new Date();
  var params = "gplus:num_video_calls_cfm%2Cgplus:num_video_conferences_cfm%2Cgplus:total_video_call_minutes_cfm%2Cgplus:num_7day_active_cfm_devices";
  var service = getService();
  if (service.hasAccess()) {
    var url = buildReportUrl_("customer",timeStamp.getFullYear(),timeStamp.getMonth(),timeStamp.getDate(),params,MAX,null);
    var response = UrlFetchApp.fetch(url, { headers:{Authorization:'Bearer '+service.getAccessToken()} });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
    //Browser.msgBox("Success.", "Already authorized.", ui.ButtonSet.OK);
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
    //Browser.msgBox('Open this URL to authorize the script.', authorizationUrl, ui.ButtonSet.OK); // no ui, please...
    //var response = ui.prompt('Open this URL to authorize the script.', authorizationUrl, ui.ButtonSet.OK); // no ui, please...
  }
}

/**
 * Configures the service.
 */
function getOAuthService() {
  return OAuth2.createService('ReportsAPI')
      // Set the endpoint URLs.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the client ID and secret.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function that should be invoked to complete
      // the OAuth flow.
      .setCallbackFunction('oAuthCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scope and additional Google-specific parameters.
      .setScope(SCOPE)
      .setParam('access_type', 'offline')
      .setParam('approval_prompt', 'force')
      .setParam('login_hint', Session.getActiveUser().getEmail());
}

/**
 * Handles the OAuth callback.
 */
function oAuthCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

//************************ OAUTH UTILITIES ***************************************************************************************************

/**
 * Simple Modal Dialog Invocation to set Script Property: CLIENT_ID
 */
function updateClientID_() {
  PropertiesService.getUserProperties().setProperty("MODAL_DIALOG","CLIENT_ID");
  var html = HtmlService.createTemplateFromFile('SSDialog').evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(350)
      .setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(html, "Update Client ID");
}

/**
 * Simple Modal Dialog Invocation to set Script Property: CLIENT_SECRET
 */
function updateClientSecret_() {
  PropertiesService.getUserProperties().setProperty("MODAL_DIALOG","CLIENT_SECRET");
  var html = HtmlService.createTemplateFromFile('SSDialog').evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(350)
      .setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(html, "Update Client Secret");
}

/**
 * Shows OAuth re-direct url for copying purposes
 */
function showRedirectURI_() {
  var ui = SpreadsheetApp.getUi();
  var service = getService();
  Browser.msgBox("Redirect URI",service.getRedirectUri(),ui.ButtonSet.OK);
}
