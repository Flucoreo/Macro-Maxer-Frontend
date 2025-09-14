import "./meal.css"

export default function Meal(){

    return (
        <div className="meal-container">
            <div className="meal-data">
                <h3 className="meal-name">Breakfast</h3>
                <p className="meal-facts">Calories: 300, Protein 30g, Carbs: 30g, Fat: 15g, Overal Vitamins 30%DV</p>
                <div className="meal-hold-buttons">
                    <button className="meal-button">Edit<img className="meal-button-icon" src="/images/pencil.png" alt="pencil icon"/></button>
                    <button className="meal-button">Save Meal<img className="meal-button-icon" src="/images/save.png" alt="pencil icon"/></button>
                    <button className="meal-button">Add to Nutrition Breakdown <img className="meal-button-icon" src="/images/plus.png" alt="plus icon"/></button>
                </div>
            </div>
            
            <img className="meal-img" src="https://simply-delicious-food.com/wp-content/uploads/2019/07/Pancake-board-2.jpg" alt="breakfast picture"/>
        </div>
    );
}