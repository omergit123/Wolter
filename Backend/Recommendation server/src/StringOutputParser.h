#ifndef STRINGOUTPUTPARSER_H
#define STRINGOUTPUTPARSER_H
#include "IOutputParser.h"
#include <string>
#include <vector>
#include <sstream>

class StringOutputParser : public IOutputParser {
public:
    StringOutputParser();
    // Override the outputFormat method to format the output for the user based on the CommandResult struct.
    std::string outputFormat(const CommandResult& result) const override;
private:
    // Helper functions, making the code more readable.
    std::string addOutput(const CommandResult& result) const;
    std::string addExitCodeAndStatus(const CommandResult& result) const;
};
#endif // STRINGOUTPUTPARSER_H