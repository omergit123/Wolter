#ifndef APP_H
#define APP_H

#include <map>
#include "ICommand.h"
#include "IInputParser.h"
#include "IOutputParser.h"
#include "IData.h"
#include <memory>
#include <string>



class App{
    public:
        App(std::map<std::string, std::unique_ptr<ICommand>>& commands, IInputParser& inputParser, IOutputParser& outputParser,IData& data);
        commandRequest getCommand(const std::string& clientRequest) const;
        CommandResult runCommand(const commandRequest& request);
        std::string parseResponse(const CommandResult& result) const;
        std::string runStep(const std::string& request);

    private:
        std::map<std::string, std::unique_ptr<ICommand>>& commands;
        IInputParser& inputParser;
        IOutputParser& outputParser;
        IData& data;
};

#endif // APP_H