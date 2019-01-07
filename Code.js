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
    contacts: {
      contact1: {
        name: "test 1",
        email: "test1@test.nl"
      },
      contact2: {
        name: "test 2",
        email: "test2@test.nl"
      }
    },
    deals: {
      deal1: {
        title: "title1",
        content: "some content"
      },
      deal2: {
        title: "title2",
        content: "some content"
      }
    },
    appointments: {
      appointment1: {
        date: "10-2-2019",
        content: "A birthday!"
      },
      appointment2: {
        date: "18-1-2019",
        content: "oplevering"
      }
    },
    tickets: {
      ticket1: {
        title: "ticket1",
        content: "some content"
      },
      ticket2: {
        title: "ticket2",
        content: "some content"
      }
    }
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
        .setHeader('DEALS'),
        staticjson.deals.forEach(deal => {
          addWidget(
            CardService.newKeyValue()
            .setTopLabel(deal.title)
            .setContent(deal.content)
          )
        })
      )

      // Appointments
      .addSection(
        CardService.newCardSection()
        .setHeader('AFSPRAKEN'),
        staticjson.appointments.forEach(appointment => {
          addWidget(
            CardService.newKeyValue()
            .setTopLabel(appointment.date)
            .setContent(appointment.content)
          )
        })
      )

      // Tickets
      .addSection(
        CardService.newCardSection()
        .setHeader('TICKETS'),
        staticjson.tickets.forEach(ticket => {
          addWidget(
            CardService.newKeyValue()
            .setTopLabel(ticket.title)
            .setContent(ticket.content)
          )
        })
      )
      .build();
  }

  return [
    createMailOverview()
  ]

}