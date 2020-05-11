function readEnableForwarding(){
  var mailbox
  var recipient
  var sendNotification = false
  var sheet = SpreadsheetApp.getActive().getSheetByName("Enable Forwarding")
  var rangeData = sheet.getDataRange()
  var lastColumn = rangeData.getLastColumn()
  var lastRow = rangeData.getLastRow()
  var searchRange = sheet.getRange(lastRow, 1, lastRow, lastColumn)

  var rangeValues = searchRange.getValues()[0]

  for(var i = 1; i < lastColumn + 1; i++) {
      // Second column should contain the address to delegate, therefore assign mailbox to this value
      if(i == 1){
        mailbox = rangeValues[i]
      }
      // After row is read run function and reset array
      else if(rangeValues[i]) {
        recipient = rangeValues[i]
      }
      else {
        //var rowIndex = findLastRow(sheet)
        enableForwarding(mailbox, recipient)

        // Need to add validaiton as to whether it completed successfully or not
        sheet.getRange(lastRow,1).setValue("Complete")
        sendNotification = true
        break
      }
    }
    return [sendNotification, recipient]
}

function readRemoveForwarding(){
  var mailbox
  var recipient
  var sendNotification = false
  var sheet = SpreadsheetApp.getActive().getSheetByName("Remove Forwarding")
  var rangeData = sheet.getDataRange()
  var lastColumn = rangeData.getLastColumn()
  var lastRow = rangeData.getLastRow()
  var searchRange = sheet.getRange(lastRow, 1, lastRow, lastColumn)

  var rangeValues = searchRange.getValues()[0]

  for(var i = 1; i < lastColumn + 1; i++) {
      // Second column should contain the address to delegate, therefore assign mailbox to this value
      if(i == 1){
        mailbox = rangeValues[i]
      }
      // After row is read run function and reset array
      else if(rangeValues[i]) {
        recipient = rangeValues[i]
      }
      else {
        //var rowIndex = findLastRow(sheet)
        var removeForwardingOut = removeForwarding(mailbox)

        // Need to add validaiton as to whether it completed successfully or not
        sheet.getRange(lastRow,3).setValue(removeForwardingOut)
        sheet.getRange(lastRow,1).setValue("Complete")
        sendNotification = true
        break
      }
    }
    return [sendNotification, recipient]
}
