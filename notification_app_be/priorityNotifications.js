const axios = require("axios");
const { TOKEN } = require("./config");

const typeWeights = {
    Placement: 3,
    Result: 2,
    Event: 1
};

async function getPriorityNotifications() {

    try {

        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/notifications",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        const notifications = response.data.notifications;

        const prioritized = notifications.map((notification) => {

            const weight = typeWeights[notification.Type] || 0;

            const timestamp = new Date(notification.Timestamp).getTime();

            return {
                ...notification,
                priorityScore: weight * 1000000000000 + timestamp
            };

        });

        prioritized.sort((a, b) => b.priorityScore - a.priorityScore);

        const top10 = prioritized.slice(0, 10);

        console.log("Top 10 Priority Notifications:\n");

        top10.forEach((notification, index) => {

            console.log(
                `${index + 1}. [${notification.Type}] ${notification.Message}`
            );

        });

    } catch (error) {

        console.log(error.message);

    }

}

getPriorityNotifications();