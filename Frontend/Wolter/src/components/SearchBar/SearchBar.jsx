import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../config";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./SearchBar.css";

// function of search bar that allows users to search for restaurants and products.
function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuthorization();

    useEffect(() => {
        if (!query.trim()) {
            setLoading(false);
            setResults([]);
            return;
        }

        setLoading(true);
        setResults([]);

        let active = true;
        const timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `${API_URL}/search/${encodeURIComponent(query)}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    },
                );
                const data = await response.json();
                if (active) {
                    setResults(data);
                }
            } catch (err) {
                console.error(err);
                if (active) {
                    setResults([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }, 500);

        return () => {
            active = false;
            clearTimeout(timeout);
        };
    }, [query, token]);

    const restaurants = results.filter((item) => item.type === "restaurant");
    const products = results.filter((item) => item.type === "product");

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search restaurants or dishes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />

            {loading && <div className="search-status">Loading...</div>}

            {!loading && query.trim() && results.length === 0 && (
                <div className="search-status">No results found</div>
            )}

            {results.length > 0 && (
                <div className="search-results-wrapper">
                    {restaurants.length > 0 && (
                        <div className="search-group">
                            <h3 className="search-group-title">Restaurants</h3>
                            <div className="search-results-grid">
                                {restaurants.map((item) => (
                                    <Link
                                        key={item.id || item._id}
                                        to={`/restaurants/${item.id || item._id}/products`}
                                        className="search-result"
                                    >
                                        <h4>name: {item.name}</h4>
                                        <p>description: {item.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="search-group">
                            <h3 className="search-group-title">Products</h3>
                            <div className="search-results-grid">
                                {products.map((item) => (
                                    <Link
                                        key={item.id || item._id}
                                        to={`/restaurants/${item.restaurantId}/products/${item.id || item._id}`}
                                        className="search-result"
                                    >
                                        <h4>name: {item.name}</h4>
                                        <p>description: {item.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
