#ifndef POST_H
#define POST_H

#include "ICommand.h"
#include "IData.h"   

class Post : public ICommand {
private:
    IData* data;

// No need for destructor since we are not managing the memory of IData* data
public:
    // Constructor
    Post(IData* d);
    
    // Override the execute method to add products for a user in the data store when user does not exist in DB.
    CommandResult execute(const std::vector<std::string>& args) override; 
    // Override the details method to provide information about the Post command
    std::string details() const override;
};

#endif // POST_H