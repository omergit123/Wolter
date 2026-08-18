#include "Patch.h"
#include <iostream>

Patch::Patch(IData *d) : data(d) {}

// Update the user's products in the data store using the provided arguments when user exists in DB.
CommandResult Patch::execute(const std::vector<std::string>& args) {
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

    if (!data->isUserExists(&userId)) {
        result.exitCode = "404";
        result.exitStatus = "Not Found";
        return result;
    }

    data->update(&userId, &products);

    result.success = true;
    result.exitCode = "204";
    result.exitStatus = "No Content";
    return result;
}

// Provide details about the Patch command, including its usage format
std::string Patch::details() const {
    return "PATCH, arguments: [userid] [productid1] [productid2]...";
}
