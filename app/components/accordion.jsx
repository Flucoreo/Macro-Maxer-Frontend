"use client";
import "./accordion.css"

import LinearProgress from '@mui/joy/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { extendTheme } from '@mui/joy/styles';


export function NutrientAccordion( {data, title} ){

    // calculate an overall progress
    let ratioTotal = 0;
    let counter = 0;

    const VitaminComponents = Object.entries(data).map(([key, value]) => {

        if (value.target != 0){
            let ratio = Math.min(1, (Number(value.amount) / Number(value.target)));
            ratioTotal += ratio;
            counter += 1;
        }

        const getMeasurement = (title, nutrient) => {
            if (title == "Carbs") return "g"

            if (title == "Fats and Cholesterol"){
                if (nutrient.slice(-3) == "Fat"){
                    return "g"
                }
            }

            return "mg"
        }

        return (
            <div className="nutrition-items" key={key}>
                <div className="nutrition-items-data">
                    <p className="nutrient-name">{key}</p>
                    <div className="nutrient-ammount-percentage-container">
                        <p>{value.amount}/{value.target} {getMeasurement(title, key)}</p>
                        <p>{value.target != 0 ? (Math.round((value.amount / value.target) * 100)) + "% DV" : ""}</p>
                    </div>
                </div>
                <LinearProgress
                    color="success"
                    determinate
                    size="lg"
                    value={Math.min((value.amount / value.target) * 100, 100)}
                    variant="soft"
                />
            </div>
        );
    });


    return (
        <div className="acordion-container">
            <Accordion 
                sx={{
                    boxShadow: "none",
                    border: '1px solid #dee4dc',
                    padding: 1,
                    "&.MuiPaper-root": {
                        borderRadius: "12px",
                    },
                }}
                // defaultExpanded
            >
                <AccordionSummary aria-controls="panel1-content" id="panel1-header">
                    <Box sx={{ width: '100%' }}>
                        <Typography component="span">
                            <div className="nutrition-main">
                                <p>{title}</p>
                                <p>Overall towards daily goal: {((ratioTotal / (counter == 0 ? 1 : counter))*100).toFixed(0)}% </p>
                            </div>
                        </Typography>
                        <LinearProgress
                            determinate
                            color="success"
                            size="lg"
                            value={((ratioTotal / (counter == 0 ? 1 : counter))*100).toFixed(1)}
                            variant="soft"
                        />
                    </Box>
                </AccordionSummary>

                <AccordionDetails
                    sx={{
                    padding: 0,
                    boxShadow: "none", 
                    border: "none",
                    }}
                >
                    {VitaminComponents}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export function GeneralNutrientAccordion( {data, title} ){

    const VitaminComponents = Object.entries(data).map(([key, value]) => {
        return (
            <div className="nutrition-items" key={key}>
                <div className="nutrition-items-data">
                    <p>{key}</p>
                    <div className="nutrient-ammount-percentage-container">
                        <p>{value.amount}/{value.target} {key== "Calories" ? " cal" : "grams"}</p>
                        <p>{Math.round((value.amount / (value.target === 0 ? 1 : value.target)) * 100)}% DV</p>
                    </div>
                </div>
                <LinearProgress
                    color="success"
                    determinate
                    size="lg"
                    value={Math.min((value.amount / value.target) * 100, 100)}
                    variant="soft"
                />
            </div>
        );
    });

    return (
        <div className="acordion-container general-mimik">
            {VitaminComponents}
        </div>
    );
}
