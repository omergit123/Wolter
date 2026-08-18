#include "Help.h"

using namespace std;

Help::Help(map<std::string, std::unique_ptr<ICommand>>& commands) : commandsMap(commands){
}

// override of the execute function, returns the details of all existing commands if there are no arguments, otherwise returns an error
CommandResult Help::execute(const std::vector<std::string>& args) {
    CommandResult result;
    // make sure there are no arguments, if there are any, set success to false and return
    if (!args.empty()) {
        result.success = false;
        result.exitCode = "400";
        result.exitStatus = "Bad Request";
        return result;
    }

    string output = "";
    for (const auto& pair : commandsMap) {
        if (pair.first == "HELP") {
            continue; 
        }
        if (pair.second) {
            output += pair.second->details() + "\n";
        }
    }
    output += helpDetails;
    result.output.push_back(output);
    result.success = true;
    return result;
}

// getter for the details of the help command, returns "help"
string Help::details() const {
    return this->helpDetails;
}