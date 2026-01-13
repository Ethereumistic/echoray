import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { ServicesGrid } from "@/components/sections/services-grid"
import { Pricing } from "@/components/sections/pricing"

export default function ServicesPage() {
    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                    We build the digital tools <br />
                    <span className="text-primary">your business needs to grow</span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                    No complex jargon. No hidden fees. Just high-quality websites,
                    web apps, and systems built by people who care about your success.
                </p>
                <div className="mt-10 flex cursor-pointer justify-center">
                    <Button size="lg" asChild>
                        <a href="#services-grid">Explore our services</a>
                    </Button>
                </div>
            </section>

            {/* Main Services Grid */}
            <ServicesGrid />

            {/* Pricing Section */}
            <Pricing />

            {/* Explainer: How we work (Teacher Mode) */}
            <section id="how-it-works" className="relative py-24 mt-24 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold mb-4 md:text-5xl">How it works (The Echoray Way)</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Three simple steps to your new digital tool. We keep it transparent, fast, and simple.</p>
                    </div>

                    <div className="grid gap-12 md:grid-cols-3">
                        <div className="relative group p-8 rounded-3xl border border-muted bg-background/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                            <div className="text-primary/20 font-bold text-8xl absolute -top-4 -left-4 select-none group-hover:text-primary/30 transition-colors">1</div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">The Chat</h3>
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    We talk about your business, your problems, and what you actually need.
                                    No "tech-talk", just real solutions.
                                </p>
                            </div>
                        </div>

                        <div className="relative group p-8 rounded-3xl border border-primary/20 bg-background/50 backdrop-blur-sm shadow-xl shadow-primary/5 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                            <div className="text-primary/20 font-bold text-8xl absolute -top-4 -left-4 select-none group-hover:text-primary/30 transition-colors">2</div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">The Blueprint</h3>
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    We design exactly what we're going to build. You see it,
                                    you approve it, and then we get to work.
                                </p>
                            </div>
                        </div>

                        <div className="relative group p-8 rounded-3xl border border-muted bg-background/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                            <div className="text-primary/20 font-bold text-8xl absolute -top-4 -left-4 select-none group-hover:text-primary/30 transition-colors">3</div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">The Launch</h3>
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    We go live. But we don't leave you there—we guide you through
                                    how to use it and make sure everything is perfect.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* FAQ Section */}
            <section className="container mx-auto px-4 py-24">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-primary">Common Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">How much does a website cost?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Every business is different. A simple marketing site starts smaller,
                                while a custom system requires more time. We provide a clear,
                                fixed-price quote after our first chat.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg">Will my website be fast?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Absolutely. We use industry-leading tech (Next.js, Vercel) to ensure
                                your site loads instantly for everyone, everywhere.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg">Can I update the content myself?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Yes. We set up an easy-to-use manager (Sanity CMS) so you can
                                change text, images, and projects without needing to call a developer.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-24">
                <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to clear the fog?</h2>
                        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                            Stop wondering what digital tool you need. Let's have a quick
                            conversation and find the best path for your business.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="px-8 text-lg font-bold" asChild>
                                <Link href="/contact">Talk to a Guide</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="px-8 text-lg font-bold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors" asChild>
                                <Link href="/start-project">Start Your Project</Link>
                            </Button>
                        </div>
                    </div>
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/20 blur-[120px] rounded-full pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
