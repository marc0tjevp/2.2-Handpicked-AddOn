function openSideBar(e) {
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  
  return [CardService.newCardBuilder().
    addSection(CardService.newCardSection().
    addWidget(CardService.newTextParagraph().
    setText(message.getFrom()))).
    setHeader(CardService.newCardHeader().
    setTitle("Email")).
    build()]
}