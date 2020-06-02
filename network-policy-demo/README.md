# NetworkPolicy Demo

Work in progress. To use in the current format you need an OpenShift 4.x cluster:

1. Run `oc login`
1. From `project-a` and `project-b` run:
    * npm install
    * npm run deploy
1. Run `oc new-project project-b`
1. Run `oc new-app --template=mongodb-ephermeral --param=MONGODB_USER=mongo --param=MONGODB_PASSWORD=password --param=MONGODB_DATABASE=messages -n project-b`
1. Run `oc new-app --template=mongodb-ephermeral --param=POSTGRESQL_USER=postgres --param=POSTGRESQL_PASSWORD=password --parma=POSTGRESQL_DATABASE=database-name -n project-b`

This will create 3 projects. Project B contains databases, and A and C contain
Node.js applications that require access to the databases.

You can use `oc describe networkpolicy -n project-b` to determine if A and C
can access the databases in B. 

Use `oc delete networkpolicy/$POLICY_NAME -n project-b` to delete policies
applied to B if necessary. You can use
`oc apply -f network-policies/$FILE -n project-b` to dictate access for A and
C to the databases in B.