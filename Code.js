function openSideBar(e) {

  // Gmail Authentication
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Email Data
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  var senderName = message.getFrom();
  var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1");
  var subject = message.getSubject();
  var body = message.getPlainBody();
  var messageDate = message.getDate();


  // Test send email to API
  var url = "https://hp-tests.herokuapp.com/api/email";
  var data = {
    "id": message,
    "sender": sender,
    "name": senderName,
    "subject": subject,
    "body": body,
    "date": messageDate 
  }
  var options = {
    "method": "post",
    "contentType" : "application/json",
    "payload": JSON.stringify(data)
  };
  var response = UrlFetchApp.fetch(url, options);

  console.log(response)

  // Empty action for button
  var action = CardService.newAction().setFunctionName('notificationCallback');

  // Construct Sidebar
  function createMailOverview() {
    return CardService
      .newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
        .setTitle('Bedrijfsnaam')
      )

      // Contacts
      .addSection(
        CardService.newCardSection()
        .setHeader('CONTACTPERSONEN')
        .addWidget(CardService.newKeyValue()
          .setIconUrl('https://png.pngtree.com/svg/20161230/little_helper_657605.png')
          .setContent(sender)
        )
        .addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(action))
          .addButton(CardService.newTextButton().setText('Slack').setOnClickAction(action))
        )
      )

      // Deals
      .addSection(
        CardService.newCardSection()
        .setHeader('DEALS')
        .addWidget(
          CardService.newKeyValue()
          .setTopLabel("Deal A")
          .setContent("Over 3 weken")
        )
        .addWidget(
          CardService.newKeyValue()
          .setTopLabel("Deal B")
          .setContent("Over 2 weken")
        )
      )

      // Appointments
      .addSection(
        CardService.newCardSection()
        .setHeader('AFSPRAKEN')
        .addWidget(
          CardService.newKeyValue()
          .setTopLabel("12 januari | 12:00 - 13:00")
          .setContent("Fingersplitz Room")
        )
        .addWidget(
          CardService.newKeyValue()
          .setTopLabel("14 januari | 16:00 - 17:00")
          .setContent("Fingersplitz Room")
        )
      )

      // Tickets
      .addSection(
        CardService.newCardSection()
        .setHeader('TICKETS')
        .addWidget(
          CardService.newKeyValue()
          .setTopLabel("Ticket #0001")
          .setContent(senderName)
        )
        .addWidget(
          CardService.newKeyValue()
          .setTopLabel("Ticket #0017")
          .setContent(senderName)
        )
      )
      .build();
  }

  return [
    createMailOverview()
  ]

}