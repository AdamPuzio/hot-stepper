# Hot Stepper

HotStepper is a simple vanilla JavaScript stepper/wizard library

## Usage

### Installation

In order to add HotStepper to your page, include the CSS and JavaScript files:

```html
<!-- add to head -->
<link rel="stylesheet" href="hot-stepper.min.css" />
<!-- add above closing body tag -->
<script src="hot-stepper.min.js"></script>
```

### Implementation

#### HTML

Next, create your HTML content, as shown below:

```html
<div class="hot-stepper">
  <header class="hs-header">
    <div class="hs-overlay"></div>
    <div class="hs-content">
      <h1>Title</h1>
      <p>Subtitle</p>
    </div>
    
    <div class="hs-steps">
      <nav class="steps">
        
        <div class="step">
          <div class="step-content">
            <p class="step-number">1</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-content">
            <p class="step-number">2</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-content">
            <p class="step-number">3</p>
          </div>
        </div>
        
      </nav>
    </div>
  </header>
  
  <div class="hs-body">
    <div class="panel"></div>
    <div class="panel"></div>
    <div class="panel"></div>
    <div class="panel complete"></div>
  </div>
  
  <footer class="hs-footer">
    
  </footer>
</div>
```

HotStepper uses 2 core terminology concepts:
- Steps - the always-visible circular icons at the top of the element
- Panels - the sections that display the content for each Step

It is possible to have more Panels than Steps, but not more Steps than Panels. A `.complete` Panel can be added after the other Panels and will display when everything else has completed. 

HotStepper is broken up into 3 sections:

- Header (`.hs-header`) - contains the actual header/hero content (if used), as well as the Steps
- Body (`.hs-body`) - contains the Panels
- Footer (`.hs-footer`) - used to universally display anything below the Panels

#### JavaScript

For the most basic implementation, just add the JavaScript to activate HotStepper:

```js
document.addEventListener('DOMContentLoaded', function () {
  var stepper = new HotStepper('.hot-stepper')
})
```

Additionally, you can add configuration values and apply event listeners for buttons

```js
document.addEventListener('DOMContentLoaded', function () {
  var stepper = new HotStepper('.hot-stepper', {
    animation: false,
    onChange: async function(info) {
      // fires whenever a panel changes
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    },
    onComplete: async function(info) {
      // fires when all panels complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    }
  })

  // add listener for next button(s)
  document.querySelectorAll('.btn-next').forEach(function(el) {
    el.addEventListener('click', function() {
      stepper.next()
    })
  })

  // add listener for previous button(s)
  document.querySelectorAll('.btn-prev').forEach(function(el) {
    el.addEventListener('click', function() {
      stepper.previous()
    })
  })
})
```

### API

HotStepper class

## ToDo

### Library ToDo

- Add automatic registration for any `.hot-stepper` element
- Add automatic registration for prev/next buttons (via `hs-action` attribute)
- Better event system
- Provide a CDN version of the library

### Documentation ToDo

- Document API

## Credits

- Design credit to [Kauê Buriti](https://codepen.io/kaueburiti) for his [CodePen](https://codepen.io/kaueburiti/pen/YNZGZO)

## License

[MIT](https://github.com/AdamPuzio/hot-stepper/blob/master/LICENSE)