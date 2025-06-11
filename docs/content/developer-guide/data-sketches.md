# Data Sketches

bi(OS) computes data sketches[^48]  on each attribute without any user configuration.[^51]  Both exact and approximate sketches
are supported.[^52]

Sketches with exact computation -
* <span style="font-family:Courier New;">avg</span>: Average value of a column.
* <span style="font-family:Courier New;">sum[2,3,4]</span>:  Sum of second, third, and fourth powers of values of a column.
* <span style="font-family:Courier New;">stddev</span>: Standard deviation. Represents the variation in column values.
* <span style="font-family:Courier New;">variance</span>: Represents how far the column values are spread out from their avg.
* <span style="font-family:Courier New;">skewness</span>: Represents the asymmetry of the distribution of a column's values around its avg.
* <span style="font-family:Courier New;">kurtosis</span>: Represents the tailedness of the distribution of a column's values.

Sketches with approximate computation -
* <span style="font-family:Courier New;">median</span>: Represents the column value separating the higher half from the lower half.
* <span style="font-family:Courier New;">p0_01, p0_1</span>:  0.01th, 0.1th percentile values of a column.
* <span style="font-family:Courier New;">p1, p10, p25, p50, p75, p90, p99</span>: 1st, 10th, 25th, 50th, 75th, 90th, 99th percentile values of a column.
* <span style="font-family:Courier New;">p99_9, p99_99</span>: 99.9th, 99.99th percentile values of a column.
* <span style="font-family:Courier New;">distinctcount</span>: Count of distinct values within a column. To help understand how accurate the distinctcount
  sketch is, the following metrics may be useful -
  * <span style="font-family:Courier New;">numsamples</span>: number of samples stored within bi(OS) to compute approximate distinctcount.
  * <span style="font-family:Courier New;">samplingfraction</span>: approximate fraction of total number distinct values that bi(OS) has stored samples of.
    A value of 1.0 implies we have stored samples of all distinct values; in other words numsamples represent the exact distinctcount.
  * <span style="font-family:Courier New;">dcub[1, 2, 3]</span>: Estimate the upper bound of distinctcount, with a confidence interval within [1, 2, 3] stddev)
    from avg.
  * <span style="font-family:Courier New;">dclb[1, 2, 3]</span>: Estimate the lower bound of distinctcount, with a confidence interval within [1, 2, 3] stddev)
    from avg.


[^48]: For signals, data sketches are calculated in every feature interval (default 5 minutes) from events during the period. For contexts, data sketches are calculated from entire records and are updated after certain changes since the last calculation.<br/>
[^51]: These are efficient metrics that may trade-off a little accuracy for compute efficiency. <br/>
[^52]: Given these are automatically computed, the user can’t define custom groupbys for these metrics. And hence they can’t support filtering in bi(OS)’s UI either. <br/>
