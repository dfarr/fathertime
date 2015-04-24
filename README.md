[![Build Status](https://travis-ci.org/dfarr/fathertime.svg?branch=master)](https://travis-ci.org/dfarr/fathertime)
[![License](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/dfarr/fathertime/blob/master/LICENSE)

# Fathertime

A slack bot that converts time to your local timezone.

## Time

Fathertime can interpret any Time [Chrono](https://github.com/wanasit/chrono) can.

Basically: 

* Today, Tomorrow, Yesterday, Last Friday, etc
* 17 August 2013 - 19 August 2013
* This Friday from 13:00 - 16.00
* 5 days ago
* Sat Aug 17 2013 18:40:39 GMT+0900 (JST)
* 2014-11-30T08:15:30-05:30

# Environment

``` 
export SLACK_API_KEY= [your slack bot api key]

```
