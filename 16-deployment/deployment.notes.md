# Deployment process
Steps to deploy an app:
## 1. Develop an app locally
## 2. Prepare an app for deployment
### 2.1. Build the app
Compile and optimize the code using 'ng build' command which will generate the dist folder.
Which is containing the browser folder. Which contains the files that will hosted in the browser.
#### How we can build the app?
##### As the SPA -> Single Page Application
We build the client side only web app.
We have just single html, which will be loaded an requested by the user.
This file loads the javascript code, that will take over and render the UI of our application.
All UI is loaded in the browser. Therefore we do not need any host that will run the code.
Because js runs in the browser. It will be the 'static' page. And 'static' host is enough.
- Pros
    - it is easy to setup
    - it is okey for internal apps that do not need to worry about SEO.
    - it is okey for apps which require authentication to even run them.
- Cons
    - a content can be initialy missing, when it takes a long time to load it
    - it is not good for SEO, because it does not need to wait for js to load.

Deploy SPA -> Lecture 312 - 313, https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/44116588#questions

##### Using SSR -> Server Side Rendering
Angular app routes are rendered 'on demand'. By the dynamic web server.
They are pre-rendered there and sent to the browser as the finished rendered page.

So instead of receiving an empty page, where JS takes care of rendering.
We get the finished renderd page, with JS that will later perform some operations.

We need 'dynamic' server, which will be able to run node.js code.

- Pros
    - better for SEO
- Cons
    - if code is quite big, user may wait long to see the application
    - more complex to set up

###### Configuration
1. Install angular SSR library. And prepare to use SSR
````bash
    # ng add installs and configures the dependencies
    ng add @angular/ssr
    # Creates node.js files which will be used for ssr
    # Updates the angular app configuration
````
2. Run the 'ng build' -> it will now also generate the server folder.
3. Preview the deployed app. There is a command that allows to preview the app
````bash
    npm run serve:ssr:routing
````

<b>Problems</b>

- If we are using the local storage. It won't work right away. Because it works in the browser, not on the server.
    We can easily implement a workaround. By executing the localStorage or any browser side features.
    Inside of the 'afterNextRender' function. Which runs after the next component render cycle.
    ````ts
        class Service {
            constructor() {
                // It will run after all components will be loaded in the DOM.
                // It only works for the client side, because DOM only exists on the client side.
                // That's why this is a great place for the code that runs in the browser only.
                afterNextRender(() => {
                    const tasks = localStorage.getItem('tasks');
                    if (tasks) {
                        this.tasks.set(JSON.parse(tasks));
                    }
                });
            }
        }
    ````
- Difference between client side and server side data. If we are using localStorage and http methods or some dummy data 

##### Using SSG -> Static Side Generation
Lecture 320 - https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/44116626#questions

Pre-rendering routes at build time, not like with SSR on demand.
Therefore some routes can be ready right away when we request them.
We still need the dynamic server, unless we pre-render all pages.

<b>Potential problems</b>

- When we are pr-rendering pages that fetch data, it won't update, because it was fetched and sent to the client.
This can lead to the data not be as recent as wanted.

<b>Setup</b>

- set 'prerender' option to true in angular.json (it is default)
- By default pages are pre-rendered, when the route does not contain any dynamic parameters. Like user id.
- we can specify some routes to be prerendered if we want, by adding the routes to a text file and pointing there in angular.json