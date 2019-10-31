# OpenShift Node.js Template

An application template that can be used to create a Node.js application and
deploy it on OpenShift/Kubernetes. It has the following features:

* Server-Side Rendering of pages using Handlebars.
* Hot Reloading during local development using nodemon.
* Support for Keycloak (Red Hat SSO) using an environment variable.
* UI/UX design and components built with PatternFly.
* Configuration via environment variables with fail-fast validation.
* Simplified deployment to OpenShift using nodeshift.
* Error generation using the @hapi/boom module.

## Requirements

* Node.js 10+

## Local Development Server

Run the following commands in the project directory to start the development
server:

```
npm install
npm run start:dev
```

## Deployment to OpenShift

```
npm run nodeshift
```

## Enable Keycloak/Red Hat SSO

Create a public client in your Red Hat SSO/Keycloak instance and export the
OIDC JSON. Remove all whitespace and run the application using one of the start
commands:

```
export KEYCLAOK_CONFIG=$YOUR_CONFIG_HERE
npm start
```

Accessing the application will require you to login now. The UI will also
display a logout button and your username.
