#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <set>
#include <map>
#include "FileDB.h"
#include <algorithm>

namespace fs = std::filesystem;

// Constructor
FileDB::FileDB(std::string path) : dataFolderPath(path) {
    if (!fs::exists(dataFolderPath)) {
        fs::create_directory(dataFolderPath);
    }
}

// Helper method to get the file path for a specific user
std::string FileDB::getUserFilePath(const std::string* userId) const {
    if (userId == nullptr) {
        return "";
    }

    return dataFolderPath + "/" + *userId + ".txt";
}

// Helper method that returns products from a user file
std::vector<std::string> FileDB::readProducts(const std::string& filePath) {
    std::vector<std::string> products;

    if (!fs::exists(filePath)) {
        // Empty vector
        return products;
    }

    // Opens automatically
    std::ifstream file(filePath);
    // Checking open success for being safe
    if (!file.is_open()) {
        // Empty vector
        return products;
    }

    std::string product;
    while (std::getline(file, product)) {
        products.push_back(product);
    }
    
    file.close();

    return products;
}

// Helper method to write products to a user file (overwrites / creates new file if it does not exist)
void FileDB::writeProducts(const std::string& filePath, const std::vector<std::string>& products) {
    if (filePath.empty()) {
        return;
    }

    // Opens automatically, overwriting existing content and creating the file if it does not exist
    std::ofstream outFile(filePath);
    // Checking open success for being safe
    if (!outFile.is_open()) {
        return;
    }
    
    if (!products.empty()) { // Writing new content only if there are products to add.
        for (const auto& product : products) {
            outFile << product << "\n";
        }
    }
    outFile.close();
}

// Function to update the products in text file for a specific user. No duplicates permitted.
void FileDB::update(const std::string* userId, const std::vector<std::string>* newProducts) {
    if (userId == nullptr || newProducts == nullptr || newProducts->empty()) {
        return;
    }

    std::string filePath = getUserFilePath(userId);
    std::vector<std::string> currentProducts = readProducts(filePath);

    // No duplicates permitted
    std::set<std::string> uniqueProducts(currentProducts.begin(), currentProducts.end());
    uniqueProducts.insert(newProducts->begin(), newProducts->end());

    currentProducts.assign(uniqueProducts.begin(), uniqueProducts.end());
    writeProducts(filePath, currentProducts);
}

// Function returns the products for a specific user.
std::vector<std::string> FileDB::getUserProducts(const std::string* userId) {
    std::vector<std::string> currentProducts;
    if (userId == nullptr) {
        return currentProducts;
    }

    std::string filePath = getUserFilePath(userId);
    // If file not exists, readProducts will return an empty vector
    auto products = readProducts(filePath);

    return std::vector<std::string>(products.begin(), products.end());
}

// Function returns all existing products from all users. No duplicates.
std::vector<std::string> FileDB::getAllProducts() {
    std::set<std::string> allProducts;

    for (const auto& entry : fs::directory_iterator(dataFolderPath)) {
        if (entry.is_regular_file()) {
            auto products = readProducts(entry.path().string());
            allProducts.insert(products.begin(), products.end());
        }
    }

    return std::vector<std::string>(allProducts.begin(), allProducts.end());
}

// Function checks if a user has a specific product
bool FileDB::userHasProduct(const std::string* userId, const std::string* productId) {
    if (userId == nullptr || productId == nullptr) {
        return false;
    }

    std::string filePath = getUserFilePath(userId);
    std::vector<std::string> products = readProducts(filePath);

    for (const auto& product : products) {
        if (product == *productId) {
            return true;
        }
    }

    return false;
}

// Function returns all users
std::vector<std::string> FileDB::getAllUsers() {
    std::vector<std::string> users;
    for (const auto& entry : fs::directory_iterator(dataFolderPath)) {
        if (entry.is_regular_file()) {
            std::string fileName = entry.path().filename().string();
            // Assuming the file name format is "userId.txt"
            if (fileName.size() > 4 && fileName.substr(fileName.size() - 4) == ".txt") {
                // Extract userId from file name
                users.push_back(fileName.substr(0, fileName.size() - 4)); 
            }
        }
    }
    std::sort(users.begin(), users.end());
    return users;
}

// Function to check if there is a file in data folder for a user
bool FileDB::isUserExists(const std::string* userId) {
    if (userId == nullptr || userId->empty()) {
        return false;
    }

    fs::path userFilePath = getUserFilePath(userId);
    return fs::exists(userFilePath) && fs::is_regular_file(userFilePath);
}

void FileDB::deleteProducts(const std::string* userId, const std::vector<std::string>* products) {
    if (!userId || !products) {
        return;
    }
    
    if (!isUserExists(userId) ||  products->empty()) {
        return;
    }

    std::string filePath = getUserFilePath(userId);
    std::vector<std::string> currentProducts = readProducts(filePath);

    // Create a set of products to delete for efficient lookup
    std::set<std::string> productsToDelete(products->begin(), products->end());

    // Remove the products to delete from the current products
    std::vector<std::string> updatedProducts;
    for (const auto& product : currentProducts) {
        if (productsToDelete.find(product) == productsToDelete.end()) {
            updatedProducts.push_back(product);
        }
    }

    writeProducts(filePath, updatedProducts);
}
