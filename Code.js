function openSideBar(e) {

  // Gmail Authentication
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Email Data
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1");

  // Mock Endpoint
  var endpoint = "https://hp-develop.herokuapp.com/api/contacts/Brian.Hendriks@Vink.nl"
  //"https://hp-develop.herokuapp.com/api/contacts/" + sender;
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
    }]
  }

  // Construct Card
  var card = CardService.newCardBuilder()
    .setName("Sidebar Overview")

  // Construct Sections
  function createContactOverview() {

    var companySection = CardService.newCardSection();

    // Main check if the company was found
    if (data.hasOwnProperty("company") == false) {

      // Set header to Unknown
      companySection.setHeader("Onbekend Bedrijf");

      // Show the domain selector
      var dropdownGroup = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Dit domein aan bedrijf koppelen")
        .setFieldName("TestFieldName")
        .addItem("ING", "value_one", false)
        .addItem("RABOBANK", "value_two", false)
        .addItem("ABN-AMRO", "value_three", false);
      companySection.addWidget(dropdownGroup);

      return card.addSection(companySection).build();

    }

    // If the company is found
    else {

      // Actions
      var action = CardService.newAction().setFunctionName('notificationCallback');
      var slackAction = CardService.newAction().setFunctionName('openSlackLink').setParameters({
        "channel": data.company.slack
      });
      var saveSlackChannel = CardService.newAction().setFunctionName('saveSlackChannel');

      // Show the company name
      companySection.setHeader(data.company.name);

      // TODO: Build this again when the API returns domains
      // if (data.company.domains) {
      //   data.company.domains.forEach(function (domain) {
      companySection.addWidget(CardService.newKeyValue()
        .setTopLabel('Domain')
        .setIcon(CardService.Icon.EMAIL)
        .setContent("domain"));
      //  });
      // }

      // Contacts Section
      var contactSection = CardService.newCardSection();
      contactSection.setHeader('Contactpersonen');
      data.contacts.forEach(function (contact) {
        var c = {
          "name": contact.name,
          "email": contact.email,
          "phone": contact.phone,
          "department": contact.department
        }
        contactSection.addWidget(
          CardService.newKeyValue()
          .setIcon(CardService.Icon.PERSON)
          .setTopLabel(contact.name)
          .setContent(contact.email)
          .setOnClickAction(CardService.newAction().setFunctionName("contactDetail").setParameters(c))
        );
      });

      // Contacts buttonset/ Slack input
      if (data.company.slack.length > 0) {
        contactSection.addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(action))
          .addButton(CardService.newTextButton().setText('Slack').setOnClickAction(slackAction))
        );
      } else {
        contactSection.addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(action))
        );

        var slackChannel = CardService.newTextInput()
          .setFieldName("channel")
          .setTitle("Slack channel name:")
          .setHint("General");

        contactSection.addWidget(slackChannel);
        contactSection.addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton().setText('Opslaan').setOnClickAction(saveSlackChannel))
        );
      }

      // Deals
      var dealSection = CardService.newCardSection();
      dealSection.setHeader('Deals');
      data.deals.forEach(function (deal) {
        dealSection.addWidget(
          CardService.newKeyValue()
          .setTopLabel(deal.name)
          .setIcon(CardService.Icon.DOLLAR)
          .setContent(formatDate(new Date(deal.date.split('T')[0])))
        );
      });

      // Appointments
      var cals = CalendarApp.getAllCalendars();
      var widgets = [];
      var appointmentSection = CardService.newCardSection();
      appointmentSection.setHeader('Afspraken');

      //Get events with the email that is currently selected
      cals.forEach(function (cal) {
        cal.getEvents(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))).forEach(function (event) {
          var title = event.getTitle();
          var times = formatDate(event.getStartTime()) + ' | ' +
            formatTime(event.getStartTime()) + '-' +
            formatTime(event.getEndTime());

          var calendarAction = CardService.newAction().setFunctionName('openCalendarEvent').setParameters({
            "link": event.getId()
          });

          event.getGuestList(false).forEach(function (guest) {
            var contacts = data.contacts
            contacts.forEach(function (contact) {
              var contactEmail = contact.email.toLowerCase()
              var guestEmail = guest.getEmail().toLowerCase()
              if (contactEmail == guestEmail && widgets.length < 5) {
                widgets.push(CardService.newKeyValue()
                  .setTopLabel(times)
                  .setIcon(CardService.Icon.INVITE)
                  .setContent(title)
                  .setOnClickAction(calendarAction)
                )
              };
            });
          });
        });
      });

      if (widgets.length != 0) {
        widgets.forEach(function (widget) {
          appointmentSection.addWidget(widget);
        });
      } else {
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

      return card.addSection(companySection).addSection(contactSection).addSection(dealSection).addSection(appointmentSection).addSection(ticketSection).build();

    }

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

//Action Functions
function openSlackLink(e) {
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink()
      .setUrl("https://avansinformaticabreda.slack.com/messages/" + e.parameters.channel)
      .setOpenAs(CardService.OpenAs.FULL_SIZE)
      .setOnClose(CardService.OnClose.NOTHING))
    .build();
}

function openCalendarEvent(e) {
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink()
      .setUrl("https://www.google.com/calendar/event?eid=" + e.parameters.link)
      .setOpenAs(CardService.OpenAs.FULL_SIZE)
      .setOnClose(CardService.OnClose.NOTHING))
    .build();
}

function formatTime(date) {
  var time = "";
  if (date.getHours() < 10) {
    time = time + "0";
  }
  time = time + date.getHours() + ":";

  if (date.getMinutes() < 10) {
    time = time + "0";
  }
  time = time + date.getMinutes();
  return time;
}

function formatDate(date) {
  var time = ""
  if (date.getDate() < 10) {
    time = time + "0";
  }
  time = time + date.getDate() + "-";

  var month = (date.getMonth() + 1)
  if (month < 10) {
    time = time + "0";
  }

  time = time + month + "-" + date.getFullYear();
  return time;
}

function saveSlackChannel() {

}