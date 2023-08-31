const client = app.initialized();

client.onReady().then(async function() {
    console.log("Dialog Script Initialized!");

    try {
        const ticketData = await client.data.get('ticket');
        if (ticketData && ticketData.ticket && ticketData.ticket.requester_id) {
            const contactData = await client.data.get('contact');
            if (contactData && contactData.contact && contactData.contact.id === ticketData.ticket.requester_id) {
                const email = contactData.contact.email;
                client.request.invoke('fetchCustomerInfo', { email: email }).then(function(response) {
                    const data = JSON.parse(response.response);
                    console.log(data); // Process or display the data as needed.
                }).catch(function(error) {
                    console.error("Error fetching customer data:", error);
                });
            }
        }
    } catch (error) {
        console.error("Error initializing the app:", error);
    }
});
