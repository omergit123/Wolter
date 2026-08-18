#ifndef IDATA_H
#define IDATA_H

#include <string>
#include <vector>

// Interface for data storage and retrieval
class IData {
public:
    // Default virtual destructor to ensure proper cleanup of derived classes
    virtual ~IData() = default;

    // Function to update the products for a specific user
    virtual void update(const std::string* userId, const std::vector<std::string>* newProducts) = 0;
    
    // Function to get the products for a specific user
    virtual std::vector<std::string> getUserProducts(const std::string* userId) = 0;
    
    // Function to get all existing products from all users - no duplicates
    virtual std::vector<std::string> getAllProducts() = 0;

    // Function to check if a user has a specific product
    virtual bool userHasProduct(const std::string* userId, const std::string* productId) = 0;

    // Function to get all existing users
    virtual std::vector<std::string> getAllUsers() = 0;

    // Function to check if a user exists in the data store
    virtual bool isUserExists(const std::string* userId) = 0;

    // Function to delete products from a specific user
    virtual void deleteProducts(const std::string* userId, const std::vector<std::string>* products) = 0;
};

#endif // IDATA_H