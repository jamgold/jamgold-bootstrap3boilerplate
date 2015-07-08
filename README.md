# Bootstrap-3 Boilerplate

this small package helps to automate the reoccurring setup for Bootstrap 3.

## Installation

Installation is simple, just add the package

<code>meteor add jamgold:bootstrap3boilerplate</code>

and your preferred bootstrap3 package, eg.

<code>meteor add mrt:bootstrap-3</code>

## Setup

### No Iron Router

If Iron:Router is not used, the system defaults to Template.dynamic via the Session variable _Bootstrap3boilerplateContent_.

Include the Bootstrap3boilerplate template in your body tag

<code>
    <body>
    {{>Bootstrap3boilerplate}}
    </body>
</code>

and initialize the setup. Without Iron Router the hash is being used to set the template to use as content. Manually this can be achieved with Bootstrap3boilerplate.setContent('#something') which will then try to load template 'something'

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
Router.configure({
    layoutTemplate: 'Bootstrap3boilerplate'
});
if(Meteor.isClient)
{
    Bootstrap3boilerplate.init();
}
</code>

## Configuration

The package exports a global object called <code>Bootstrap3boilerplate</code> which is being used to control the different aspects of the template.

The following reactive vars can be set
- <code>Bootstrap3boilerplate.ProjectName.set(String)</code> set string  in top left
- <code>Bootstrap3boilerplate.fluid.set(Boolean)</code> container layout fluid or not
- <code>Bootstrap3boilerplate.Navbar.type.set(Style)</code> set the template Navbar style to on of _navbar-default|navbar-static-top|navbar-fixed-top_
- <code>Bootstrap3boilerplate.Navbar.inverse.set(Boolean)</code> Set Navbar inverse

and one static string defining the Not Found template
- <code>Bootstrap3boilerplate.notFound = 'Template'</code> set the notFound template, default Bootstrap3boilerplateNotFound

- <code>Bootstrap3boilerplate.Footer.show.set(boolean)</code> show the footer (default true)
- <code>Bootstrap3boilerplate.Footer.content.set(text)</code> the text in the footer (default Meteor.release)

The following are methods that can be overridden
- <code>Bootstrap3boilerplate.Navbar.left = function()</code> return array of menu objects
- <code>Bootstrap3boilerplate.Navbar.right = function()</code> return array of menu objects

where a menu object is contains href and text, and optionally a sub-array called dropdown. Three special menu objects are divider:true, header: 'Text' and showLoginButtons:true which will render {{>loginButtons}}

The Boilerplate handles which menu item is active based on the current URL/slug, unless overwritten by the optional active:true 

Lastly a couple of remaining methods of the Bootstrap-3 Boilerplate
- <code>Bootstrap3boilerplate.Navbar.events(MeteorEventDefinition)</code> Define the event callbacs for the Navbar
- <code>Bootstrap3boilerplate.Navbar.defaultEvents()</code> setup default events for the Navbar 
- <code>Bootstrap3boilerplate.init(customEvents)</code> initialize the boilerplate and the the Navbar events. If omitted init will call the defaultEvents() method
- <code>Bootstrap3boilerplate.alert(type,text,dismiss)</code> show bootstrap alert of _type_
- <code>Bootstrap3boilerplate.removeAlert(id|'all'|'clear')</code> remove a specific or all alerts

#### Menu Object Example
<pre>
{href:'#hello',text:'Home'},
{href:'#about',text:'About'},
{href:'#contact',text:'Contact'},
{text:'Dropdown',dropdown:[
    {href:'#action1',text: 'Action'},
    {href:'#action2',text: 'Another Action'},
    {divider: true},
    {header: 'Some More'},
    {href:"#sep1", text: 'Separated link'},
    {href:"#sep2", text: 'One more separated link'}
]}
</pre>
