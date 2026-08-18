#ifndef FILEDB_H
#define FILEDB_H
#define DATA_FOLDER "../data"

#include "IData.h"
#include <string>
#include <vector>

class FileDB : public IData {
private:
    // Attribute to store the path to the data folder.
    std::string dataFolderPath;

    // Helper method to get the file path for a specific user.
    std::string getUserFilePath(const std::string* userId) const;

    // Helper method that returns products from a user file.
    std::vector<std::string> readProducts(const std::string& filePath);

    // Helper method to write products to a user file.
    void writeProducts(const std::string& filePath, const std::vector<std::string>& products);

public:
    // Constructor
    FileDB(std::string path = DATA_FOLDER);
    
    // Function to update new products to DB
    void update(const std::string* userId, const std::vector<std::string>* newProducts) override;
    
    // Function returns the products for a specific user.
    std::vector<std::string> getUserProducts(const std::string* userId) override;

    // Function returns all existing products from all users. No duplicates.
    std::vector<std::string> getAllProducts() override;

    // Function checks if a user has a specific product
    bool userHasProduct(const std::string* userId, const std::string* productId) override;
    
    // Function returns all users
    std::vector<std::string> getAllUsers() override;

    // Function to check if a user exists in the data store
    bool isUserExists(const std::string* userId) override;

    // Function to delete products from a specific user - if duplicate products are given, we will delete the product.
    void deleteProducts(const std::string* userId, const std::vector<std::string>* products) override;
};

#endif // FILEDB_H
