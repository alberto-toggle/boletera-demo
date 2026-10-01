"use client";

import { useState, useEffect, useId } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, MapPinIcon, TicketIcon } from 'lucide-react';

const ticketOptions = [
  { value: 'standard', label: 'Standard Pass ($299)', price: 299 },
  { value: 'vip', label: 'VIP Pass ($499)', price: 499 },
  { value: 'virtual', label: 'Virtual Pass ($99)', price: 99 },
  { value: 'student', label: 'Student Pass ($79)', price: 79 },
];

export default function HeroFormEventRegistrationCountdown({
  eventDate = '2027-10-30T17:00:00Z',
}: { eventDate?: string }) {
  const id = useId();
  const [ticket, setTicket] = useState<string | null>('standard');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const selectedTicket = ticketOptions.find((option) => option.value === ticket) ?? ticketOptions[0];
  const total = selectedTicket.price - 50;

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, Date.parse(eventDate) - Date.now());
      const seconds = Number.isFinite(remaining) ? Math.floor(remaining / 1000) : 0;
      setTimeLeft({
        days: Math.floor(seconds / 86400),
        hours: Math.floor(seconds / 3600) % 24,
        minutes: Math.floor(seconds / 60) % 60,
        seconds: seconds % 60,
      });
    };
    const initial = setTimeout(update, 0);
    const timer = setInterval(update, 1000);
    return () => { clearTimeout(initial); clearInterval(timer); };
  }, [eventDate]);

  return (
    <>
      {/* Hero */}
      <div className="bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Remote decorative image from the original block. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-10"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:px-6 lg:py-24 2xl:max-w-[1400px]">
          <div className="grid items-center gap-12 xl:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="bg-primary/10 text-primary mb-6 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {new Date(eventDate).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>

              <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                Annual Developer Conference {new Date(eventDate).getUTCFullYear()}
              </h2>

              <p className="text-muted-foreground mb-8 text-xl">
                Join industry leaders and developers from around the world for
                our biggest event of the year.
              </p>

              <div className="mb-8 flex items-center">
                <MapPinIcon className="text-muted-foreground mr-2 h-5 w-5" />
                <span>Tech Conference Center, San Francisco, CA</span>
              </div>

              {/* Countdown Timer */}
              <div className="my-8 grid max-w-md grid-cols-4 gap-2 md:gap-4">
                <div className="bg-primary/5 border-primary/10 rounded-lg border p-2 text-center md:p-4">
                  <div className="text-primary text-2xl font-bold md:text-3xl">
                    {timeLeft.days}
                  </div>
                  <div className="text-muted-foreground text-xs tracking-wider uppercase">
                    Days
                  </div>
                </div>
                <div className="bg-primary/5 border-primary/10 rounded-lg border p-2 text-center md:p-4">
                  <div className="text-primary text-2xl font-bold md:text-3xl">
                    {timeLeft.hours}
                  </div>
                  <div className="text-muted-foreground text-xs tracking-wider uppercase">
                    Hours
                  </div>
                </div>
                <div className="bg-primary/5 border-primary/10 rounded-lg border p-2 text-center md:p-4">
                  <div className="text-primary text-2xl font-bold md:text-3xl">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-muted-foreground text-xs tracking-wider uppercase">
                    Minutes
                  </div>
                </div>
                <div className="bg-primary/5 border-primary/10 rounded-lg border p-2 text-center md:p-4">
                  <div className="text-primary text-2xl font-bold md:text-3xl">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-muted-foreground text-xs tracking-wider uppercase">
                    Seconds
                  </div>
                </div>
              </div>

              {/* Event Highlights */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-green-500"></div>
                  <div className="ml-3">
                    <h3 className="font-medium">Keynote Speakers</h3>
                    <p className="text-muted-foreground text-sm">
                      Hear from tech leaders about the future of development
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-blue-500"></div>
                  <div className="ml-3">
                    <h3 className="font-medium">Hands-on Workshops</h3>
                    <p className="text-muted-foreground text-sm">
                      Practical sessions on the latest tech and frameworks
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-purple-500"></div>
                  <div className="ml-3">
                    <h3 className="font-medium">Networking Opportunities</h3>
                    <p className="text-muted-foreground text-sm">
                      Connect with peers and potential collaborators
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-background/95 rounded-xl border p-4 sm:p-8 shadow-lg backdrop-blur-sm">
              <div className="mb-6 flex items-center">
                <TicketIcon className="text-primary mr-2 h-6 w-6" />
                <h2 className="text-2xl font-bold">Register Now</h2>
              </div>

              <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${id}-firstName`} className="mb-2">
                      First name
                    </Label>
                    <Input id={`${id}-firstName`} placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor={`${id}-lastName`} className="mb-2">
                      Last name
                    </Label>
                    <Input id={`${id}-lastName`} placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`${id}-email`} className="mb-2">
                    Email address
                  </Label>
                  <Input
                    id={`${id}-email`}
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor={`${id}-company`} className="mb-2">
                    Company/Organization
                  </Label>
                  <Input id={`${id}-company`} placeholder="Acme Inc." />
                </div>

                <div>
                  <Label htmlFor={`${id}-ticket`} className="mb-2">
                    Ticket type
                  </Label>
                  <Select items={ticketOptions} value={ticket} onValueChange={setTicket}>
                    <SelectTrigger className="w-full" id={`${id}-ticket`}>
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard Pass ($299)
                      </SelectItem>
                      <SelectItem value="vip">VIP Pass ($499)</SelectItem>
                      <SelectItem value="virtual">
                        Virtual Pass ($99)
                      </SelectItem>
                      <SelectItem value="student">
                        Student Pass ($79)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="pt-2">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Early Bird Discount</span>
                    <span className="font-medium text-green-600">-$50.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span aria-live="polite">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Demo pricing · $50 discount on every pass
                  </p>
                </div>

                <Button disabled type="submit" className="w-full">
                  Secure Your Spot
                </Button>
              </form>

              <p className="text-muted-foreground mt-4 text-center text-xs">
                Demo only. Registration is disabled; no information is sent.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}
