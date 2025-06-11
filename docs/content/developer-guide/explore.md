# Explore

### Insights Visualization
bi(OS) provides out-of-the-box mobile-friendly visual exploration.  Any user can create and save insights available
to all users within the organization.  Further, any user can use insights created by anyone within the organization
and make them their own by organizing them into daily, hourly and favorite sections.   The visual experience of
bi(OS)’s dashboarding capabilities resembles playing with movie cards on Netflix, Google Play, or Amazon Prime.

Data for insights can be generated from pre-computed sketches for each column or user-defined aggregations.[^59]  Reports
can be rendered as <span style="font-family:Courier New;">line,  bar,  area, and  bubble charts</span>.  For user-defined aggregations, <span style="font-family:Courier New;">groupBy</span>
on the <span style="font-family:Courier New;">x- and y-axis</span> can be used along with <span style="font-family:Courier New;">filters</span>.  The user has the following options -

* Combine multiple <span style="font-family:Courier New;">signals</span> - The user can combine multiple <span style="font-family:Courier New;">signals</span> to mix-and-match metrics across <span style="font-family:Courier New;">signals</span>.[^60]
* Choose metric category - The user has the option to choose the following categories for metrics
  * <span style="font-family:Courier New;">Basic</span>  - min, max, sum, avg, distinctcount, and count for user-defined aggregates.
  * <span style="font-family:Courier New;">Advanced</span>  - sum[2,3,4], median, stddev, variance, skewness and kurtosis  of every column.
  * <span style="font-family:Courier New;">Probabilistic</span> - spread and distinctcounts of every column.
  * <span style="font-family:Courier New;">Derived</span>  -  Use custom formulas to generate the required metric.
* Specify time parameters -
  * <span style="font-family:Courier New;">Duration</span>  - 1H,  6H, 12H, 1D,  3D, 7D, or a custom date range. The custom date range can have any start date,[^61]
    but  the end date cannot exceed 7D from the state date.
  * <span style="font-family:Courier New;">Window size</span>  - Refers  to aggregation window size (on x-axis) .   Possible sizes are 5m, 15m, 30m, 1H, 6H, and 1D.
    The window sizes available adapt based on the selected Duration.  E.g. a  6H duration can only have 15m, 30m, 1H,
    and 6H  window sizes (5m, 1D, 3D, and 7D aren’t allowed).
  * <span style="font-family:Courier New;">Cyclical comparison</span>  - This option (automatically turned on), plots cyclical data for visual identification of
    anomalies in time-series patterns.  It has an option to perform hour-over-hour, day-over-day, or week-over-week
    comparisons (depending upon the duration selected).
  * <span style="font-family:Courier New;">Top-N</span> - Shows Top-N items (color coded), on X / Y axis, based on the selected Group By option. The value for N
    can range between 5 and 20.
* Filters - For user-defined aggregations, this option provides the ability to select only specific values.

**Note** - The capabilities of bi(OS)’s UI are powerful, real-time, and accurate compared to fancy visualizations
built upon brittle, delayed, and expensive ETL.  Further, bi(OS)’s UI uses its <span style="font-family:Courier New;">Javascript</span> SDK.  Developers can
access every functionality in bi(OS) UI via <span style="font-family:Courier New;">isQL</span>.

### SDKs
| Language     | Data Plane  | Control Pane |
| ------------ | :---------: | :----------: |
| _Python_     |  &#10004;   |   &#10004;   |
| _Javascript_ |  &#10004;   |   &#10004;   |
| _Java_       |  &#10004;   | Coming Soon  |
| C            | Coming Soon | Coming Soon  |

bi(OS) provides <span style="font-family:Courier New;">Python, Java</span>,  and <span style="font-family:Courier New;">Javascript</span> SDKs.[^62]  While Python and Javascript versions expose both control plane
and data plane APIs, the Java version exposes only data plane APIs.  A C-SDK will be available soon for low-latency
applications.  These SDKs expose an <span style="font-family:Courier New;">SQL</span>-friendly dialect called <span style="font-family:Courier New;">isQL</span> with familiar DML(data modification language)
primitives such as <span style="font-family:Courier New;">insert, select, upsert, and delete</span>. <span style="font-family:Courier New;">isQL</span>  is covered in depth in Appendix A.

### JupyterHub

bi(OS) supports JupyterHub as its out-of-the-box development and test environment from its UI. It allows developers to -
* Query raw data,  data sketches, and aggregates using <span style="font-family:Courier New;">isQL</span>.
* Feed data and features from bi(OS) into major data science frameworks such as <span style="font-family:Courier New;">scikit-learn, TensorFlow, PyTorch,
  Pycaret & fbprophet</spans> that are pre-validated with <span style="font-family:Courier New;">isQL</span>.
* Perform EDA (exploratory data analysis), and build/validate models before deploying them to production.


[^59]: Support for visualizing <span style="font-family:Courier New;">contexts</span> and raw data is coming soon. <br/>
[^60]: This can be considered as materializing-on-the-fly instead of using ETL. <br/>
[^61]: As far as the TTL is configured. <br/>
[^62]: SDKs in Go, Scala, RUST, C/C++, .Net are coming soon. <br/>
