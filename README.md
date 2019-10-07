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

Offline-first is not only the cool name of a library you can just drop into your existing app and everything will work. It
is a way of conceiving your app that will likely influence the entire design an engineering of your app.

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

That's no good, so we have to make our strategies not blocking. So we save to indexedDB immediately and carry
on working, trusting that things will eventually save on the server:

`app/data-strategies/store-beforequery-remote-query.js` and `app/data-strategies/store-beforeupdate-remote-update.js` to make it non-blocking




