#include "Delete.h"
#include <iostream>
#include <set>

Delete::Delete(IData *d) : data(d) {}

// Update the user's products in the data store using the provided arguments when user exists in DB.
CommandResult Delete::execute(const std::vector<std::string>& args) {
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

    // Check no duplicate products are given in the arguments
    std::set<std::string> uniqueProducts(products.begin(), products.end());
    if (uniqueProducts.size() != products.size()) {
        result.exitCode = "404";
        result.exitStatus = "Not Found";
        return result;
    }

    // Check if the user has all the products to be deleted
    for (size_t i = 1; i < args.size(); i++) {
        if (!data->userHasProduct(&userId, &args[i])) {
            result.exitCode = "404";
            result.exitStatus = "Not Found";
            return result;
        }
    }

    // delete the products from the user in the data store - if duplicte products are given, we will delete the product
    data->deleteProducts(&userId, &products);

    result.success = true;
    result.exitCode = "204";
    result.exitStatus = "No Content";
    return result;
}

// Provide details about the Delete command, including its usage format
std::string Delete::details() const {
    return "DELETE, arguments: [userid] [productid1] [productid2]...";
}
