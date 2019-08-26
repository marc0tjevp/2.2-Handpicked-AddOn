// Construct Card
var card = CardService.newCardBuilder()
  .setName('Sidebar Overview')

function openSideBar(e) {

  // Gmail Authentication
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Email Data
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  var sender = message.getFrom().replace(/^.+<([^>]+)>$/, '$1');

  // Endpoint
  var endpoint = 'https://hp-develop.herokuapp.com/api/contacts/' + sender
  var response = UrlFetchApp.fetch(endpoint, {
    'muteHttpExceptions': true
  });
  var json = response.getContentText();
  var data = JSON.parse(json);

  // Static mock data
  var staticjson = {
    tickets: [{
      title: "Ticket #102030",
      content: "Robin Schellius"
    }]
  }

  // Construct Sections
  function createContactOverview() {

    var companySection = CardService.newCardSection();

    // Main check if the company was found
    if (data.hasOwnProperty('company') == false) {

      // Set header to Unknown
      companySection.setHeader('Onbekend Bedrijf');

      var endpoint = 'https://hp-develop.herokuapp.com/api/companies'
      var response = UrlFetchApp.fetch(endpoint);
      var json = response.getContentText();
      var companies = JSON.parse(json);

      // Show the domain selector
      var dropdownGroup = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle(sender.replace(/.*@/, "") + ' aan bedrijf koppelen')
        .setFieldName('companyDropdown');

      companies.forEach(function (company) {
        dropdownGroup.addItem(company.name, company.companyId, false)
          .setOnChangeAction(CardService.newAction()
            .setFunctionName("selectedCompany").setParameters({
              domain: sender.replace(/.*@/, "")
            }))
      });

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
      var saveSlackChannelAction = CardService.newAction().setFunctionName('saveSlackChannel').setParameters({
        "companyID": data.company.id.toString()
      });
      var newContactAction = CardService.newAction().setFunctionName('newContact').setParameters({"email": sender, "company": data.company.originalId});

      // Show the company name
      companySection.setHeader(data.company.name);

      if (data.company && data.company.domains.length > 0) {
        data.company.domains.forEach(function (domain) {
          companySection.addWidget(CardService.newKeyValue()
            .setTopLabel('Domain')
            .setIcon(CardService.Icon.EMAIL)
            .setContent(domain));
        });
      }

      // Else show no domains
      else {
        companySection.addWidget(CardService.newTextParagraph().setText('Geen domeinen gevonden...'));
      }

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
          .setOnClickAction(CardService.newAction().setFunctionName('contactDetail').setParameters(c))
        );
      });

      var slackSection = CardService.newCardSection();
      slackSection.setHeader('Slack Channel');

      // Contacts buttonset/ Slack input
      if (data.company.slack.length > 0) {
        contactSection.addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(newContactAction))
          .addButton(CardService.newTextButton().setText('Slack').setOnClickAction(slackAction))
        );
      } else {
        contactSection.addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton().setText('Contact Toevoegen').setOnClickAction(newContactAction))
        );

        var slackChannel = CardService.newTextInput()
          .setFieldName('channel')
          .setTitle('Channel Naam');

        slackSection.addWidget(slackChannel);
        slackSection.addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton().setText('Opslaan').setOnClickAction(saveSlackChannelAction))
        );
      }

      // Deals
      var dealSection = CardService.newCardSection();
      dealSection.setHeader('Deals');
      if (data.deals && data.deals.length > 0) {
        data.deals.forEach(function (deal) {
          dealSection.addWidget(
            CardService.newKeyValue()
            .setTopLabel(deal.name)
            .setIcon(CardService.Icon.DOLLAR)
            .setContent(formatDate(new Date(deal.date.split('T')[0])))
          );
        });
      } else {
        dealSection.addWidget(CardService.newTextParagraph().setText('Geen deals gevonden...'));
      }

      // Appointments
      var cals = CalendarApp.getAllCalendars();
      var widgets = [];
      var appointmentSection = CardService.newCardSection();
      appointmentSection.setHeader('Afspraken');

      // Get events with the email that is currently selected
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
        appointmentSection.addWidget(CardService.newTextParagraph().setText('Geen aankomende afspraken gevonden...'));
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

      if (data.company.slack.length > 0) {
        return card.addSection(companySection).addSection(contactSection).addSection(dealSection).addSection(appointmentSection).build();
      } else {
        return card.addSection(companySection).addSection(contactSection).addSection(slackSection).addSection(dealSection).addSection(appointmentSection).build();
      }

    }

  }

  return [
    createContactOverview()
  ]

}

// Contact Details
function contactDetail(e) {

  var card = CardService.newCardBuilder()
    .setName('Contact Overview')

  var details = CardService.newCardSection();
  details.addWidget(
    CardService.newImage().setAltText('Avatar').setImageUrl('https://via.placeholder.com/512x260')
  )
  details.addWidget(
    CardService.newKeyValue()
    .setTopLabel('Naam')
    .setIcon(CardService.Icon.PERSON)
    .setContent(e.parameters.name)
  );
  details.addWidget(
    CardService.newKeyValue()
    .setTopLabel('Email')
    .setIcon(CardService.Icon.EMAIL)
    .setContent(e.parameters.email)
  );
  details.addWidget(
    CardService.newKeyValue()
    .setTopLabel('Telefoon')
    .setIcon(CardService.Icon.PHONE)
    .setContent(e.parameters.telephone)
  );

  return card.addSection(details).build();
}

//New Contact
function newContact(e) {

  var card = CardService.newCardBuilder()
    .setName('New Contact')

  var details = CardService.newCardSection();

  details.addWidget(
    CardService.newTextInput()
    .setFieldName('emailInput')
    .setValue(e.parameters.email)
    .setTitle('E-mail')
  )

  details.addWidget(
    CardService.newTextInput()
    .setFieldName('nameInput')
    .setTitle('Name')
  )

  details.addWidget(
    CardService.newTextInput()
    .setFieldName('phoneNrInput')
    .setTitle('PhoneNr')
  )

  details.addWidget(
    CardService.newTextInput()
    .setFieldName('departmentInput')
    .setTitle('Department')
  )

  var action = CardService.newAction().setFunctionName('postNewContact').setParameters({"companyId": e.parameters.company});

  details.addWidget(CardService.newButtonSet()
    .addButton(CardService.newTextButton().setText('Opslaan').setOnClickAction(action)));

  return card.addSection(details).build();
}

//Action Functions
function openSlackLink(e) {
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink()
      .setUrl('https://avansinformaticabreda.slack.com/messages/' + e.parameters.channel)
      .setOpenAs(CardService.OpenAs.FULL_SIZE)
      .setOnClose(CardService.OnClose.NOTHING))
    .build();
}

function selectedCompany(e) {
  dropdownId = Number(e.formInput.companyDropdown)
  dropdownDomain = e.parameters.domain

  var url = 'https://hp-develop.herokuapp.com/api/domains'
  var data = {
    "domain": dropdownDomain,
    "companyid": dropdownId
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data),
    'muteHttpExceptions': false
  };

  // send the request
  UrlFetchApp.fetch(url, options);

  openSideBar(e);
  return CardService.newNavigation().updateCard(card.build());

}

function openCalendarEvent(e) {
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink()
      .setUrl('https://www.google.com/calendar/event?eid=' + e.parameters.link)
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

function saveSlackChannel(e) {
  var url = 'https://hp-develop.herokuapp.com/api/companies'
  var data = {
    "slack": String(e.formInput.channel),
    "companyId": Number(e.parameters.companyID)
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data)
  };

  // send the request
  UrlFetchApp.fetch(url, options);

  openSideBar(e);
  return CardService.newNavigation().updateCard(card.build());

}

function postNewContact(e) {
  var url = 'https://hp-develop.herokuapp.com/api/contacts';
  var data = {
    "originalId": "addon-" + Utilities.getUuid(),
    "companyId": Number(e.parameters.companyId),
    "name": String(e.formInput.nameInput),
    "email": String(e.formInput.emailInput),
    "phoneNr": String(e.formInput.phoneNrInput),
    "department": String(e.formInput.departmentInput)
  }
  var HTTPoptions = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data)
  }

  UrlFetchApp.fetch(url, HTTPoptions);

  openSideBar(e);
  return CardService.newNavigation().updateCard(card.build());
}