document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
});

async function initializeApp() {
    var client = await app.initialized();
    client.events.on("app.activated", onAppActivated);

    async function onAppActivated() {
        try {
            const ticketData = await client.data.get('ticket');
            if (ticketData && ticketData.ticket && ticketData.ticket.requester_id) {
                const requesterId = ticketData.ticket.requester_id;
                const contactData = await client.data.get('contact');
                if (contactData && contactData.contact && contactData.contact.id === requesterId) {
                    const requesterName = contactData.contact.name;
                    document.querySelector('.customer-info').innerText = `${requesterName}`;
                } else {
                    document.querySelector('.customer-info').innerText = "Customer name not available.";
                }
            } else {
                document.querySelector('.customer-info').innerText = "No ticket data available.";
            }
        } catch (error) {
            console.error("Error fetching ticket or contact data:", error);
            document.querySelector('.customer-info').innerText = "Error fetching data.";
        }
    }

    document.getElementById("view-tickets-btn").addEventListener("click", function() {
        console.log("Button Clicked!");
        client.interface.trigger("showDialog", {
            title: "Tickets from RepairDesk",
            template: "view_tickets_dialog.html"
        });
    });
}
