function sendRequestorEmail(submitter, messageType, mailbox, recipient) {

  var body

  if(messageType == "Invalid Recipient") {
    body = "Invalid Recipient: " + recipient

    var message = {
        to: {
            name: "Requestor",
            email: submitter
        },
        from: {
            name: "Mailbox Forwarding Automation",
            email: submitter
        },
        body: {
            html: body
        },
        subject: "Mailbox Forwarding Unsuccessful: " + mailbox,
    };

  }
  else if(messageType == "Invalid Mailbox") {
    var body = "Invalid Mailbox: " + mailbox + "<br>"
    // delegateArray alone was not functional; validating length
    if(recipient) {
      body = body + "Invalid Recipient: " + recipient
    }
    var message = {
        to: {
            name: "Requestor",
            email: submitter
        },
        from: {
            name: "Mailbox Forwarding Automation",
            email: submitter
        },
        body: {
            html: body
        },
        subject: "Mailbox Forwarding Unsuccessful: " + mailbox,
    };
  }
  else if(messageType == "Success - Forwarding Enabled"){
    var message = {
        to: {
            name: "Requestor",
            email: submitter
        },
        from: {
            name: "Mailbox Forwarding Automation",
            email: submitter
        },
        body: {
            html: "Mailbox Forwarding Successful: " + mailbox,
        },
        subject: "Mailbox Delegation Successful: " + mailbox,
    };
  }
  else if(messageType == "Success - Forwarding Removed"){
    var message = {
        to: {
            name: "Requestor",
            email: submitter
        },
        from: {
            name: "Mailbox Forwarding Automation",
            email: submitter
        },
        body: {
            html: "Mailbox Forwarding Removal Successful for " + mailbox,
        },
        subject: "Mailbox Forwarding Removal Successful: " + mailbox,
    };
  }
    // Compose Gmail message and send immediately
    Logger.log(callGmailAPI_(message, submitter))
}

function sendEmailNotification(recipient, mailbox, message) {
  var body = message + mailbox
  var service = getOAuthService_(recipient);

  var message = {
    to: {
      name: "Mailbox Forwarding Recipient",
      email: recipient
    },
      from: {
        name: "Mailbox Forwarding Automation",
        email: recipient
    },
      body: {
        html: body
    },
      subject: message + mailbox,
    };
    callGmailAPI_(message, recipient)
}

function callGmailAPI_(message, user) {
    var service = getOAuthService_(user)

    var payload = createMimeMessage_(message)
    var response = UrlFetchApp.fetch(
        "https://www.googleapis.com/upload/gmail/v1/users/" + user + "/messages/send"
        , {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + service.getAccessToken(),
                "Content-Type": "message/rfc822",
            },
            muteHttpExceptions: true,
            payload: payload
        });
   return response;
}

// UTF-8 characters in names and subject
function encode_(subject) {
    var enc_subject = Utilities.base64Encode(subject, Utilities.Charset.UTF_8);
    return '=?utf-8?B?' + enc_subject + '?=';
}

// Create a MIME message that complies with RFC 2822
function createMimeMessage_(msg) {

    var nl = "\n";
    var boundary = "__ctrlq_dot_org__";

    var mimeBody = [

        "MIME-Version: 1.0",
        "To: " + encode_(msg.to.name) + "<" + msg.to.email + ">",
        "From: " + encode_(msg.from.name) + "<" + msg.from.email + ">",
        "Subject: " + encode_(msg.subject), // takes care of accented characters

        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64" + nl,
        Utilities.base64Encode(msg.body.html, Utilities.Charset.UTF_8) + nl

    ];

    mimeBody.push("--" + boundary + "--");

    return mimeBody.join(nl);

}
