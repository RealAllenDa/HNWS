# HNWS Changelog
## Updated at 2021/10/01

# 1.2.1.1

- [refactor] Generalized CHANGELOG.

# 1.2.1

- [bugfix] [warning/weather] Fixed displaying issues when 
  there are warnings but showed nothing.
- [refactor] [logger] All variables in logger will be predefined

# 1.2.0

- [refactor] [logger] Logger will not include debugging information 
  in production build anymore.
- [refactor] [store] Refactored store to per-module basis.

# 1.1.3

- [bugfix] [server] Fixed 'WARNING: Failed to determine routes' 
  when running the server.
- [refactor] [no-info] Changed plain text display in NoInformation.vue 
  to 'v-html' tag.
- [feature] [warning/weather] Added 'No Information Available' state
  for weather warning page.
- [refactor] [logger] Refactored the logger into a class.

# 1.1.2

- [refactor] [logger] Logger will now display logo from process.env.logo.
- [feature] [logger] Add logger.error() function
- [refactor] [general] Will use logger.error() as an error handler.

# 1.1.0

- [feature] [general-map] Maps will now have tooltips showing when hovered.
- [refactor] [general-text] Texts will no longer have 33% of fixed width.
- [feature] [warning/flood] Flood warning levels will be Roman characters 
  instead of numbers.
- [feature] [inundation] Added inundation state.
- [refactor] [general] Changed name from 'hazard-warning-system' to 'HNWS' 
  in nuxt.config.js.

# 1.0.8

- [bugfix] [warning/weather] Will now watch correct variables
  (weatherWarningState instead of floodWarningState).
- [feature] [wind] Added wind state.
- [feature] [index] Made location / relocate to the main website.

# 1.0.6

- [feature] [logger] Will now format caller only in development environment.
- [feature] [warning/flood] Added flood warning.
- [feature] [rain/period] Added rain period.
- [feature] [warning/weather] Added weather warning.
- [refactor] [rain] Generalized rain URLs.
- [bugfix] [general] Modules will have correct names now.

# 1.0.3

- [feature] [no-info] Added no information component.
- [feature] [rain/1h] Added 1h rain forecast.

# 1.0.2

- [refactor] [general/legends] Generalized legends css.
- [feature] [general] Will now have More... 
  if the space is not enough to display all.
- [bugfix] [general] Will no longer include debugging functions 
  such as updateCenter().
- [feature] [rain] Added 24h rain forecast. 
- [refactor] [screenshot] Generalized screenshot dropdown css.
- [refactor] [store] Will now get information according to different routes.

# 1.0.1

- [feature] [error] Server & client errors will now have dedicated error page.
- [bugfix] [general] Map annotations will not have borders anymore.
- [refactor] [logger] Generalized logo format.
- [refactor] [logger] Removed map debugging functions.
- [bugfix] [copyright] Changed position & Disabled user-select.
- [bugfix] [thumbnail] Disabled zooming.
- [bugfix] [legends] Disabled user-select.
- [refactor] [legends] Will now display pictures.
- [feature] [flood] Added functionality to show all rivers instead of
  designated rivers.
- [refactor] [flood] Will parse warning state by client now.
- [refactor] [flood] Generalized line-height.
- [feature] [store] Will now store time of the information.
- [bugfix] [information-list] Generalized information-container height.
- [bugfix] [flood] Generalized zoom & center.
- [bugfix] [flood] Generalized map-container height.
- [feature] [flood] Will now draw all rivers instead of designated rivers only.
- [refactor] [error] Generalized error page.
- [feature] [screenshot] Added screenshot functionality.
- [refactor] [general] Will get API URL from logger.
- [bugfix] [information] Fixed station states not displaying properly.

# 1.0.0

- [feature] [copyright] Added copyright.
- [feature] [flood] Added/Completed station & river flood forecast.
- [bugfix] [store] Will not add timestamp to prevent caching 
  when fetching geojson.

# Initial

- [feature] [general] Added general css.
- [feature] [logger] Added logger.
- [feature] [store] Added store.
- [feature] [flood] Added river flood forecast.
- [feature] [thumbnail] Added thumbnail.
- [feature] [information] Added information.
