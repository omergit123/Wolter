#ifndef CLIENTSESSION_H
#define CLIENTSESSION_H

#include "App.h"
#include <sys/select.h>
#include <memory>
#include <sys/socket.h>
#include <unistd.h>
#include <string>

class ClientSession
{
private:
    int fd; // Socket for the client.
    App* app;
    std::string sessionBuffer; // Buffer for storing received data.

public:
    ClientSession(int client_fd, App* application); // constructor
    bool handleActivity(); // Handle incoming data from the client
};

#endif //CLIENTSESSION_H