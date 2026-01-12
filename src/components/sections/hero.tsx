"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const stats = [
    { label: "Projects Delivered", value: "50+" },
    { label: "Client Satisfaction", value: "98%" },
    { label: "Years Experience", value: "5+" },
]

export function Hero() {
    return (
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-background py-20 md:py-32">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            <div className="container mx-auto flex flex-col items-center text-center px-4 md:px-6">
                <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-1000">
                    Web Development Excellence
                </Badge>

                <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-both">
                    We Build Digital Solutions That <span className="text-primary">Drive Business Growth</span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom-7 duration-1000 fill-mode-both">
                    From simple websites to enterprise CRMs, Echoray.io brings clarity to the web's complexity.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-9 duration-1000 fill-mode-both">
                    <Button size="lg" asChild className="h-12 px-8 text-base">
                        <Link href="/start-project">Start Your Project</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base">
                        <Link href="/work">View Our Work</Link>
                    </Button>
                </div>

                <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-11 duration-1000 fill-mode-both">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <span className="text-4xl font-bold md:text-5xl">{stat.value}</span>
                            <span className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
