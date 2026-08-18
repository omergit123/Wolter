#include "Server.h"
#include <iostream>
#include <arpa/inet.h>

Server::Server(const std::string& ip, int port, App* application) : 
    server_fd(-1), ip(ip), port(port), app(application) {} //server_fd init to -1 because it isn't setup yet.


// Creating the listening socket
void Server::setupServer(){
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1) {
        perror("Failed to create socket");
        exit(EXIT_FAILURE);
    }
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    sockaddr_in address{};
    address.sin_family = AF_INET;
    address.sin_port = htons(port);

    if (inet_pton(AF_INET, ip.c_str(), &address.sin_addr) <= 0) {
        std::cerr << "Invalid IP address format: " << ip << std::endl;
        exit(EXIT_FAILURE);
    }

    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        perror("Bind failed");
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 10) < 0) {
        perror("Listen failed");
        exit(EXIT_FAILURE);
    }
}

void Server::handleNewConnection() {
    sockaddr_in client_address{};
    socklen_t addr_len = sizeof(client_address);
    
    // Aceepting the client and getting his socket.
    int client_fd = accept(server_fd, (struct sockaddr*)&client_address, &addr_len);
    if (client_fd < 0) {
        perror("Accept failed");
        return;
    }

    // New Session - from now on, the responsibility passses to the Client Session class.
    client_sessions[client_fd] = std::make_unique<ClientSession>(client_fd, app);
}

void Server::run() {
    setupServer(); // First, setting up the server.

    // Listening for good for new clients, and passing the responsibility to the Client Session class.
    while (true) {
        fd_set read_fds;
        FD_ZERO(&read_fds); // Initialize the list of fd's in case a socket was closed.

        // main socket adding
        FD_SET(server_fd, &read_fds);
        int max_fd = server_fd;

        // adding client's socket to the list.
        for (auto const& [fd, session] : client_sessions) {
            FD_SET(fd, &read_fds);
            max_fd = std::max(max_fd, fd);
        }

        // Selecting the activity to handle
        int activity = select(max_fd + 1, &read_fds, nullptr, nullptr, nullptr);
        if (activity < 0) {
            perror("Select error");
            continue;
        }

        // new client trying to connect.
        if (FD_ISSET(server_fd, &read_fds)) {
            handleNewConnection();
        }

        // dealing with existing clients.
        for (auto it = client_sessions.begin(); it != client_sessions.end(); ) {
            int fd = it->first;
            ClientSession* session = it->second.get();

            if (FD_ISSET(fd, &read_fds)) {
                // checking if the activity was termination. in any case, doing the activity.
                bool is_alive = session->handleActivity(); 

                if (!is_alive) {
                    it = client_sessions.erase(it);
                    continue;
                }
            }
            ++it; // the client is still connected.
        }
    }
}