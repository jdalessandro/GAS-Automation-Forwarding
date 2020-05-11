// Trigger function to execute
function trigger() {
  var checkInput
  var sendNotification
  var sheet = SpreadsheetApp.getActive().getSheetByName("Form Responses 1")
  var rangeData = sheet.getDataRange()
  var lastColumn = rangeData.getLastColumn()
  var lastRow = rangeData.getLastRow()
  var searchRange = sheet.getRange(lastRow, 1, lastRow, lastColumn)
  var rangeValues = searchRange.getValues()

  var rangeValues = searchRange.getValues()[0]

  var sheetName = rangeValues[1]
  // Submitter appends to last column of "form responses" sheet
  var submitter = rangeValues[rangeValues.length - 1]

  if(sheetName == "Enable Forwarding") {
    // Pass submitter as argument for mail notifications
    checkInput = directoryCheck(sheetName, submitter)
    // Check if pass variable is true
    if(checkInput[0]) {
      sendNotification = readEnableForwarding()
      if(sendNotification[0]) {
        sendRequestorEmail(submitter, "Success - Forwarding Enabled", checkInput[1], null)
        sendEmailNotification(sendNotification[1], checkInput[1], "Mailbox Forwarding Enabled: ", "Your address has been configured as the mail forwarding recipient for: ");
      }
    }
  }

  else if(sheetName == "Remove Forwarding") {
    // Pass submitter as argument for mail notifications
    checkInput = directoryCheck(sheetName, submitter)

    // Check if pass variable is true
    if(checkInput[0]) {
      sendNotification = readRemoveForwarding()
      if(sendNotification[0]) {
        sendRequestorEmail(submitter, "Success - Forwarding Removed", checkInput[1], null)
        sendEmailNotification(sendNotification[1], checkInput[1], "Mailbox Forwarding Disabled: ", "Your address has been removed as a fordwarding recipient for: ");
      }
    }
  }
}

/*
// Finds last row of designated sheet
function findLastRow(sheet){
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i > 0; i--) {
    for (var j = 0; j < data[0].length; j++) {
      if (data[i][j]) {
        continue;
      }
      else {
        return i + 1;
      }
    }
  }
}*/

// Validates data in cells against directory
function directoryCheck(sheetName, submitter) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
  var rangeData = sheet.getDataRange()
  var lastColumn = rangeData.getLastColumn()
  var lastRow = rangeData.getLastRow()
  var searchRange = sheet.getRange(lastRow, 1, lastRow, lastColumn)
  var pass = true
  var recipient
  var rangeValues = searchRange.getValues()[0]
  var mailbox = rangeValues[1]
  var messageType
  // var rowIndex = findLastRow(sheet)

  for(var i = 1; i < lastColumn; i++) {
    if(rangeValues[i]) {
      try {
        var checkUser = AdminDirectory.Users.get(rangeValues[i])
      }
      catch(e) {
        if(i == 1) {
          messageType = "Invalid Mailbox"
        }
        else if(messageType != "Invalid Mailbox") {
          messageType = "Invalid Recipient"
        }
        if(i != 1) {
          recipient = rangeValues[i]
        }
        sheet.getRange(lastRow,1).setValue("Invalid")
        sheet.getRange(lastRow,i + 1).setBackground('#E80000')
        pass = false
      }
    }
    else {
      break
    }
  }

  if(messageType == "Invalid Mailbox" || messageType == "Invalid Recipient") {
      sendRequestorEmail(submitter, messageType, mailbox, recipient)
  }
  return [pass, mailbox]
}
