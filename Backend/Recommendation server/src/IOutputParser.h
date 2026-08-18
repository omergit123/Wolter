#ifndef IOUTPUTPARSER_H
#define IOUTPUTPARSER_H
// for CommandResult struct
#include "ICommand.h"
#include <vector>
#include <string>

class IOutputParser {
    public:
        ~IOutputParser() = default;
        // Function formats output for the user.
        virtual std::string outputFormat(const CommandResult& result) const = 0;
};

#endif // IOUTPUTPARSER_H