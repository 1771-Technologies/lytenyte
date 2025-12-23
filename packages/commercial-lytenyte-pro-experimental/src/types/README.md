# PLEASE READ BEFORE CHANGING TYPES IN THIS FOLDER

The types here are a copy of the types in the Core library with PRO editions.
They have been duplicated for a few reasons:

- API differences. The PRO types are not fully compatible with the Core types.
- Easier than creating a system that extends the types
- Better type performance.

This does mean in a few places we have to cast types, but these are few and far between, and
always kept internal to the grid.
