import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

const PricingPage = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Basic',
            price: '$9.99/month',
            tokens: '1,000',
            features: [
                'API Access',
                'Basic Support',
                'CSV Forecasts',
                'Email Assistance'
            ]
        },
        {
            name: 'Pro',
            price: '$29.99/month',
            tokens: '5,000',
            features: [
                'Priority API Access',
                '24/7 Support',
                'CSV & JSON Forecasts',
                'Higher Rate Limits',
                'Phone Support'
            ]
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            tokens: 'Unlimited',
            features: [
                'Dedicated Infrastructure',
                'Custom Models',
                'White-glove Support',
                'SLAs',
                'Dedicated Account Manager'
            ]
        }
    ];

    return (
        <div className="container mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-2">Pricing Plans</h1>
                <p className="text-muted-foreground">
                    Choose the plan that fits your forecasting needs
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.name} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <div className="text-3xl font-bold">{plan.price}</div>
                            <div className="text-sm text-muted-foreground">
                                {plan.tokens} tokens/month
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {plan.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                    <CheckIcon className="h-4 w-4 text-primary" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => navigate('/forecast')}
                            >
                                Get Started
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Button variant="outline" onClick={() => navigate('/forecast')}>
                    Back to Testing
                </Button>
            </div>
        </div>
    );
};

export default PricingPage;