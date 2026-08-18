#ifndef STRINGINPUTPARSER_H
#define STRINGINPUTPARSER_H

#include "IInputParser.h"
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <cctype>

class StringInputParser : public IInputParser {
public:
    StringInputParser();
    // Override the getCommand method to parse the input string and return a commandRequest struct.
    commandRequest getCommand(const std::string& input) override;
private:
    void toUpperCase(std::string& str);
};

#endif // STRINGINPUTPARSER_H