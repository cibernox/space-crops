# Ember in orbit. Building apps for outer space connectivity

## Ideas para la app que usarán los astronautas

App para monitorear el crecimiento de plantas en el espacio:
  1. Hay varias especies: Tomates, patatas, cebollas.
  2. De la tierra reciben datos de tiempo/intensidad de luz, cantidad de agua y cantidad de abono que deben dar a cada muestra
  3. A la tierra envian reportes de tamaño, floración y producción obtenida periodicamente.

Al principio todo es sincrono.
  - La app tarda mucho en cargar la homescreen. Al añadir service workers se arregla.
  - Las transiciones tardan mucho cuando hay requests. Al añadir non-blocking UI se arregla.
  - Cuando no hay conexión no se pueden leer datos de la API. Al añadir indexeddb como cache se arregla.
  - Cuando no hay conexión no se pueden salvar datos a la API. Añadiendo una estrategia adecuada se arregla.
  - Cuando algo va mal todo se fastidia. Al añadir estrategia para manejar errores se arregla.


### Slide 0

Title & presentation

### Slide 1

Ember & offline. Explain how most of the presents have heard about PWA and offline apps. Those apps
are supposed to work offline.

In past conferences (Emberconf / Emberfest / Embercamp) other people have touched the topic...

### Slide 2

The answer is Service Workers!
Today adding service workers to an Ember app is dead easy. At Dockyard we built and maintain an addon for this: `ember-service-workers`


### Slide 3

Steps to make an app load offline:
1. `ember install ember-service-worker ember-service-worker-asset-cache ember-service-worker-cache-first ember-service-worker-index`
2.
```js
  let app = new EmberApp(defaults, {
    // Add options here
    'ember-service-worker': {
      registrationStrategy: 'async',
      registrationDistPath: 'assets'
    },
  });
```

#### Slide 4

That's all, thank you for coming to my talk!

#### Slide 5

![Is it tho?](https://media.tenor.com/images/b445b5ed4d22e96a36bd74b23f3f0c39/tenor.png)

#### Slide 6

If your page is static that is probably all you need, but chances are that if you are building your
app with Ember it will not be so simple as that. You will probably need load data from some API,
allow users to create stuff, and update stuff. Caching assets for offline use is interesting, but
managing data while offline is the real deal that distinguishes a true offline-first app from the rest.

#### Slide 7

**Disclaimer:**

Offline-first is not only the cool name of a library you can just drop into your existing app and everything will work. It is a way of conceiving your app that will likely influence the entire design an engineering of your app.

> Offline-first, like accessibility or testing, is better handled as an overarching facet of every feature. Adding
tests for existing features is always harder than writing them along with the features, and the same applies for
offline data managing.

#### Slice 8

Steps to convert an app that works in the browser to have an API.

- `ember g data-source remote --from=@orbit/jsonapi`
- `ember g data-strategy remote-store-sync`
- `ember g data-strategy store-beforequery-remote-query` [Loading records works. Saving doesn't]
[show `/data-sources/remote.js` and `/data-strategies/remote-store-sync.js`]
- `ember g data-strategy store-beforeupdate-remote-update` [Saving works.]

#### Slide 9

So far we have a traditional app. Like the kind of app you'd usually build with ember-data that expects
a working connection to be fast and reliable. But this application is going to run in a space station orbiting the moon,
as far depending on the time of the year as 400.000 km from earth.
This can go wrong, so we need to be able to store information locally in the browser in case things go south.

Lets add IndexedDB as a backup source for our app.

Steps:
- `ember g data-source backup --from=@orbit/indexeddb`
- `ember g data-strategy store-backup-sync`
- `ember g data-bucket main`
[Data is saved in both API and IDB, but synchronous]

If the latency of a connection between London and Sydney, 17000km apart, is of around 250ms, we can expect the internet
connection to the moon to have a latency of some good 5 o 6 seconds. That is without accounting for the speed.

Let's see how it feels waiting 6 seconds for every page load and interation. [Demo with Moon Latency]
It fails because the it takes too long! The allow orbit to wait a bit more. Edit `remote.js` and add `injections.defaultFetchSettings = { timeout: 10000 }`.

It works now, but it's pretty bad, right? We have to make our strategies not blocking. So we save to indexedDB immediately and carry
on working, trusting that things will eventually save on the server:

`app/data-strategies/store-beforequery-remote-query.js` and `app/data-strategies/store-beforeupdate-remote-update.js` to make it non-blocking

That feels amazing right. Now astronauts will get snappy UI no matter with how high the latency is.

#### Slide 10

And this is all great. The internet is slow, but the app feels fast. Our job here is done, right?

#### Slice 11

Not exactly. This kind of pattern were we save something and we don't wait to see if it succeeds or not is called Optimistic.

We all know what happens to overly optimistic people, right?

![Epic fail](https://media.giphy.com/media/12WjSnRGVC79EA/giphy.gif)

#### Slide 11

Because if this space station is orbiting the moon, there is an interesting fact about the moon.
No matter at what point of its orbit around the earth it is, the same side is facing us. The other side that we never see from earth is the well know "Dark side of the moon".

When the space station is orbiting on the dark side of the moon, and assuming our station is orbiting in the Low lunar orbit (LLO), it doesn't have direct line of sight with earth for approximately 50 minutes every 2 hours.

We clearly cannot tell the astronauts to not use the app for those 50 minutes, so we need to have a way of gracefully handle errors.

#### Slide 12

Orbit has no opinions about how to handle errors, it's up to you to check the kind of request error and act accordingly.

Let's start with the basic, an error loading data:

[Run server with `ERROR_MODE=1 rails s`. The first request fails and no subsequent requests are made]

Why is that? That is because an error happened and we didn't handle it. Since orbit each source only handlers one request at a time, and this one didn't succeed, subsequent requests are never processed.

For queries like this one it's fairly simple. If we make a request and it fails because we're offline or the server is on maintenance, bad luck, but we can still continue to work with the data we already cached in indexedDB, so we can just skip the failed task and carry on.

Run:
- `ember g data-strategy remote-queryfail`

[Go edit `app/data-strategies/remote-queryfail.js`, remote the `target` as we don't need it and add `this.source.requestQueue.skip()` to the action] Now failing request do not prevent future requests from running

#### Slide 13

Failures saving data are a bit more nuanced really, because depending on the **reason** for the failure, we probably want to handle it differently. Lets handle the kind of errors the app will get when there's no internet.

Run:
- `ember g data-strategy remote-updatefail`
- add `import { NetworkError } from "@orbit/data";`
- The remove the `target` and in the action put something like this
```js
action(transform, e) {
  const remote = this.source;
  if (e instanceof NetworkError) {
    alert('The server rejected the request');
  } else {
    alert('The server rejected the request');
    return remote.requestQueue.skip();
  }
}
```

Now if the server responds with an error, we just skip that operation, but if it was for a network error the operation remains in the queue to be processed later.

#### Slide 14

If we go back online and reload the page, we can see how that operation is retried and succeeds. From now on we can decide that this is enough or try to be smarter. This is how
you would monitor the network status and retry when we recover connectivity.

- Show `/services/network.js` and go through the code
- Go to the `routes/application.js` and uncomment or type retry code.
```js
_retryWhenBackOnline() {
  this.network.onChange(onLine => {
    if (!onLine) return;
    let remote = getOwner(this).lookup('data-source:remote');
    remote.requestQueue.retry();
  });
}
```

Now when we recover connection all previously failed operations are retried.

#### Slide 15

More topics:

- How to handle 403 errors -> Skip operation and alert the user
- How to handle 422 errors -> Client side-validations. Json-schema validations
- How to handle 500 errors -> Not sure
- How to handle simultaneous edits -> Conflicts and return 412.
- Optimistic UI patterns: Offline icons/banners.





