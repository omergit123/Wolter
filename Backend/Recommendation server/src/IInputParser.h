#ifndef IINPUTPARSER_H
#define IINPUTPARSER_H
#include <string>
#include <vector>

// Struct to hold the command name and its arguments.
struct commandRequest {
    std::string name;
    std::vector<std::string> args;
};

class IInputParser {
public:
    virtual ~IInputParser() = default;
    // returns a commandRequest struct containing the command name and its arguments.
    virtual commandRequest getCommand(const std::string& commandLine) = 0;
};

#endif // IINPUTPARSER_H