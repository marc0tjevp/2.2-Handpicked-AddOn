function openSideBar(e) {
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  var subject = message.getSubject();
  var senderName = message.getFrom();
  var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1");
  var body = message.getPlainBody();
  var messageDate = message.getDate();
  
  // Empty action for button
  var action = CardService.newAction().setFunctionName('notificationCallback');
  
  // Construct sidebar
  function createWidgetDemoCard() {
    return CardService
    .newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
      .setTitle('Bedrijfsnaam')
    )
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
    createWidgetDemoCard()
  ]
}