#ifndef SERVER_H
#define SERVER_H

#include <map>
#include <string>
#include <sys/select.h>
#include <memory>
#include <netinet/in.h>
#include "ClientSession.h"
#include "App.h"

class Server{
private:
    int server_fd; // Listenning socket
    std::string ip; // Server's IP
    int port; // Server's port
    std::map<int, std::unique_ptr<ClientSession>> client_sessions; // Map for each client's session.
    App* app;

    // helper functions.
    void setupServer();
    void handleNewConnection();

public:
    Server(const std::string& ip, int port, App* application); // constructor
    void run();
};
#endif //SERVER_H