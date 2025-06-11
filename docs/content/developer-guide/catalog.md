# Catalog

Using built-in metadata[^57]  and user-defined tags about <span style="font-family:Courier New;">signals</span>/<span style="font-family:Courier New;">contexts</span> and their attributes, bi(OS) provides an
active data catalog for streams and individual attributes. This catalog goes beyond a usual table listing and provides deep insight into the actual data being stored. It is very useful for quick data discovery and getting a
feel for the characteristics of the data. The below sections describe each of them.

### Schema Catalog
This catalog lists each stream and its metadata, such as the total count of operations and % daily change. It also supports partial name searches in the UI.

### Column Catalog
bi(OS) auto-computes data sketches on a per-column basis.  Using the user-defined tags bi(OS) provides an active data catalog per attribute. Specifically,
the primary metric tagged by the developer for the attribute is shown by default in bi(OS),[^58]   such as a word cloud of a dimension or average value of
a quantity over time. This catalog supports partial name searches in the UI.


[^57]: Support for <span style="font-family:Courier New;">contexts</span> is coming soon. <br/>
[^58]: If no primary metric is selected by the developer, bi(OS) picks a default based upon the data type. <br/>
