#include "ClientSession.h"
using namespace std;

ClientSession::ClientSession(int client_fd, App* application) :
    fd(client_fd), app(application) {}

bool ClientSession::handleActivity() {
    char buffer[4096]; // used for reading data from the client.
    int bytes_received = recv(fd, buffer, sizeof(buffer), 0);

    if (bytes_received <= 0) { // The client has disconnected or an error uccurred.
        close(fd);
        return false;
    }

    this->sessionBuffer.append(buffer, bytes_received);

    size_t newLinePosition;
    while ((newLinePosition = sessionBuffer.find('\n')) != string::npos) {
        string line = this->sessionBuffer.substr(0, newLinePosition);
        string output = this->app->runStep(line);

        send(fd, output.c_str(), output.size(), 0); // Send the response back to the client.
        this->sessionBuffer.erase(0, newLinePosition + 1);
    }
    return true;
}
    