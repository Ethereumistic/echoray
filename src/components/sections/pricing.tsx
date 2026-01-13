"use client"

import { Check, Calendar, Zap, Globe, ShoppingCart, Terminal, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
    {
        name: "Standard Website",
        price: "€99",
        description: "Perfect for small businesses looking for a premium online presence.",
        features: [
            "Company & Business Sites",
            "Professional Portfolios",
            "Landing & Sales Pages",
            "Easy Content Manager (CMS)",
            "Domain & Hosting Setup",
        ],
        cta: "Subscribe Now",
        href: "https://buy.stripe.com/placeholder-website", // Replace with real Stripe link
        highlight: false,
        icon: <Wifi className="h-32 w-32" />
    },
    {
        name: "Power Web App",
        price: "€299",
        description: "Advanced tools and portals for businesses with unique needs.",
        features: [
            "E-commerce Storefronts",
            "Secure User Accounts",
            "SaaS Product Development",
            "Booking & Payment Systems",
            "Priority Support",
        ],
        cta: "Subscribe Now",
        href: "https://buy.stripe.com/placeholder-webapp", // Replace with real Stripe link
        highlight: true,
        icon: <ShoppingCart className="h-32 w-32" />
    },
    {
        name: "Custom Enterprise",
        price: "Custom",
        description: "Bespoke CRM and management systems for complex operations.",
        features: [
            "Custom CRM & ERP Systems",
            "Business Process Automation",
            "Internal Management Tools",
            "Third-party API Integrations",
            "Dedicated Project Partner",
        ],
        cta: "Book a Strategy Call",
        href: "/contact", // Or booking link
        highlight: false,
        icon: <Terminal className="h-32 w-32" />
    }
]

export function Pricing() {
    return (
        <section id="pricing" className="container mx-auto px-4 py-24 md:py-32">
            <div className="mb-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Clear Pricing, <span className="text-primary">No Surprises</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Choose the path that fits your current goals. All plans include our premium quality and ongoing support.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-12">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`relative flex flex-col border-muted/50 transition-all hover:border-primary/50 hover:shadow-2xl group ${plan.highlight ? 'border-primary/50 shadow-lg shadow-primary/5' : ''}`}>
                        {/* Background Decorative Icon - with its own clipping container */}
                        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
                            <div className="absolute top-4 right-4 text-primary/5 transition-colors group-hover:text-primary/10">
                                {plan.icon}
                            </div>
                        </div>

                        {plan.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40">
                                <Badge className="px-4 py-1.5 text-sm font-bold uppercase tracking-wider shadow-xl border-primary bg-primary text-primary-foreground">
                                    Most Popular
                                </Badge>
                            </div>
                        )}
                        <CardHeader className="relative z-10 pt-10">
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                            </div>
                            <CardDescription className="mt-4 text-base leading-relaxed">
                                {plan.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 relative z-10">
                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 relative z-10">
                            <Button size="lg" className="w-full font-bold" variant={plan.name === "Custom Enterprise" ? "outline" : "default"}>
                                {plan.name === "Custom Enterprise" ? <Calendar className="mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />}
                                {plan.cta}
                            </Button>
                            <Button size="sm" variant="ghost" className="w-full text-muted-foreground" asChild>
                                <a href="/contact">Still have questions?</a>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}
