# Product List UI

A simple PatternFly 3.x UI that renders a list of products. The products are
loaded from a remote REST API.

## Product API

The API must set the correct CORS header (or `*` if you don't care!), and
return an Array of Objects with this format:

```js
[
  {
    "description": "24 inch spare tire",
    "id": "109",
    "name": "spare tire",
    "price": {
      "EUR": 4649.87325,
      "GBP": 3981.2925,
      "USD": 5550
    }
  }
]
```

## Deployment on OpenShift

The UI requires a build step to inject the API URL. It could use a Node.js
server to render the UI, and proxy the API calls. Whatever works, right? 🤷‍♂️

```bash
export BUILDER=quay.io/evanshortiss/s2i-nodejs-nginx
export SOURCE=https://github.com/evanshortiss/openshift-app-dev-templates
export API_URL=http://api.endpoint.com/products

oc new-app $BUILDER~$SOURCE \
--name product-ui \
--context-dir parcel-bundler-s2i \
--build-env API_URL=$API_URL \
-l app.openshift.io/runtime=nginx

oc expose svc/product-ui
```
