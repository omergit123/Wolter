import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import Login from "./components/WelcomePage/Login";
import MainPage from "./components/MainPage/MainPage";
import MyOrdersPage from "./components/MyOrdersPage/MyOrdersPage";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";
import NavBar from "./components/NavBar/NavBar";
import Register from "./components/Register/Register";
import UserPage from "./components/UserPage/UserPage";
import UserStoreDetails from "./components/MyStore/UserStoreDetails";
import CategoryPage from "./components/MainPage/CategoryPage";
import ProductPage from "./components/MainPage/ProductPage";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SingleProductPage from "./components/MainPage/SingleProductPage";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            {/* 1. Wrap the entire application inside the CartProvider so all pages can use the cart */}
            <CartProvider>
                <div className="App">
                    <header className="app-header"> </header>
                    <NavBar />
                    <Routes>
                        {/* Public Routes - Open to everyone */}
                        <Route
                            path="/"
                            element={
                                <WelcomePage
                                    title="Welcome to Wolter!"
                                    content="Whenever you're hungry"
                                />
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes - Require a token to enter */}
                        <Route
                            path="/main"
                            element={
                                <ProtectedRoute>
                                    <MainPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <MyOrdersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <UserPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/myRestaurants"
                            element={
                                <ProtectedRoute>
                                    <UserStoreDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/category/:type"
                            element={
                                <ProtectedRoute>
                                    <CategoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/restaurants"
                            element={
                                <ProtectedRoute>
                                    <CategoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/restaurants/:restaurantId/products"
                            element={
                                <ProtectedRoute>
                                    <ProductPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/restaurants/:restaurantId/products/:productId"
                            element={
                                <ProtectedRoute>
                                    <SingleProductPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;
