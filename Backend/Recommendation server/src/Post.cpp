#include "Post.h"
#include <iostream>

Post::Post(IData *d) : data(d) {}

// Update the user's products in the data store using the provided arguments when user does not exist in DB.
CommandResult Post::execute(const std::vector<std::string>& args) {
    CommandResult result;
    // Initialize the result as unsuccessful by default
    result.success = false;

    if (data == nullptr || args.empty() || args.size() < 2) {
        result.exitCode = "400";
        result.exitStatus = "Bad Request";
        return result;
    }
    std::string userId = args[0];
    std::vector<std::string> products(args.begin() + 1, args.end());

    if (data->isUserExists(&userId)) {
        result.exitCode = "404";
        result.exitStatus = "Not Found";
        return result;
    }

    data->update(&userId, &products);

    result.success = true;
    result.exitCode = "201";
    result.exitStatus = "Created";
    return result;
}

// Provide details about the Post command, including its usage format
std::string Post::details() const {
    return "POST, arguments: [userid] [productid1] [productid2]...";
}
