Package.describe({
  name: 'jamgold:bootstrap3boilerplate',
  summary: 'Provide basic bootstrap-3 template with alert & modal & navbar & footer',
  version: '0.0.4_7',
  git: 'https://github.com/jamgold/jamgold-bootstrap3boilerplate'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['reactive-var','jamgold:isdevelopment@0.0.1','ecmascript@0.10.0','random']);
  api.use(['templating','handlebars'], 'client');
  api.export('Bootstrap3boilerplate');
  api.addAssets('public/development.png','client');
  api.addFiles(['bootstrap3boilerplate.html','bootstrap3boilerplate.js','bootstrap3boilerplate.css'],'client');
});
