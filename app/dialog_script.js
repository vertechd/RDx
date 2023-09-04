const client = app.initialized();

client.then(async function(_client) {
    try {
        const ticketData = await _client.data.get('ticket');
        let requesterEmail = null;
        if (ticketData && ticketData.ticket && ticketData.ticket.requester_id) {
            const requesterId = ticketData.ticket.requester_id;
            const contactData = await _client.data.get('contact');
            if (contactData && contactData.contact && contactData.contact.id === requesterId) {
                requesterEmail = contactData.contact.email;
                document.getElementById('requesterName').innerText = contactData.contact.name;
            } else {
                document.getElementById('requesterName').innerText = "Customer name not available.";
            }
        } else {
            document.getElementById('requesterName').innerText = "No ticket data available.";
        }

        if (requesterEmail) {
            _client.events.on('onExternalEvent', function(eventData) {
                if (eventData && eventData.data) {
                    populateTable(eventData.data.ticketData);
                }
            });

            _client.request.invokeTemplate ('getTicketsFromRepairDesk', { email: requesterEmail })
                .catch(error => {
                    console.error("Error invoking the serverless function:", error);
                    displayError("Error fetching data from the server.");
                });
        } else {
            console.error("Requester email not available.");
            displayError("Requester email not available.");
        }
    } catch (error) {
        console.error("Error initializing the app:", error);
        displayError("Error initializing the app.");
    }
});

function populateTable(tickets) {
    const tableBody = document.getElementById('apiData');
    tickets.forEach(ticket => {
        const customer = ticket.summary.customer;
        ticket.devices.forEach(device => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.summary.order_id}</td>
                <td>${customer.fullName}</td>
                <td>${customer.email}</td>
                <td>${customer.mobile}</td>
                <td>${customer.organization}</td>
                <td>${device.repairProdItems[0].name}</td>
                <td>${device.status.name}</td>
                <td>${device.price}</td>
            `;
            tableBody.appendChild(row);
        });
    });
}

function displayError(errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerText = errorMessage;
    document.body.appendChild(errorDiv);
}
