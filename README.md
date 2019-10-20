### ADD A REMOTE SOURCE

Steps to convert an app that works in the browser to have an API.

- `ember g data-source remote --from=@orbit/jsonapi`
- `ember g data-strategy remote-store-sync`
- `ember g data-strategy store-beforequery-remote-query`

[Loading records works. Saving doesn't] [show `/data-sources/remote.js` and `/data-strategies/remote-store-sync.js`]

- `ember g data-strategy store-beforeupdate-remote-update` [Saving works.]

### ADD A BACKUP SOURCE

Lets add IndexedDB as a backup source for our app.

Steps:
- `ember g data-source backup --from=@orbit/indexeddb`
- `ember g data-strategy store-backup-sync`
- `ember g data-bucket main`
[Data is saved in both API and IDB, but synchronous]

**SHOW DRAWING OF THE DISTANCE BETWEEN MOON, THEN COME BACK TO CODE**

It fails because the it takes too long! The allow orbit to wait a bit more. Edit `remote.js` and add `injections.defaultFetchSettings = { timeout: 10000 }`.

It works now, but it's pretty bad, right? We have to make our strategies not blocking. So we save to indexedDB immediately and carry on working, trusting that things will eventually save on the server:

`app/data-strategies/store-beforequery-remote-query.js` and `app/data-strategies/store-beforeupdate-remote-update.js` to make it non-blocking. Restart the server.

That feels amazing right. Now astronauts will get snappy UI no matter with how high the latency is.

And this is all great. The internet is slow, but the app feels fast. Our job here is done, right?

**SHOW DRAWING ABOUT DARK SIDE OF THE MOON**

#### ADD ERROR HANDLING

Orbit has no opinions about how to handle errors, it's up to you to check the kind of request error and act accordingly.

Let's start with the basic, an error loading data:

[Run server with `ERROR_MODE=1 rails s`. The first request fails and no subsequent requests are made]

Why is that? That is because an error happened and we didn't handle it. Since orbit each source only handles one request at a time, and this one didn't succeed, subsequent requests are never processed.

For queries like this one it's fairly simple. If we make a request and it fails because we're offline or the server is on maintenance, bad luck, but we can still continue to work with the data we already cached in indexedDB, so we can just skip the failed task and carry on.

Run:
- `ember g data-strategy remote-queryfail`

[Go edit `app/data-strategies/remote-queryfail.js`, remove the `target` as we don't need it and add `this.source.requestQueue.skip()` to the action] Now failing request do not prevent future requests from running

Failures saving data are a bit more nuanced really, because depending on the **reason** for the failure, we probably want to handle it differently. Lets handle the kind of errors the app will get when there's no internet.

Run:
- `ember g data-strategy remote-updatefail`
- The remove the `target` and in the action put something like this:
```js
action(transform, e) {
  if (e.response) {
    console.log('The server responded with an error');
    return this.source.requestQueue.skip();
  } else {
    console.log('The request did not respond at all');
  }
},
```

Now if the server responds with an error, we just skip that operation, but if it was for a network error the operation remains in the queue to be processed later.

#### SYNCH CHANGES WHEN CONNECTION IS RESTORED

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

#### More topics:

- How to handle 403s errors -> Skip operation and alert the user
- How to handle 422s errors -> Client side-validations. Json-schema validations
- How to handle 500s errors -> Depends, but usually retry
- How to handle simultaneous edits -> Detect conflict and return 412.
- Optimistic UI patterns: Offline icons/banners.





