import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// These pure domain modules only import types. Execute their actual source without a test framework.
async function loadModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const model = await loadModule("../src/features/booking/model.ts");
const { createDemoVenue, demoAccount } = await loadModule(
  "../src/features/booking/fixtures.ts",
);
const { featuredEvent } = await loadModule(
  "../src/features/event-discovery/fixtures.ts",
);
const { seats } = createDemoVenue(featuredEvent);
const move = (state, action) =>
  model.transitionBooking(state, action, seats, featuredEvent);
function pending() {
  let state = move(model.initialBookingState, {
    type: "toggle",
    seatId: "M1-3",
  });
  state = move(state, { type: "toggle", seatId: "M21-1" });
  return move(state, { type: "reserve", now: 1000, orderId: "DEMO-TEST" });
}
const pay = {
  type: "pay",
  now: 2000,
  buyer: demoAccount,
  mode: "guest",
  outcome: "approved",
};

test("occupied and unknown seats cannot be selected; empty purchases cannot reserve", () => {
  for (const seatId of ["M1-1", "unknown"])
    assert.deepEqual(
      move(model.initialBookingState, { type: "toggle", seatId }),
      model.initialBookingState,
    );
  assert.equal(
    move(model.initialBookingState, {
      type: "reserve",
      now: 1000,
      orderId: "x",
    }).step,
    "selection",
  );
});
test("selection toggles and enforces the demo limit", () => {
  let state = model.initialBookingState;
  for (const seat of seats.filter((seat) => !seat.occupied).slice(0, 9))
    state = move(state, { type: "toggle", seatId: seat.id });
  assert.equal(state.selectedIds.length, 8);
  assert.ok(state.notice);
  state = move(state, { type: "toggle", seatId: state.selectedIds[0] });
  assert.equal(state.selectedIds.length, 7);
});
test("mixed-zone payment confirms all seats, one unique ticket per seat, correct cents", () => {
  const state = move(pending(), pay);
  assert.equal(state.step, "confirmed");
  assert.equal(state.order.amountMinor, 275000);
  assert.equal(state.order.tickets.length, 2);
  assert.equal(new Set(state.order.tickets.map((ticket) => ticket.id)).size, 2);
  assert.deepEqual(
    state.order.tickets.map((ticket) => ticket.seatId),
    ["M1-3", "M21-1"],
  );
  assert.ok(state.order.tickets.every((ticket) => ticket.status === "valid"));
  assert.deepEqual(
    move(state, pay),
    state,
    "duplicate payment does not issue duplicate tickets",
  );
});
test("invalid buyer never confirms; rejected payment releases purchase without tickets", () => {
  assert.deepEqual(
    move(pending(), { ...pay, buyer: { name: "", email: "bad", phone: "x" } }),
    pending(),
  );
  const state = move(pending(), { ...pay, outcome: "declined" });
  assert.equal(state.step, "failed");
  assert.equal("order" in state, false);
  assert.deepEqual(move(state, { type: "reset" }), model.initialBookingState);
});
test("deadline is enforced even if payment arrives before the timer callback", () => {
  const state = pending();
  assert.equal(move(state, { ...pay, now: state.expiresAt }).step, "expired");
  assert.equal(
    move(state, { type: "expire", now: state.expiresAt - 1 }).step,
    "checkout",
  );
  assert.equal(
    move(state, { type: "expire", now: state.expiresAt }).step,
    "expired",
  );
});
test("back releases hold and preserves selection; retry receives a fresh deadline", () => {
  const state = move(pending(), { type: "back" });
  assert.equal(state.step, "selection");
  assert.deepEqual(state.selectedIds, ["M1-3", "M21-1"]);
  assert.equal(
    move(state, { type: "reserve", now: 9000, orderId: "new" }).expiresAt,
    9000 + model.HOLD_MS,
  );
});
test("availability conflict rejects the entire order", () => {
  const changedSeats = seats.map((seat) =>
    seat.id === "M21-1" ? { ...seat, occupied: true } : seat,
  );
  const state = model.transitionBooking(
    pending(),
    pay,
    changedSeats,
    featuredEvent,
  );
  assert.equal(state.step, "failed");
  assert.equal("order" in state, false);
});

test("processing locks payment and emits once, only after completion", () => {
  const processing = move(pending(), { ...pay, type: "start-payment" });
  assert.equal(processing.step, "processing");
  assert.equal(move(processing, { ...pay, type: "start-payment" }), processing);
  assert.equal(move(processing, { type: "back" }), processing);
  const confirmed = move(processing, { type: "finish-payment", now: 4800 });
  assert.equal(confirmed.step, "confirmed");
  assert.equal(confirmed.order.tickets.length, 2);
  assert.equal(
    move(confirmed, { type: "finish-payment", now: 5000 }),
    confirmed,
  );
});

test("processing preserves expiry, decline and cancellation instead of showing false success", () => {
  const processing = move(pending(), { ...pay, type: "start-payment" });
  assert.equal(
    move(processing, { type: "finish-payment", now: processing.expiresAt })
      .step,
    "expired",
  );
  assert.equal(
    move(processing, { type: "expire", now: processing.expiresAt }).step,
    "expired",
  );
  const declined = move(pending(), {
    ...pay,
    type: "start-payment",
    outcome: "declined",
  });
  assert.equal(
    move(declined, { type: "finish-payment", now: 4800 }).step,
    "failed",
  );
  const reset = move(processing, { type: "reset" });
  assert.equal(move(reset, { type: "finish-payment", now: 4800 }), reset);
  assert.equal(
    move(pending(), {
      ...pay,
      type: "start-payment",
      buyer: { ...demoAccount, email: "invalid" },
    }).step,
    "checkout",
  );
});

test("venue contains 500 unique seats across five priced sections for both arrangements", () => {
  for (const event of [
    featuredEvent,
    { ...featuredEvent, id: "encuentro-liderazgo" },
  ]) {
    const venue = createDemoVenue(event);
    assert.equal(venue.seats.length, 500);
    assert.equal(new Set(venue.seats.map((s) => s.id)).size, 500);
    assert.equal(venue.sections.length, 5);
    assert.equal(new Set(venue.seats.map((s) => s.group)).size, 50);
    for (const section of venue.sections) {
      const sectionSeats = venue.seats.filter(
        (s) => s.sectionId === section.id,
      );
      assert.equal(sectionSeats.length, 100);
      assert.ok(
        sectionSeats.every((s) => s.amountMinor === section.amountMinor),
      );
      for (const group of new Set(sectionSeats.map((s) => s.group)))
        assert.equal(sectionSeats.filter((s) => s.group === group).length, 10);
      assert.ok(sectionSeats.some((s) => s.occupied));
      assert.ok(sectionSeats.some((s) => !s.occupied));
    }
  }
});
