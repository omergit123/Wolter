#include "App.h"
using namespace std;

App::App(map<string, unique_ptr<ICommand>>& commands, IInputParser& inputParser, IOutputParser& outputParser, IData& data) : 
    commands(commands), inputParser(inputParser), outputParser(outputParser), data(data)
{
    // Initialize the application with the provided commands, input, and output.
}

string App::runStep(const string& clientRequest) {
        // Get the command request from the input interface.
        commandRequest request = this->getCommand(clientRequest);
        // Execute it
        CommandResult result = this->runCommand(request);
        // Parse result to response string
        string response = this->parseResponse(result);
        return response;
}

commandRequest App::getCommand(const string& clientRequest) const {
    // Get the command request from the input interface.
    return inputParser.getCommand(clientRequest);
}

CommandResult App::runCommand(const commandRequest& request){
        CommandResult result;
        // Find the command in the commands map.
        auto it = commands.find(request.name);
        if (it != commands.end()) {
            // If found execute the command and get the result.
            result = it->second->execute(request.args);
        }
         else {
            result = {false, "400", "Bad Request", {}};
        }
        return result;
}

string App::parseResponse(const CommandResult& result) const {
    return outputParser.outputFormat(result);
}