import { get } from "mongoose";

const getPlan = (planId) => {
    console.log('yabii', planId)
    const plans = {
        price_1J7gNfETToi486WgGBLjy8g5: 'Core',
        price_1J7gODETToi486WgfELgV1KC: 'Pro',
        price_1J7gOYETToi486WgxSW0Yazm: 'Enterprise'
    }
    return plans[planId];
}

export default getPlan;


export const getPlanLimits = (plan) => {
    const limits = {
        Core: 5000,
        Pro: 10000,
        Enterprise: 'Unlimited'
    }
    return limits[plan];
} 



