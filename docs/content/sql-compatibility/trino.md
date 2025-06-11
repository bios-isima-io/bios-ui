# SQL compatability with Trino

bi(OS) ships with Apache Trino[^84]  in every installation. bi(OS) has integrated <span style="font-family:Courier New;">isQL</span>’s Java SDK into Trino to provide <span style="font-family:Courier New;">SQL</span>
access to data stored within bi(OS).  Further, the Trino scale-out <span style="font-family:Courier New;">SQL</span> server is automatically enabled in every bi(OS)
installation at a URL such as - https://&lt;TENANT&gt;-sql.&lt;bios-installation&gt;.com.  The best way to access access this
server is via Trino-cli.[^85]
