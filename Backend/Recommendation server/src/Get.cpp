#include "Get.h"

Get::Get(IData* data) : data(data) {}
CommandResult Get::execute(const std::vector<std::string>& args) {
    if (args.size() != 2) {
        return {false, "400", "Bad Request", {}};
    }
    std::string userId = args[0];
    std::string productId = args[1];
    // Get all users from the database
    std::vector<std::string> allProducts = data->getAllProducts();
    std::vector<std::string> allUsers = data->getAllUsers();
    
    if(std::find(allUsers.begin(), allUsers.end(), userId) == allUsers.end()
        || std::find(allProducts.begin(), allProducts.end(), productId) == allProducts.end()) {
        return {false, "404", "Not Found", {}};
    }
    std::vector<std::string> userOwnedProducts = data->getUserProducts(&userId);
    std::map<std::string, int> commonProductsCount;
    // Store the products of each user in a set for faster lookup
    std::map<std::string, std::set<std::string>> everyUserProducts;
    for (const std::string& otherUserId : allUsers) {
        // Get the products of the other user and store them in a set for faster lookup
        const std::vector<std::string>& productsVec = data->getUserProducts(&otherUserId);
        everyUserProducts[otherUserId] = std::set<std::string>(productsVec.begin(), productsVec.end());
        if (otherUserId == userId || !everyUserProducts[otherUserId].count(productId)) {
            continue; // Skip the same user and users without the product
        }
        // Count the number of common products between the user and the other user
        for (const std::string& product : userOwnedProducts) {
            if (everyUserProducts[otherUserId].count(product)) {
                commonProductsCount[otherUserId]++;
            }
        }
    }
    // Calculate the weight for each product based on the number of common products with other users who have the product.
    std::vector<std::pair<std::string, int>> productsWeight;
    for (const std::string& product : allProducts) {
        if (productId == product || data->userHasProduct(&userId, &product)) {
            continue; // Skip products the user already has or the product itself
        }
        int weight = 0;
        for (const auto& pair : commonProductsCount) {
            const std::string& otherUserId = pair.first;
            if (everyUserProducts[otherUserId].count(product)) {
                weight += pair.second; // Add the count of common products as weight
            }
        }
        if (weight > 0) {
            productsWeight.push_back({product, weight});
        }
    }
    // Sort the products by weight and return the sorted product IDs as recommendations.
    std::vector<std::string> recommendations = sortProductsByWeight(productsWeight);
    return {true, "200", "OK", recommendations};
}

std::string Get::details() const {
    return "GET, arguments: [userid] [productid]";
}
// This function sorts the products based on their weight in descending order. If two products have the same weight, they are sorted by their product ID in ascending order.
std::vector<std::string> Get::sortProductsByWeight(std::vector<std::pair<std::string, int>>& productWeights) {
    std::sort(productWeights.begin(), productWeights.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) {
            return a.second > b.second; // Sort by weight in descending order
        }
        return a.first < b.first; // If weights are equal, sort by product ID in ascending order
    });
    std::vector<std::string> sortedProductIds;
    for (const auto& pair : productWeights) {
        sortedProductIds.push_back(pair.first);
    }
    // Return only the top 10 recommendations
    std::vector<std::string> top10Recommendations(sortedProductIds.begin(), sortedProductIds.begin() + std::min(10, static_cast<int>(sortedProductIds.size())));
    return top10Recommendations;
}