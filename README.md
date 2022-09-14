# Engaging Networks Dynamic Amount CSS Classes

This project gives you dynamic CSS classes to toggle visibility of elements based on the donation amount.

## How to use

Add the script below to the page:

```html
<script
  type="text/javascript"
  src="https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/44/en-show-if-amount.js"
  defer
></script>
```

You can use our utility classes to hide/show a component based on giving amount:

`showifamount-{operand}-{value}`

### Operands

- `lessthan` - Shows component when giving amount is less than **{value}** - Example: `showifamount-lessthan-10`
- `lessthanorequalto` - Shows component when giving amount is less than or equal to **{value}** - Example: `showifamount-lessthanorequalto-10`
- `equalto` - Shows component when giving amount is exactly equal to **{value}** - Example: `showifamount-equalto-10`
- `greaterthanorequalto` - Shows component when giving amount is greater than or equal to **{value}** - Example: `showifamount-greaterthanorequalto-10`
- `greaterthan` - Shows component when giving amount is greater than **{value}** - Example: `showifamount-greaterthan-10`
- `between` - Shows component when giving amount is between **{valuemin}** and **{valuemax}** - Example: `showifamount-between-10-100`

### Frequency

You can also use the frequency of the donation to show/hide elements:

`showifamount-frequency-{frequency}`

- `onetime` - Shows component when donation is a one-time donation. - Example: `showifamount-frequency-onetime`
- `monthly` - Shows component when donation is a monthly donation. - Example: `showifamount-frequency-monthly`
- `quarterly` - Shows component when donation is a quarterly donation. - Example: `showifamount-frequency-quarterly`
- `semiannual` - Shows component when donation is a semi-annual donation. - Example: `showifamount-frequency-semiannual`
- `annual` - Shows component when donation is an annual donation. - Example: `showifamount-frequency-annual`

### Animations

You can add some animations classes to make the transition between the two states look better:

- `animate-replace` - Will animate the content switch using scale
- `animate-vertical-slide` - Will animate the content switch using max-height

## Examples

### Show if amount is less than 10

```html
<div class="showifamount-lessthan-10">
  This will show if the amount is less than 10
</div>
```

You can also combine the frequency with the amount:

```html
<div class="showifamount-lessthan-10 showifamount-frequency-monthly">
  This will show if the amount is less than 10 and the frequency is monthly
</div>
```

### Show if amount is between 10 and 100 and frequency is annual

```html
<div class="showifamount-between-10-100 showifamount-frequency-annual">
  This will show if the amount is between 10 and 100 and the frequency is annual
</div>
```

### Show if amount is between 10 and 100 and frequency is annual with animation

```html
<div
  class="showifamount-between-10-100 showifamount-frequency-annual animate-replace"
>
  This will show if the amount is between 10 and 100 and the frequency is annual
</div>
```

### IMPORTANT: This project only works with the Engaging Networks Pages.

## Development

Your js code must be on the `src/*.ts` file. Styling changes must be on `src/sass`.

## Install Dependencies

1. `npm install`

## Deploy

1. `npm run build` - Builds the project

It's going to create a `dist` folder, where you can get the `en-show-if-amount.js` file and publish it.

## Hot Module Reloading

1. `npm run start` - Starts the server with hot reloading enabled

## Demo

https://action.peta.de/page/111817/donate/1?mode=DEMO

It's currently published on PETA Germany EN Account:  
https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/44/en-show-if-amount.js
