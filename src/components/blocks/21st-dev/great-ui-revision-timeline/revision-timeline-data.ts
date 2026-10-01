import type { TimelineRevision } from "./great-ui-revision-timeline";

export const revisionTimelineData: TimelineRevision[] = [
  {
    id: "rev-1", date: "July 19, 2026", time: "16:00", title: "Release Candidate 1", author: "Saurabh", kind: "major",
    content: `### Release Candidate v1.0.0-rc1
- Codebase is fully optimized and typechecked with zero compile errors.
- Verified smooth scrolling on timelines and marquee carousels.
- Readied documentation panel and code previews.
> Verified responsive behavior across multiple screen viewports.

![Release Preview](https://cdn.21st.dev/assets/mirror/87/87be94726e557188bee0901691eed7b395dadd72803cc25ff6b72bd9f5483179.jpg)

- Final regression pass completed for mobile and desktop states.
- Confirmed all timeline interactions are responsive under load.`,
  },
  {
    id: "rev-2", date: "July 18, 2026", time: "14:30", title: "Daily Sync Completed", author: "Saurabh", kind: "minor",
    content: `### Weekly Sync Wrap-Up
- Reviewed the latest UI tweaks and interaction polish.
- Confirmed the responsive layout changes on mobile and desktop.
- Shared the next iteration notes with the design team.
> "The new timeline flow feels much more intuitive and polished."

![Sync Notes](https://cdn.21st.dev/assets/mirror/94/9415563d4fc147fa29554a66511c0dc054ec8fb60026c69dc6492370dd8773ea.jpg)

- Added extra detail cards for the active revision view.
- Ensured the metadata display is stable across all browser widths.`,
  },
  {
    id: "rev-3", date: "July 16, 2026", time: "10:45", title: "Accessibility Pass", author: "Saurabh", kind: "minor",
    content: `### Accessibility Improvements
- Added stronger focus states for interactive elements.
- Improved screen-reader labels on the history controls.
- Verified keyboard navigation across the preview surface.
> "The timeline now works smoothly with keyboard-only navigation."

![Accessibility Audit](https://cdn.21st.dev/assets/mirror/32/3266f47f43ade982465a49c323f1b5d7cfb6a23de0787c269dd097ea77a306e8.png)

- Updated contrast tokens and interactive role attributes.
- Polished the hover states for a cleaner, calmer experience.`,
  },
]
