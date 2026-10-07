import type { Buyer } from "./model";
export const demoAccount: Buyer = {
  name: "Alex Hernández",
  email: "alex@example.com",
  phone: "5550001234",
  contactChannel: "email",
  verifiedContact: "alex@example.com",
  audience: "public",
  registrationNumber: "",
  militaryAttendees: 0,
};
export type { Venue as DemoVenue, VenueSection } from "../seating/model";
export { createDemoVenue } from "../seating/demo/create-venue";
