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
    deals: [{
        title: "title1",
        content: "some content"
      },
      {
        title: "title2",
        content: "some content"
      }
    ],
    appointments: [{
        date: "10-2-2019",
        content: "A birthday!"
      },
      {
        date: "18-1-2019",
        content: "oplevering"
      }
    ],
    tickets: [{
        title: "ticket1",
        content: "some content"
      },
      {
        title: "ticket2",
        content: "some content"
      }
    ]
  }

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
        .setIconUrl('https://png.pngtree.com/svg/20161230/little_helper_657605.png')
        .setContent(contact.name)
      );
    });

    // Contacts buttonset
    contactSection.addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(action))
      .addButton(CardService.newTextButton().setText('Slack').setOnClickAction(action))
    );

    // Domain section
    var domainName = CardService.newCardSection();
    domainName.setHeader(data.result.company.name);
    if (data.result.company) {
      data.result.company.domains.forEach(function (domain) {
        domainName.addWidget(CardService.newKeyValue()
          .setTopLabel('Domain')
          .setContent(domain));
      });
    } else {
      var dropdownGroup = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Dropdown if no domain")
        .setFieldName("TestFieldName")
        .addItem("", "value_empty", true)
        .addItem("ING", "value_one", false)
        .addItem("RABOBANK", "value_two", false)
        .addItem("ABN-AMRO", "value_three", false);
      domainName.addWidget(dropdownGroup);
      domainName.addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton().setText('Save new domain').setOnClickAction(action)))
    }

    // Deals
    var dealSection = CardService.newCardSection();
    dealSection.setHeader('Deals');
    staticjson.deals.forEach(function (deal) {
      dealSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(deal.title)
        .setContent(deal.content)
      );
    });

    // Appointments
    var appointmentSection = CardService.newCardSection();
    appointmentSection.setHeader('Afspraken');
    staticjson.appointments.forEach(function (appointment) {
      appointmentSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(appointment.date)
        .setContent(appointment.content)
      );
    });

    // Tickets
    var ticketSection = CardService.newCardSection();
    ticketSection.setHeader('Tickets');
    staticjson.tickets.forEach(function (ticket) {
      ticketSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(ticket.title)
        .setContent(ticket.content)
      );
    });

    // Build card
    return card.addSection(domainName).addSection(contactSection).addSection(dealSection).addSection(appointmentSection).addSection(ticketSection).build();

  }

  // Actions
  var action = CardService.newAction().setFunctionName('notificationCallback');

  function handleDropDownChange() {
    console.log('Changed dropdown')
  }

  return [
    createContactOverview()
  ]

}