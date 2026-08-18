import { useNavigate } from "react-router-dom";
import "./CategoriesButtons.css";

const CATEGORIES = [
    { id: "italian", label: "italian", emoji: "🍝", apiType: "italian" },
    { id: "sushi", label: "sushi", emoji: "🍣", apiType: "sushi" },
    { id: "burger", label: "burger", emoji: "🍔", apiType: "burger" },
    { id: "vegan", label: "vegan", emoji: "🥗", apiType: "vegan" },
    { id: "bbq", label: "bbq", emoji: "🥩", apiType: "bbq" },
    { id: "cafe", label: "cafe", emoji: "☕", apiType: "cafe" },
    {
        id: "all-restaurants",
        label: "All Restaurants",
        emoji: "🍽️",
        apiType: "all",
    },
];

// func to generate categories buttons, on click navigate to the relevant category page
export default function CategoryButtons() {
    const navigate = useNavigate();

    return (
        <div className="div">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() =>
                        navigate(
                            cat.apiType === "all"
                                ? "/restaurants"
                                : `/category/${cat.apiType}`,
                        )
                    }
                    className="button"
                >
                    {cat.emoji} {cat.label}
                </button>
            ))}
        </div>
    );
}
