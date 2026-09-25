const { getAllUsers } = require("../services/users");
const net = require("node:net");

const HOST = "cpp-backend";
const PORT = "8080";

let client = null;
let isConnected = false;
let reconnectTimer = null;

// Initialize TCP client connection
const initClient = () => {
    if (client && !client.destroyed) {
        return;
    }

    if (client) {
        client.destroy();
        client.removeAllListeners();
    }

    client = net.createConnection({ port: PORT, host: HOST }, () => {
        isConnected = true;
        console.log(`Connected to TCP recommendation server at ${HOST}:${PORT}`);
    });

    client.on("end", () => {
        isConnected = false;
    });

    client.on("close", () => {
        isConnected = false;
        if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                initClient();
            }, 3000);
        }
    });

    client.on("error", (err) => {
        console.error("Global TCP Client Error:", err.message);
        isConnected = false;
    });
};

initClient();

// Use a promise chain to ensure that messages are sent in order and we wait for the response before sending the next message
let queueChain = Promise.resolve();

// Function to send a command to the TCP server and wait for the response
// Supports POST, PATCH, DELETE, and GET.
// Returns data ONLY for GET (array of product IDs, or null on error).
// Returns boolean (true/false) for POST, PATCH, DELETE.
const sendTcpCommand = (message) => {
    queueChain = queueChain.then(async () => {
        if (!isConnected || !client || client.destroyed) {
            initClient();
            const startTime = Date.now();
            while (!isConnected && Date.now() - startTime < 2000) {
                await new Promise((r) => setTimeout(r, 100));
            }
        }

        return new Promise((resolve) => {
            const formattedMessage = message.endsWith("\n") ? message : `${message}\n`;
            const trimmed = formattedMessage.trim();
            const command = trimmed.split(/\s+/)[0].toUpperCase();
            const isGet = command === "GET";

            if (!isConnected) {
                console.error("TCP Client is not connected!");
                return resolve(isGet ? null : false);
            }

            let buffer = "";
            let timer = null;
            let bodyTimer = null;

            const cleanup = () => {
                if (timer) clearTimeout(timer);
                if (bodyTimer) clearTimeout(bodyTimer);
                if (client) {
                    client.off("data", onData);
                }
            };

            // Global timeout for this command (5 seconds)
            timer = setTimeout(() => {
                cleanup();
                console.error(`TCP timeout for command: ${trimmed}`);
                resolve(isGet ? null : false);
            }, 5000);

            const onData = (chunk) => {
                buffer += chunk.toString();

                if (!isGet) {
                    // For POST, PATCH, DELETE: response is a single line ending with \n
                    // Success responses: 201 Created (POST), 204 No Content (PATCH, DELETE)
                    if (buffer.includes("\n")) {
                        cleanup();
                        const responseLine = buffer.trim();
                        const statusCode = responseLine.split(/\s+/)[0];
                        const isSuccess = statusCode.startsWith("2");
                        if (!isSuccess) {
                            console.error(`TCP server error (${command}):`, responseLine);
                        }
                        // Returns boolean only, no data returned
                        resolve(isSuccess);
                    }
                } else {
                    // For GET: success response format is "200 Ok\n\n[product_list]\n"
                    // Error format is "400 Bad Request\n", "404 Not Found\n", etc.
                    const firstNewline = buffer.indexOf("\n");
                    if (firstNewline !== -1) {
                        const firstLine = buffer.substring(0, firstNewline).trim();
                        const statusCode = firstLine.split(/\s+/)[0];
                        if (!statusCode.startsWith("2")) {
                            cleanup();
                            console.error(`TCP server error (GET):`, firstLine);
                            return resolve(null);
                        }
                    }

                    // Check if response contains double newline \n\n indicating the body section
                    const doubleNewlineIndex = buffer.indexOf("\n\n");
                    if (doubleNewlineIndex !== -1) {
                        const body = buffer.slice(doubleNewlineIndex + 2);
                        if (body.includes("\n")) {
                            cleanup();
                            const productList =
                                body.trim().length > 0 ? body.trim().split(/\s+/) : [];
                            return resolve(productList);
                        }
                    } else if (buffer.includes("\n")) {
                        // Received "200 OK\n" without body (empty recommendations)
                        if (bodyTimer) clearTimeout(bodyTimer);
                        bodyTimer = setTimeout(() => {
                            cleanup();
                            resolve([]);
                        }, 50);
                    }
                }
            };

            client.on("data", onData);

            client.write(formattedMessage, "utf8", (err) => {
                if (err) {
                    cleanup();
                    console.error("TCP write error:", err);
                    isConnected = false;
                    resolve(isGet ? null : false);
                }
            });
        });
    });
    return queueChain;
};

// Helper to normalize product arguments (supports both array and spread arguments)
const normalizeProducts = (productsArgs) => {
    if (productsArgs.length === 1 && Array.isArray(productsArgs[0])) {
        return productsArgs[0].map(String).filter(Boolean);
    }
    return productsArgs.flat().map(String).filter(Boolean);
};

// 1. POST [userid] [productid1] [productid2] ...
// Associates a list of product IDs with a specific user if the user does not already exist.
// Returns boolean (true on 201 Created, false otherwise). No data returned.
const post = async (userId, ...productIds) => {
    const products = normalizeProducts(productIds);
    if (!userId || products.length === 0) {
        console.error("POST requires userId and at least one productId");
        return false;
    }
    return await sendTcpCommand(`POST ${userId} ${products.join(" ")}\n`);
};

// 2. PATCH [userid] [productid1] [productid2] ...
// Appends new product purchases to an existing user profile.
// Returns boolean (true on 204 No Content, false otherwise). No data returned.
const patch = async (userId, ...productIds) => {
    const products = normalizeProducts(productIds);
    if (!userId || products.length === 0) {
        console.error("PATCH requires userId and at least one productId");
        return false;
    }
    return await sendTcpCommand(`PATCH ${userId} ${products.join(" ")}\n`);
};

// 3. DELETE [userid] [productid1] [productid2] ...
// Removes specific product associations from a user's history.
// Returns boolean (true on 204 No Content, false otherwise). No data returned.
const deleteUserProducts = async (userId, ...productIds) => {
    const products = normalizeProducts(productIds);
    if (!userId || products.length === 0) {
        console.error("DELETE requires userId and at least one productId");
        return false;
    }
    return await sendTcpCommand(`DELETE ${userId} ${products.join(" ")}\n`);
};

// 4. GET [userid] [productid]
// Generates up to 10 product recommendations for a user based on a specific product.
// Returns data: array of recommended product IDs (or null on failure).
const get = async (userId, productId) => {
    if (!userId || !productId) {
        console.error("GET requires userId and productId");
        return null;
    }
    return await sendTcpCommand(`GET ${userId} ${productId}\n`);
};

// Compatibility function to add a product to user's watched products list
const addProduct = async (userId, productId) => {
    let postSuccess = await post(userId, productId);
    let patchSuccess = await patch(userId, productId);

    return postSuccess || patchSuccess;
};

// Function to delete product(s).
// Supports both:
// - deleteProduct(productId): legacy usage, deletes productId from all users' history
// - deleteProduct(userId, ...productIds): deletes products from specific user
const deleteProduct = async (...args) => {
    if (args.length === 1 && typeof args[0] === "string") {
        const productId = args[0];
        try {
            const allUsers = await getAllUsers();
            for (const user of allUsers) {
                await sendTcpCommand(`DELETE ${user.id} ${productId}\n`);
            }
            return true;
        } catch (err) {
            console.error("Error deleting product across users:", err);
            return false;
        }
    }

    const [userId, ...productIds] = args;
    return await deleteUserProducts(userId, ...productIds);
};

module.exports = {
    sendTcpCommand,
    post,
    patch,
    delete: deleteUserProducts,
    del: deleteUserProducts,
    deleteUserProducts,
    get,
    getRecommendations: get,
    addProduct,
    deleteProduct,
};