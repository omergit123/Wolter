export default function UserDetails({ user }) {
    return (
        <div className="profile-details">
            <h2>{user.name}</h2>

            <div className="profile-field">
                <span className="profile-label">Username</span>
                <span className="profile-value">{user.username}</span>
            </div>

            <div className="profile-field">
                <span className="profile-label">Phone</span>
                <span className="profile-value">{user.phoneNumber}</span>
            </div>

            <div className="profile-field">
                <span className="profile-label">Role</span>
                <span className="profile-value">{user.role}</span>
            </div>
        </div>
    );
}
