import type { Handlers, ServiceFactories } from "./types";

const isRejected = (
  input: PromiseSettledResult<unknown>,
): input is PromiseRejectedResult => input.status === "rejected";

export function Client(factories: ServiceFactories, handlers: Handlers) {
  const services = factories.map((factory) => factory(handlers));
  async function tick() {
    const results = await Promise.allSettled(
      services.map((service) => (service ? service.tick() : undefined)),
    );
    const errors: (Error | undefined)[] = results.map((result) => {
      if (isRejected(result)) {
        console.log(result);
        if (result.reason instanceof Error) {
          return result.reason;
        } else {
          return new Error("Unknown error");
        }
      }
      return undefined;
    });
    handlers.errors && handlers.errors(errors);
  }
  // this will be changed eventually, we will need to re-request data
  // on an interval, but it depends on the source of data.
  setTimeout(() => {
    tick().catch((err) =>
      console.error("Uncaught error in oracle service:", err),
    );
  });
}
