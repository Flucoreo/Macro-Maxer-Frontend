import "./staged_meal.css"

export default function StagedMeal( {ingredients} ){
    

    const meals = ingredients.map((content, index) => (
        <p className="staged-meal-data" key={index}>{content}</p>
    ))

    return (
        <div className="staged-meal">
            {meals}
        </div>
    );
}