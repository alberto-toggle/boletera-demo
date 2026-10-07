// The only catalog adapter to the public demo. UI and business logic do not import it.
import { getEventExperience } from "@/features/event-experience/fixtures";
import { demoEvents } from "@/features/event-discovery/fixtures";
import { createDemoVenue } from "@/features/seating/demo/create-venue";
import type { SellerEvent } from "../model";
import type { Venue } from "@/features/seating/model";
export const seller = {
  id: "seller-demo-01",
  name: "Mariana López",
  location: "Taquilla principal · Caja 01",
  email: "vendedor@example.com",
  password: "Demo2027",
};
export const events: SellerEvent[] = demoEvents.map((e) => ({
  id: e.id,
  title: e.title,
  startsAt: e.startsAt,
  venue: e.venue,
  image: e.image,
  category: e.category,
  priceMinor: e.price.amountMinor,
  city: e.city,
  imageAlt: e.imageAlt,
  imagePosition: e.imagePosition,
  description: e.description,
  includes: e.includes,
  information: getEventExperience(e),
}));
export const venues: Record<string, Venue> = Object.fromEntries(
  demoEvents.map((e) => [e.id, createDemoVenue(e)]),
);
