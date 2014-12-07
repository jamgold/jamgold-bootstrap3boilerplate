# Bootstrap-3 Boilerplate

this small package helps to automate the reoccurring setup for Bootstrap 3.

## Installation

Installation is simple, just add the package

<code>meteor add jamgold:bootstrap3boilerplate</code>

and your preferred bootstrap3 package, eg.

<code>meteor add mrt:bootstrap-3</code>

## Setup

### No Iron Router

If Iron:Router is not used, the system defaults to Template.dynamic via the Session variable _template_.

Include the Bootstrap3Boilerplate template in your body tag

<code>
    <body>
    {{>Bootstrap3Boilerplate}}
    </body>
</code>

and initialize the setup

<code>
if(Meteor.isClient)
{
    Bootstrap3boilerplate.init();
}
</code>

The package exports the Object Bootstrap3boilerplate that allows to configure the menus and styles and event maps for the menu.

### With Iron Router

simple configure Iron Router to use Bootstrap3Boilerplate as the layoutTemplate

<code>
Router.config({
    layoutTemplate: 'Bootstrap3Boilerplate'
});
</code>
