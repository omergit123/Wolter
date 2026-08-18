#ifndef GET_H
#define GET_H
#include "ICommand.h"
#include "IData.h"
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>

class Get : public ICommand {
private:
    IData* data;
public:
    Get(IData* data);
    // Executes the recommend command with the given arguments. It returns a CommandResult struct containing a success flag and a vector of recommended product IDs. 
    CommandResult execute(const std::vector<std::string>& args) override;
    // Returns the format of recommend command.
    std::string details() const override;
    // This function sorts the products based on their weight in descending order. If two products have the same weight, they are sorted by their product ID in ascending order.
    std::vector<std::string> sortProductsByWeight(std::vector<std::pair<std::string, int>>& productWeights);
};
#endif // GET_H