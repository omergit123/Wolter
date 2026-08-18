#ifndef PATCH_H
#define PATCH_H

#include "ICommand.h"
#include "IData.h"   

class Patch : public ICommand {
private:
    IData* data;

// No need for destructor since we are not managing the memory of IData* data
public:
    // Constructor
    Patch(IData* d);
    
    // Override the execute method to add products for a user in the data store when user exists in DB.
    CommandResult execute(const std::vector<std::string>& args) override; 
    // Override the details method to provide information about the Patch command
    std::string details() const override;
};

#endif // PATCH_H