const { getAllUsers } = require("../services/users");
const net = require("node:net");

let isConnected = false;
// Create a TCP client to connect to the C++ backend server
const client = net.createConnection({ port: 8080, host: "cpp-backend" }, () => {
    isConnected = true;
});

// Use a promise chain to ensure that messages are sent in order and we wait for the response before sending the next message
let queueChain = Promise.resolve();

// Handle connection closure
client.on("end", () => {
    isConnected = false;
});
client.on("error", (err) => {
    console.error("Global TCP Client Error:", err.message);
    isConnected = false;
});

// Function to send a command to the TCP server and wait for the response
const sendTcpCommand = (message) => {
    queueChain = queueChain.then(() => {
        return new Promise((resolve) => {
            if (!isConnected) {
                console.error("TCP Client is not connected!");
                return resolve(false);
            }

            const timeout = setTimeout(() => {
                client.off("data", onData);
                console.error("TCP timeout");
                resolve(false);
            }, 5000);

            // Buffer to accumulate data from the server
            let buffer = "";

            const onData = (data) => {
                buffer += data.toString();
                // Assuming the C++ server returns \n at the end of its response
                if (buffer.includes("\n")) {
                    clearTimeout(timeout);
                    client.off("data", onData);
                    const response = buffer.trim();
                    // Assuming the C++ server returns a response starting with "400" for success
                    if (!response.startsWith("400")) {
                        resolve(true);
                    } else {
                        console.error("Server returned error:", response);
                        resolve(false);
                    }
                }
            };

            client.on("data", onData);

            client.write(message, "utf8", (err) => {
                if (err) {
                    clearTimeout(timeout);
                    client.off("data", onData);

                    console.error("TCP write error:", err);
                    isConnected = false;
                    resolve(false);
                }
            });
        });
    });
    return queueChain;
};

// Function to send a message to the TCP server to delete a product from all users' watched products list
const deleteProduct = async (productId) => {
    const allUsers = await getAllUsers();

    for (const user of allUsers) {
        const success = await sendTcpCommand(
            `DELETE ${user.id} ${productId}\n`,
        );

        if (!success) {
            console.error(
                `Failed deleting product ${productId} from user ${user.id}`,
            );
            return false;
        }
    }
    return true;
};
/*
 * Function to add a product to user's watched products list
 * sends a message to the TCP server to add the product to the user's list
 * tries to send two messages, one for POST and one for PATCH,
 * to cover both cases of adding a new product for a new/old user
 */
const addProduct = async (userId, productId) => {
    let postSuccess = await sendTcpCommand(`POST ${userId} ${productId}\n`);
    let patchSuccess = await sendTcpCommand(`PATCH ${userId} ${productId}\n`);

    return postSuccess || patchSuccess;
};

module.exports = {
    deleteProduct,
    addProduct,
};
