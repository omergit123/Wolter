#ifndef ICommand_H
#define ICommand_H
#include <string>
#include <vector>

// Struct to represent the result of executing a command, including success status and output messages if there are any
struct CommandResult {
    bool success;
    std::string exitCode;
    std::string exitStatus;
    std::vector<std::string> output;
};

class ICommand {
public:
    virtual ~ICommand() = default;
    /*
     * Executes the command with the given arguments and returns a CommandResult indicating success 
     * and any output messages.
     */
    virtual CommandResult execute(const std::vector<std::string>& args) = 0;
    // Used for help command to provide the format of the command.
    virtual std::string details() const = 0;
};

#endif // ICommand_H
