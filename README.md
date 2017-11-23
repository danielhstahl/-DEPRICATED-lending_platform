## Project goals

Create a lending platform that is agnostic to the funding platform and the ledger platform.  For this example, the funding and ledger platform will be on [Sequence](https://seq.com/).  

## Project architecture

### Client
The client side is built using React, Redux, and React-Router.  Each Redux store "key" is its own folder.  For example, the "account" key is in the "Account" folder with actions and reducers defined.  All the reducers are combined together in the ReduxBoilerplate folder.  The React components are stateless and housed in the "Components" folder.

### Firebase
Firebase/Firestore is the permanent client store and hosts the FaaS interactions with the client.  The client will expect a certain API from each function.  However, the client is agnostic about how the function interacts with any backend.  Hence the functions can integrate with any backend.  The function backend is as follows:

* A function to manage decisioning (whether to approve an app)
* A function to manage funding
* A function to manage the ledger (for accounting purposes)

Since each of these functions are independent of the client, the application is easily extensible to any platform.

### Sequence
While the FaaS is agnostic, for example purposes the functions will interact with [Sequence](https://seq.com/) from the [Chain](https://chain.com) developers.

## Testing

The project is built using TDD.

## ToDo
This project is currently in its beginning stages.  The following need to be worked on:
* UI (independent of Firebase)
* Firestore schema
   * Current schema is not optimal, uses auto-generated keys which are difficult to query

* Functions 
   * generateSchedule DONE
   * appDecision HALF-WAY (needs to actually add the decisioning logic)
   * fundLoan HALF-WAY (needs to make wire Id actually mean something)
   * payBill NOT STARTED
   * processLoan NOT STARTED...needs a timing aspect for due dates