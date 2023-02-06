import type { ServiceFactories, Handlers } from "./types";
export function Client(factories: ServiceFactories, handlers: Handlers) {
  const services = factories.map((factory) => factory(handlers));
  async function tick() {
    await Promise.all(services.map((service) => service.tick()));
  }
  // this will be changed eventually, we will need to re-request data
  // on an interval, but it depends on the source of data. for now this
  // is just an example.
  setTimeout(() => {
    tick().catch((err) => {
      if (err instanceof Error) {
        handlers.errors && handlers.errors([err]);
      }
    });
  }, 4000);
}
