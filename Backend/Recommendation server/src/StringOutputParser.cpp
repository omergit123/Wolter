#include "StringOutputParser.h"
using namespace std;


// Constructor.
StringOutputParser::StringOutputParser() {}

// Formats the output for the user based on the CommandResult struct. the output will include the exit code followed by the output.
string StringOutputParser::outputFormat(const CommandResult& result) const {
    // If the exit code, exit status and output are empty, return empty string.
    if (result.exitCode.empty() && result.output.empty() && result.exitStatus.empty()) {
        return "";
    }

    stringstream ss;
    // adding ExitCode and status if available.
    if (!result.exitCode.empty() || !result.exitStatus.empty()) {
        ss << addExitCodeAndStatus(result);
        // the case that the result is successful and we have output
        if (!result.output.empty() && result.success) {
            ss << "\n" << addOutput(result);
        }
        // Finally, returning the final result.
        return ss.str();
    }

    // There are no exit code and status, but there is output according to the flow.
    ss << addOutput(result);
    return ss.str();   
}

// supplying the wxit status and code to the format.
string StringOutputParser::addExitCodeAndStatus(const CommandResult& result) const {
    stringstream ss;
    if (!result.exitCode.empty() && !result.exitStatus.empty()) {
        ss << result.exitCode << " " << result.exitStatus << "\n";
        return ss.str();
    }
    return "";

}

// supplying the outfut for the format.
string StringOutputParser::addOutput(const CommandResult& result) const {
    stringstream ss;
    string separator = "";
    for (const auto& item : result.output) {
        ss << separator << item;
        // initializing the separator only after the first loop - in case there is 1 output item only.
        separator = " ";
    }
    ss << "\n";
    return ss.str();
}

