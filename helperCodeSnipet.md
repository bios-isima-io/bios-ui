## Adding string based class along with aphrodite based style

```
className={`nav navbar-nav ${css(styles.red)}`}
```
 
 OR

``` 
className={['nav navbar-nav',css(styles.red)].join(' ')}
```