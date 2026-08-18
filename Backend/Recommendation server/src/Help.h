#ifndef HELP_H
#define HELP_H

#include "ICommand.h"
#include <string>
#include <vector>
#include <map>
#include <stdio.h>
#include <iostream>
#include <memory>


class Help : public ICommand
{
    public:
        Help(std::map<std::string, std::unique_ptr<ICommand>>& commands);
        ~Help() = default;
        CommandResult execute(const std::vector<std::string>& args = {}) override;
        std::string details() const override;

    private:
        std::string helpDetails = "help";
        std::map<std::string, std::unique_ptr<ICommand>>& commandsMap;
        std::vector<std::string> allCommandsDetails;
};

#endif
