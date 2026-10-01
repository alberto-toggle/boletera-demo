export default function FeatureSections() {
  return (
    <section className="w-full py-16">


      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-semibold">Powerful Features</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Everything you need to manage, track, and grow your finances, securely and efficiently.
        </p>
      </div>

      {/* Блок карточек */}
      <div className="flex flex-wrap items-start justify-center gap-10">
        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300 motion-reduce:transition-none motion-reduce:transform-none">
          {/* External illustration retained from the supplied example. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy"
            className="w-full rounded-xl"
            src="https://cdn.21st.dev/assets/mirror/be/be1b2e97582f627f0b12c78b4659a78dd89731065529b2d92f1d6aa7c7906c14.png"
            alt=""
          />
          <h3 className="text-base font-semibold text-foreground mt-4">Feedback analyser</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get instant insights into your finances with live dashboards.
          </p>
        </div>

        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300 motion-reduce:transition-none motion-reduce:transform-none">
          {/* External illustration retained from the supplied example. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy"
            className="w-full rounded-xl"
            src="https://cdn.21st.dev/assets/mirror/b6/b6e8f44114cb6b12a5b19ef51876a8217c76fe1fcf014b3251a004377453f29a.png"
            alt=""
          />
          <h3 className="text-base font-semibold text-foreground mt-4">User management</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get instant insights into your finances with live dashboards.
          </p>
        </div>

        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300 motion-reduce:transition-none motion-reduce:transform-none">
          {/* External illustration retained from the supplied example. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy"
            className="w-full rounded-xl"
            src="https://cdn.21st.dev/assets/mirror/48/48f0b980c99986438bdcc25df7482983be83095e483abe5d525595a6290ffd6e.png"
            alt=""
          />
          <h3 className="text-base font-semibold text-foreground mt-4">Better invoicing</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get instant insights into your finances with live dashboards.
          </p>
        </div>
      </div>
    </section>
  );
}
