|![dWalker](https://github.com/BeardVis/dWalker/blob/master/images/dWalker-dark.gif "Орк")|![dWalker](https://github.com/BeardVis/dWalker/blob/master/images/dWalker-light.gif "Орк")|
|:---------:|:---------:|
# dWalker
Animation built with HTML5, JS.
[Demo here](https://codepen.io/BeardVis/pen/wvMoJbY)

# Usage
Call the dWalker function
```js
dWalker({
  parent: "#dWalker",
  itemRadius: 7, //(optional) default 7 - The radius of the main elements
  freeZoneRadius: 100 //(optional) default 100 - The radius of the zone beyond which the elements will not go
});
```
# Customization
```css
#dWalker {
  height: 100vh;
  background-color: black;
  overflow: hidden;
}

#dWalker>div {
  background-color: #5BFAFE;
  box-shadow: 0 0 15px 0 white;
}

#dWalker>hr {
  border: 1px solid #04185D;
}
```
