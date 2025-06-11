# DATA WINDOWS

The data returned from a _select_ query can be partitioned into multiple windows based on the query. For example,
if an hourly summary is requested for the last 12 hours, then 12 windows would be returned each containing
a summary per hour.

bi(OS) provides two types of windowing capabilities.

