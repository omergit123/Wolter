import React, { useRef } from "react";
import "./BaseSlider.css";

// component for the base slider, used for restaurants.
const BaseSlider = ({ title, children }) => {
    const hasItems = React.Children.count(children) > 0;
    const sliderRef = useRef(null);

    const scroll = (scrollOffset) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: scrollOffset,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="base-slider-section">
            <div className="base-slider-header">
                <h2>{title}</h2>
                <div className="base-slider-arrows">
                    <button
                        onClick={() => scroll(-300)}
                        className="base-arrow-btn"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => scroll(300)}
                        className="base-arrow-btn"
                    >
                        →
                    </button>
                </div>
            </div>

            {!hasItems ? (
                <p>No items to display.</p>
            ) : (
                <div className="base-slider-container" ref={sliderRef}>
                    {React.Children.map(children, (child) => (
                        <div className="base-slider-item">{child}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BaseSlider;
