# Frontend Boiler

Simple boilerplate for frontend projects allowing you to get up and running quick! Using handlebars, SCSS, an OOP javascript structure and webpack this lets you focus on creating and not worrying about setting up your environment.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Install

Once you've cloned or downloaded the repo you can:

```
npm install
```

Which will install all the necessary dependancies.

Running a development environment is done with:

```
npm run dev
```
### Setting up pages

Without any server-side logic and the handling of routes, [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) is used for the creation of our HTML files.

This will look something like: 

```javascript
    new HtmlWebpackPlugin({
      inject: {},
      template: "src/views/pages/index.hbs"
    }),
    new HtmlWebpackPlugin({
      filename: 'player/index.html', // specify filename or else will overwrite default index.html
      inject: {},
      template: "src/views/pages/player.hbs"
    }),
```

* Adding a folder when setting the filename for new page templates ensures that the .html extension is not included in the url.
* However, this will mean that when you run the build for production that the path will not be relative to that folder. You can manually update this in the output html files, although it is something I'd like to resolve in the near future.

### Handling views

The project also makes use of [Barba](https://github.com/barbajs/barba) for page transitions. If you would like to make use of this as well, then we need to touch on associating a container and a view (read more [here](https://barba.js.org/docs/v2/user/)).

Adding a namespace attribute to your page templates like this:

```javascript

{{#> layout/base title='Frontend Boiler - Contact' namespace="contact" }}
  {{#*inline "body"}}
    {{> components/contact }}
  {{/inline}}
{{/layout/base}}

```
Allows you to reference them in Barba lifecycle hooks like so:

```javascript
enter: data => {
  if (data.current.namespace === 'home') {
    slider = new Slider(data.next.namespace);
  }
},
```

This allows for some more control over state and event binding/unbinding throughout your project.

In this project there is currently a single page transition for all pages, however, Barba has support for custom rules which will dicate which transition to use. Additional transitions can be placed in the transitions array with their various rules. 

```javascript
barba.init({
	transitions: [
		{
      name: 'default',
      /* 
      *  Other lifecycle hooks would be called here
      */
			leave: async ({ current, next }) => {
				await defaultPageTransiton(current.container, next.container);
			}
    },
    {
      name: 'custom',
      from:  {
        // where rule definitions for where you are
      },
      to: {
        // where rule definitions for where you're going
      }
      leave: async ({ current, next }) => {
				await customPageTransiton(current.container, next.container);
			}
    }
	]
});
```

Please refer to the official Barba documentation linked above for more details.

## Deployment

Building the project files for production is done with: 

```
npm run build
```

This will create a dist folder with static assets that is ready to be uploaded to a server or as a point to deploy a [Surge](https://surge.sh/) project from.

## Built With

* [handlebars](https://handlebarsjs.com/)
* [webpack](https://webpack.js.org/)
* [SCSS](https://sass-lang.com/)
* [GSAP](https://greensock.com/gsap)
* [Barba](http://barbajs.org/index.html)

## Authors

* **Luke Cochrane** [MLCochrane](https://github.com/MLCochrane/)

## License

This project is licensed under the MIT License
