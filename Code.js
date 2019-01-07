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

  var staticjson = {
    contacts: [
      {
        name: "test 1",
        email: "test1@test.nl"
      },
      {
        name: "test 2",
        email: "test2@test.nl"
      }
    ],
    deals: [
      {
        title: "title1",
        content: "some content"
      },
      {
        title: "title2",
        content: "some content"
      }
    ],
    appointments: [
      {
        date: "10-2-2019",
        content: "A birthday!"
      },
      {
        date: "18-1-2019",
        content: "oplevering"
      }
    ],
    tickets: [
      {
        title: "ticket1",
        content: "some content"
      },
      {
        title: "ticket2",
        content: "some content"
      }
    ]
  }

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

  function createContactOverview() {
    var cardMailOverview = CardService.newCardBuilder()
    .setName("Contact Overview")
    .setHeader(
      CardService.newCardHeader()
      .setTitle('Contacts')
    );

    // Contacts Section
    var contactSection = CardService.newCardSection();

    contactSection.setHeader('CONTACTPERSONEN');
    contactSection.addWidget(CardService.newKeyValue()
      .setIconUrl('https://png.pngtree.com/svg/20161230/little_helper_657605.png')
      .setContent(sender)
    );
    contactSection.addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(action))
      .addButton(CardService.newTextButton().setText('Slack').setOnClickAction(action))
    );

    return cardMailOverview.addSection(contactSection).build();
  }

  function createDealOverview() {
    var cardMailOverview = CardService.newCardBuilder()
    .setName("Deal Overview")
    .setHeader(
      CardService.newCardHeader()
      .setTitle('Deals')
    );

    // Deals Section
    var dealSection = CardService.newCardSection();

    dealSection.setHeader('DEALS');
    staticjson.deals.forEach(function(deal) {
      dealSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(deal.title)
        .setContent(deal.content)
      );
    });

    return cardMailOverview.addSection(dealSection).build();
  }

  function createAppointmentOverview() {
    var cardMailOverview = CardService.newCardBuilder()
    .setName("Appointment Overview")
    .setHeader(
      CardService.newCardHeader()
      .setTitle('Appointments')
    );

    // Appointments Section
    var appointmentSection = CardService.newCardSection();

    appointmentSection.setHeader('AFSPRAKEN');

    staticjson.appointments.forEach(function(appointment) {
      appointmentSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(appointment.date)
        .setContent(appointment.content)
      );
    });

    return cardMailOverview.addSection(appointmentSection).build();
  }

  function createTicketOverview() {
    var cardMailOverview = CardService.newCardBuilder()
    .setName("Ticket Overview")
    .setHeader(
      CardService.newCardHeader()
      .setTitle('Tickets')
    );

    // Tickets Section
    var ticketSection = CardService.newCardSection();

    ticketSection.setHeader('TICKETS');
      
    staticjson.tickets.forEach(function(ticket) {
      ticketSection.addWidget(
        CardService.newKeyValue()
        .setTopLabel(ticket.title)
        .setContent(ticket.content)
      );
    });

    return cardMailOverview.addSection(ticketSection).build();
  }

  return [
    createContactOverview(),
    createDealOverview(),
    createDealOverview(),
    createTicketOverview()
  ]

}