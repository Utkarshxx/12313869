const axios = require("axios");
const { TOKEN } = require("./config");

async function Log(stack, level, pkg, message) {

    try {

        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        console.log(response.data);

    } catch (error) {

        console.log(error.message);

    }
}

module.exports = Log;