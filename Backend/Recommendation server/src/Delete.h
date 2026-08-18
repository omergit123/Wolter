#ifndef DELETE_H
#define DELETE_H

#include "ICommand.h"
#include "IData.h"   

class Delete : public ICommand {
private:
    IData* data;

// No need for destructor since we are not managing the memory of IData* data
public:
    // Constructor
    Delete(IData* d);
    
    // Override the execute method to delete products for a user in the data store when user exists in DB.
    CommandResult execute(const std::vector<std::string>& args) override; 
    // Override the details method to provide information about the Delete command
    std::string details() const override;
};

#endif // DELETE_H