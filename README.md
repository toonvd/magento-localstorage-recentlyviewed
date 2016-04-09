# Toonvd_Recentlyviewed
[![Build Status](https://travis-ci.org/toonvd/magento-localstorage-recentlyviewed.svg?branch=master)](https://travis-ci.org/toonvd/magento-localstorage-recentlyviewed)
[![Code Climate](https://codeclimate.com/github/toonvd/magento-localstorage-recentlyviewed/badges/gpa.svg)](https://codeclimate.com/github/toonvd/magento-localstorage-recentlyviewed)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/toonvd/magento-localstorage-recentlyviewed/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/toonvd/magento-localstorage-recentlyviewed/?branch=master)

Toonvd_Recentlyviewed was written to reduce the number of hits on the product and category pages.

It also removes the need to holepunch the recently view blocks.

## Status

**This extension is provided as is.**

Tested browsers: 
* Google Chrome
* firefox

Tested Magento versions:
* 1.9.2.4

Feel free to test in other browsers / Magento versions and create a pullrequest for the README.

## Features

* Replaces the core "recently viewed functionality" with a js implementation.
* Leverages localstorage (or sessionstorage if localstorage is not available).
* Is configurable per scopelevel.

## Config

This extension uses the core settings for recently viewed.

The settings can be found here:

**System -> Configuration -> Catalog -> Recently Viewed/Compared Products**

