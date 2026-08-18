#include "StringInputParser.h"
using namespace std;
// Constructor.
StringInputParser::StringInputParser() {}

// Parses the input string and returns a commandRequest struct containing the command name and its arguments.
commandRequest StringInputParser::getCommand(const string& input){
    // Split the input line into tokens using space as a delimiter. The first token is the command name, and the rest are arguments.
    vector<string> tokens;
    string token;
    stringstream stream(input);
    while (getline(stream, token, ' ')) {
        // If the token is not empty, add it to the list of tokens.
        if (!token.empty()) {
            tokens.push_back(token);
        }
    }

    // If there are no tokens, return an empty commandRequest. Otherwise, return the first token as the command name and the rest as arguments.
    if (tokens.empty()) {
        return {"", {}};
    }

    // Convert the command name to uppercase to make it case-insensitive.
    toUpperCase(tokens[0]);
    // Extracting the args.
    vector<string> args(tokens.begin() + 1, tokens.end());
    // Return the commandRequest struct containing the command name and its arguments.
    return {tokens[0], std::move(args)};
}

// Helper function to convert a string to uppercase.
void StringInputParser::toUpperCase(string& str) {
    std::transform(str.begin(), str.end(), str.begin(), [](unsigned char c) {
        return std::toupper(c);
    });
}