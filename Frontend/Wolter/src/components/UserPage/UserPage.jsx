import { Link, useNavigate } from "react-router-dom";
import UserDetails from "./UserDetails/UserDetails";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./UserPage.css";

export default function UserPage() {
    const { user, profileImageUrl, loadingUser } = useAuthorization();
    const navigate = useNavigate();

    const placeholderUrl = "https://via.placeholder.com/200?text=No+Image";

    if (loadingUser) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Failed to load user.</p>;
    }

    return (
        <div className="page profile-page">
            <div className="profile-card">
                <div className="profile-avatar">
                    <img
                        className="profile-image"
                        src={profileImageUrl || placeholderUrl}
                        alt={user.name}
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = placeholderUrl;
                        }}
                    />
                </div>

                <UserDetails user={user} />

                <div className="user-actions">
                    <Link to="/orders" className="btn btn-secondary">
                        My Orders
                    </Link>

                    {user?.role === "restaurantOwner" ? (
                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("/myRestaurants", {
                                    state: { userData: user },
                                })
                            }
                        >
                            My Restaurants
                        </button>
                    ) : (
                        <span className="profile-role-chip">Regular user</span>
                    )}
                </div>
            </div>
        </div>
    );
}