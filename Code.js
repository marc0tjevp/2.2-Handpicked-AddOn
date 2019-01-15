function openSideBar(e) {

  // Gmail Authentication
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Email Data
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1");

  // Mock Endpoint
  var endpoint = "https://hp-develop.herokuapp.com/api/contacts/" + sender;
  var response = UrlFetchApp.fetch(endpoint, {
    'muteHttpExceptions': true
  });
  var json = response.getContentText();
  var data = JSON.parse(json);

  // Static mock data
  var staticjson = {
    appointments: [{
        date: "12 januari | 12:00 - 13:00",
        content: "LD121"
      },
      {
        date: "14 januari | 09:15 - 12:00",
        content: "LA201"
      }
    ],
    tickets: [{
        title: "Ticket #102030",
        content: "Robin Schellius"
      }
    ]
  }

  // Actions
  var action = CardService.newAction().setFunctionName('notificationCallback');

  // Construct Card
  var card = CardService.newCardBuilder()
    .setName("Sidebar Overview")

  // Construct Sections
  function createContactOverview() {

    // Contacts Section
    var contactSection = CardService.newCardSection();
    contactSection.setHeader('Contactpersonen');
    data.result.contacts.forEach(function (contact) {
      contactSection.addWidget(
        CardService.newKeyValue()
        .setIcon(CardService.Icon.PERSON)
        .setTopLabel(contact.name)
        .setContent(contact.email)
        .setOnClickAction(CardService.newAction().setFunctionName("contactDetail").setParameters(contact))
      );
    });

    // Contacts buttonset
    contactSection.addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(action))
      .addButton(CardService.newTextButton().setText('Slack').setOnClickAction(action))
    );

    // Domain section
    var domainName = CardService.newCardSection();
    if (Object.keys(data.result.company.domains).length > 0) {
      domainName.setHeader(data.result.company.name);
      data.result.company.domains.forEach(function (domain) {
        domainName.addWidget(CardService.newKeyValue()
          .setTopLabel('Domain')
          .setIcon(CardService.Icon.EMAIL)
          .setContent(domain));
      });
    } else {
      domainName.setHeader("Onbekend Bedrijf");
      var dropdownGroup = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Dit domein aan bedrijf koppelen")
        .setFieldName("TestFieldName")
        .addItem("ING", "value_one", false)
        .addItem("RABOBANK", "value_two", false)
        .addItem("ABN-AMRO", "value_three", false);
      domainName.addWidget(dropdownGroup);
      domainName.addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton().setText('Opslaan')))
    }

    // Deals
    var dealSection = CardService.newCardSection();
    dealSection.setHeader('Deals');
    data.result.deals.forEach(function (deal) {
      dealSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(deal.name)
        .setIcon(CardService.Icon.DOLLAR)
        .setContent(deal.deadline)
      );
    });

    // Appointments
    var cals = CalendarApp.getAllCalendars();
    var widgets = [];
    var appointmentSection = CardService.newCardSection();
    appointmentSection.setHeader('Afspraken');

    //Get events with the email that is currently selected
    cals.forEach(function(cal){
      cal.getEvents(new Date(),new Date(new Date().setFullYear(new Date().getFullYear()+1))).forEach(function(event){
        var title = event.getTitle();
        var times = event.getStartTime() + ' - ' + event.getEndTime() + event.getStartTime();
        times = event.getStartTime().getDate() + '-' + (event.getStartTime().getMonth()+1) + ' | '
          + event.getStartTime().getHours() + ':' + event.getStartTime().getMinutes() + '-'
          + event.getEndTime().getHours() + ':' + event.getEndTime().getMinutes();
        event.getGuestList(false).forEach(function (guest){
          if(guest.getEmail()==sender){
            widgets.push(CardService.newKeyValue()
              .setTopLabel(times)
              .setIcon(CardService.Icon.INVITE)
              .setContent(title));
          };
        });
      });
    });

    if(widgets.length!=0){
      widgets.forEach(function(widget){
        appointmentSection.addWidget(widget);
      });
    } else{
      appointmentSection.addWidget(CardService.newTextParagraph().setText('None found'));
    };

    // Tickets
    var ticketSection = CardService.newCardSection();
    ticketSection.setHeader('Tickets (static)');
    staticjson.tickets.forEach(function (ticket) {
      ticketSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(ticket.title)
        .setIcon(CardService.Icon.TICKET)
        .setContent(ticket.content)
      );
    });

    // Build card
    return card.addSection(domainName).addSection(contactSection).addSection(dealSection).addSection(appointmentSection).addSection(ticketSection).build();

  }

  return [
    createContactOverview()
  ]

}

// Contact Details
function contactDetail(e) {

  var card = CardService.newCardBuilder()
    .setName("Contact Overview")

  var details = CardService.newCardSection();
  details.addWidget(
    CardService.newImage().setAltText("Avatar").setImageUrl("https://via.placeholder.com/512x260")
  )
  details.addWidget(
    CardService.newKeyValue()
    .setTopLabel("Naam")
    .setIcon(CardService.Icon.PERSON)
    .setContent(e.parameters.name)
  );
  details.addWidget(
    CardService.newKeyValue()
    .setTopLabel("Email")
    .setIcon(CardService.Icon.EMAIL)
    .setContent(e.parameters.email)
  );
  details.addWidget(
    CardService.newKeyValue()
    .setTopLabel("Telefoon")
    .setIcon(CardService.Icon.PHONE)
    .setContent(e.parameters.telephone)
  );

  return card.addSection(details).build();
}