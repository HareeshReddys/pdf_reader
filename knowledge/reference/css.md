# CSS interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Css Fundamentals and Selectors

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/css-fundamentals-and-selectors

## CSS; Cascading Style Sheets; CSS Overview; Web Styling; Frontend Styling

- CSS controls how HTML elements look on the page.

- It is used for colors, fonts, spacing, layout, and responsive design.

- HTML gives the page structure, and CSS gives it visual style.

- The word cascading means the browser decides which style wins when multiple rules apply.

- Real example: CSS can style all paragraph text with one rule.

```
p {
  color: red;
  font-size: 16px;
}
```

## Ways To Add CSS; External CSS; Internal CSS; Inline CSS; Link CSS File

- External CSS is the preferred way because one file can style many pages.

- Internal CSS is written inside a  tag in the HTML file.

- Inline CSS is written directly on an element using the style attribute.

- External CSS is better for real projects because it is reusable and easier to maintain.

- Real example: a common styles.css file can style the full website.

```
<link rel="stylesheet" href="styles.css" />
```

## CSS Selectors; Class Selector; ID Selector; Element Selector; Attribute Selector; Pseudo Selector

- CSS selectors are used to choose which HTML elements should be styled.

- Class selectors like .card are most commonly used because they are reusable.

- ID selectors like #header target one unique element.

- Attribute selectors like [type="text"] target elements based on attributes.

- Pseudo selectors like :hover style elements in a specific state.

```
.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

## CSS Specificity; Specificity Rules; Which CSS Rule Wins; Selector Priority; !important

- Specificity decides which CSS rule wins when multiple rules target the same element.

- Inline styles have the highest priority, then IDs, then classes, then element selectors.

- A more specific selector wins over a less specific selector.

- If specificity is the same, the later rule wins.

- Avoid !important because it makes CSS harder to manage.

```
button { color: blue; }
.btn { color: green; }
#submit-btn { color: red; }
```

## CSS Cascade; Cascade Order; Source Order; Rule Conflict; CSS Priority

- Cascade is how the browser decides the final style for an element.

- The browser checks importance, specificity, and source order.

- If two rules have the same priority, the rule written later wins.

- A more specific selector can override a rule written later.

- Real example: an ID style can override a class style on the same element.

```
.header { color: gray; }
#header { color: navy; }
```

## CSS Inheritance; Inherited Properties; Parent Child Styling; Font Inheritance; Color Inheritance

- Inheritance means some styles automatically pass from parent to child elements.

- Text-related styles like color , font-family , and line-height are commonly inherited.

- Box styles like margin , padding , and border are usually not inherited.

- Set common font styles on body to apply them across the page.

- Use inherit when you want a child element to copy a parent style.

```
body {
  font-family: system-ui, sans-serif;
  color: #222;
}
```

## CSS Box Model; Content Padding Border Margin; box-sizing; border-box; Element Box

- Box model means every HTML element is treated like a box.

- The box has content, padding, border, and margin.

- Padding adds space inside the element.

- Margin adds space outside the element.

- Use box-sizing: border-box to make element sizing easier and predictable.

```
*, *::before, *::after {
  box-sizing: border-box;
}
```

## Margin vs Padding; Inner Space vs Outer Space; CSS Spacing; Layout Spacing

- Padding | Margin

- Space inside the element | Space outside the element
- Keeps content away from border | Keeps elements away from each other
- Useful for buttons and cards | Useful for sections and layouts

- Use padding when content needs breathing space inside a box.

- Use margin when elements need gap between each other.

```
.button {
  padding: 16px;
}

.section {
  margin-top: 24px;
}
```

## CSS Pseudo Classes; :hover; :focus; :nth-child; Interactive States; Element State

- Pseudo-classes style an element when it is in a specific state.

- :hover applies when the user moves the mouse over an element.

- :focus applies when an input or button is active.

- :nth-child() targets elements based on their position.

- Real example: highlight an input when the user clicks inside it.

```
input:focus {
  outline: 2px solid blue;
}
```

## CSS Pseudo Elements; ::before; ::after; Generated Content; Virtual Elements

- Pseudo-elements style a virtual part of an element without adding extra HTML.

- ::before adds content before the element content.

- ::after adds content after the element content.

- Both commonly need the content property.

- Real example: add a star mark for required form fields.

```
.required::after {
  content: " *";
  color: red;
}
```

## CSS Combinators; Descendant Selector; Child Selector; Sibling Selector; Selector Relationship

- Combinators target elements based on their relationship with other elements.

- A space selector like article p targets all paragraphs inside an article.

- The > selector targets only direct children.

- The + selector targets the next immediate sibling.

- Real example: nav > ul > li targets only direct menu items.

```
nav > ul > li {
  list-style: none;
}
```

## display none vs visibility hidden; Hide Element CSS; Invisible Element; Layout Space

- display: none | visibility: hidden

- Removes element from layout | Keeps element space in layout
- Other elements move into its space | Other elements stay in the same place
- Useful for closed menus | Useful when layout should not shift

- Use display: none when the element should completely disappear from the layout.

- Use visibility: hidden when the element should be hidden but still reserve space.

```
.modal-closed {
  display: none;
}

.modal-invisible {
  visibility: hidden;
}
```

## CSS Transitions; transition Property; Smooth Hover Effect; CSS Animation; UI Interaction

- Transitions make CSS property changes smooth instead of sudden.

- They are commonly used for hover effects, buttons, menus, and cards.

- A transition usually needs property name, duration, and timing function.

- Prefer animating transform and opacity for better performance.

- Real example: smoothly change button background color on hover.

```
button {
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #2563eb;
}
```

Up next

Css Layout and Positioning

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Css Layout and Positioning

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/css-layout-and-positioning

## CSS Flexbox; Flexbox Layout; Display Flex; Flex Container; Flex Items

- Flexbox is used to arrange items in one direction, either row or column.

- Add display: flex to the parent, and its direct children become flex items.

- Use flex-direction to choose row or column layout.

- Use justify-content for main-axis alignment and align-items for cross-axis alignment.

- Common example: navbar with logo on the left and menu items on the right.

```
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Flexbox Alignment; Justify Content; Align Items; Center Div; Flex Center

- Property | Use

- justify-content | Aligns items on the main axis
- align-items | Aligns items on the cross axis
- gap | Adds space between flex items

- Use justify-content: center to center items horizontally in a row layout.

- Use align-items: center to center items vertically in a row layout.

- Use both together to center content inside a box.

- gap is cleaner than adding margins between items.

```
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
```

## CSS Grid; Grid Layout; Display Grid; Grid Template Columns; Two Dimensional Layout

- CSS Grid is used to create row and column based layouts.

- Add display: grid to the parent to create a grid container.

- Use grid-template-columns to define column sizes.

- Grid is best for full page layouts, cards, galleries, and dashboards.

- Unlike Flexbox, Grid can handle both rows and columns easily.

```
.products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## Grid Template Columns; FR Unit; Repeat Function; Auto Fit; Auto Fill

- fr means available free space in a grid.

- repeat() helps avoid writing the same column size again and again.

- auto-fit and auto-fill help create responsive grids.

- This is useful for product cards, image galleries, and dashboard cards.

- minmax() helps set a minimum and maximum column size.

```
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
```

## Flexbox vs Grid; CSS Layout Difference; When To Use Flexbox; When To Use Grid

- Flexbox | Grid

- Best for one direction | Best for rows and columns
- Good for navbars and small UI parts | Good for page layouts and galleries
- Content-based layout | Structure-based layout

- Use Flexbox when items flow in one direction.

- Use Grid when you need both rows and columns.

- Flexbox is good for buttons, navbars, and form rows.

- Grid is good for dashboards, cards, and full page layouts.

- In real projects, both are often used together.

```
.navbar {
  display: flex;
}

.gallery {
  display: grid;
}
```

## CSS Position Property; Static Relative Absolute Fixed Sticky; Position Values

- Position | Meaning

- static | Default normal position
- relative | Moves from its normal place
- absolute | Positions based on nearest positioned parent
- fixed | Stays fixed on the screen
- sticky | Sticks after reaching a scroll point

- position controls how an element is placed on the page.

- relative is often used as a parent for absolute children.

- absolute is useful for badges, icons, and dropdowns.

- fixed is useful for floating buttons or fixed headers.

- sticky is useful for headers that stick while scrolling.

```
.card {
  position: relative;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

## Position Sticky; Sticky Header CSS; Sticky vs Fixed; Scroll Sticky Element

- position: sticky behaves like normal content until it reaches a scroll point.

- After that point, it sticks to the given position.

- It needs top , left , right , or bottom to work.

- Unlike fixed , sticky stays within its parent area.

- Common example: sticky table header or sticky sidebar.

```
.header {
  position: sticky;
  top: 0;
}
```

## CSS Z Index; Stacking Order; Z Index Not Working; Stacking Context; Layers

- z-index controls which element appears on top.

- It works only on positioned elements like relative , absolute , fixed , or sticky .

- Higher z-index usually appears above lower z-index .

- Parent stacking context can affect why z-index does not work.

- Common example: modal should appear above page content.

```
.modal {
  position: fixed;
  z-index: 1000;
}
```

## Responsive Web Design; RWD; Fluid Layout; Flexible Grid; Responsive CSS

- Responsive design makes a website look good on mobile, tablet, and desktop.

- Use flexible widths instead of fixed widths where possible.

- Use media queries to adjust layout for different screen sizes.

- Use max-width: 100% for images to avoid overflow.

- Common example: product cards showing one column on mobile and three on desktop.

```
img {
  max-width: 100%;
  height: auto;
}
```

## Mobile First CSS; Min Width Media Query; Mobile First Approach; Responsive Design

- Mobile-first means writing styles for small screens first.

- Then use min-width media queries for bigger screens.

- This keeps CSS simple and easier to maintain.

- It works well because many users browse on mobile.

- Common example: one-column layout on mobile and multi-column layout on desktop.

```
.container {
  display: block;
}

@media (min-width: 768px) {
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

## CSS Grid System; 12 Column Grid; Bootstrap Grid; Layout Columns; CSS Framework Grid

- A grid system helps divide a page into columns.

- The 12-column grid is common because it is flexible.

- It helps create consistent page layouts.

- Frameworks like Bootstrap use this idea.

- Common example: sidebar takes 3 columns and content takes 9 columns.

```
.layout {
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: 20px;
}
```

## Universal Selector CSS; Asterisk Selector; CSS Reset; Global Styles; Star Selector

- The universal selector * targets every element.

- It is commonly used to reset default spacing or set box-sizing .

- Use it carefully because it affects the whole page.

- box-sizing: border-box makes width calculations easier.

- Common example: applying a simple global reset.

```
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

## Attribute Selectors CSS; Target Elements By Attribute; Attr Selector; Form Input Selector

- Attribute selectors target elements based on attributes.

- They are useful for styling specific inputs, links, or custom data attributes.

- [type="text"] targets text input fields.

- [disabled] targets disabled elements.

- Common example: style only email inputs or required fields.

```
input[type="email"] {
  border-color: blue;
}

button[disabled] {
  opacity: 0.5;
}
```

Previous

Css Fundamentals and Selectors

Up next

Css Preprocessors Sass Scss Variables Mixins

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Css Preprocessors Sass Scss Variables Mixins

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/css-preprocessors-sass-scss-variables-mixins

## CSS Preprocessors; Sass SCSS Less Stylus; What is a Preprocessor; CSS Compiler

- A CSS preprocessor adds extra features to normal CSS like variables, nesting, and functions.

- Browsers cannot read preprocessor code directly — it must be compiled into plain CSS first.

- Common preprocessors are Sass, SCSS, Less, and Stylus; SCSS is the most widely used today.

- They help organize large stylesheets and reduce repeated styles.

- Real example: store brand colors in one variable and reuse them across the whole stylesheet.

```
$primaryColor: #3b82f6;

.button {
  background-color: $primaryColor;
  color: white;
}
```

## Sass and SCSS; Sass vs SCSS Difference; SCSS Syntax; Sass Preprocessor

- Feature | Sass (old syntax) | SCSS (modern syntax)

- Curly braces | No | Yes
- Semicolons | No | Yes
- CSS compatible | No | Yes

- Sass is the tool; SCSS is its modern syntax that looks like normal CSS.

- Any valid CSS is also valid SCSS — easy for beginners to start.

- Most modern projects prefer SCSS because it is more familiar.

```
$cardPadding: 16px;

.card {
  padding: $cardPadding;
  border-radius: 8px;
}
```

## SCSS Variables; Sass Variables; $variable CSS; Reusable CSS Values; Design Tokens SCSS

- SCSS variables store reusable values like colors, font sizes, and spacing.

- A variable starts with $ , for example $primary: #2563eb .

- Variables are resolved at compile time and do not appear in the final CSS output.

- Useful for design tokens — change the value once and it updates everywhere it is used.

```
$primary: #2563eb;
$spacing: 16px;

.card {
  color: $primary;
  padding: $spacing;
}
```

## SCSS Nesting; Sass Nesting; Nested CSS Selectors; & Ampersand Selector

- Nesting lets us write child selectors inside the parent selector.

- Makes the CSS structure look similar to the HTML structure.

- Use & to refer to the parent — for example &:hover means hover on the parent.

- Avoid deep nesting as it creates long selectors that are hard to override.

```
.card {
  padding: 16px;

  h2 { font-size: 24px; }

  &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
}
```

## SCSS Mixins; @mixin @include Sass; Reusable CSS Block; Sass Mixin Parameters

- A mixin is a reusable block of CSS created with @mixin and used with @include .

- Mixins can accept parameters to customize output for different uses.

- Useful for common patterns like flex centering, media queries, and button styles.

- Write once, use in many places — similar to a function in programming.

```
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card { @include flex-center; }
```

## CSS Custom Properties; CSS Variables; var() Function; --variable CSS; Runtime CSS Variables

- CSS custom properties are native CSS variables defined with -- , for example --primary: #2563eb .

- Access them with var() : color: var(--primary) .

- They work in the browser at runtime and follow the normal CSS cascade.

- Can be updated with JavaScript — great for themes and dark mode switching.

```
:root { --primary-color: #2563eb; }

.button { background-color: var(--primary-color); }
```

## Sass Variables vs CSS Variables; $var vs --var; Compile Time vs Runtime CSS Variables

- Feature | Sass $var | CSS --var

- Syntax | $primary: blue | --primary: blue
- Processed at | Compile time | Browser runtime
- Appears in final CSS | No | Yes
- Updatable with JS | No | Yes

- Use Sass variables for static design values that never change at runtime.

- Use CSS variables for themes, dark mode, or any style that changes dynamically.

Previous

Css Layout and Positioning

Up next

Css Units Px Rem Em Vw Vh Box Model

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Css Units Px Rem Em Vw Vh Box Model

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/css-units-px-rem-em-vw-vh-box-model

## CSS Units; px em rem vw vh; CSS Sizing Units; Relative vs Absolute Units

- CSS units control element size, spacing, font size, and layout dimensions.

- Absolute units like px give a fixed size that never changes.

- Relative units like % , em , rem , vw , and vh adjust based on context.

- Relative units are better for responsive designs that work on all screen sizes.

## px Unit; Pixel Unit; Absolute CSS Unit; Fixed Size

- px is a fixed unit that always gives the same size regardless of screen or parent.

- Simple to use for borders, icons, and exact spacing.

- Not ideal for font sizes — it ignores user browser zoom settings.

- For font sizes and responsive layouts, prefer rem or % over px .

```
.box {
  width: 300px;
  border: 1px solid black;
}
```

## Percentage Unit; % CSS; Relative Width; Responsive Layout

- % is a relative unit that depends on the size of the parent element.

- width: 50% makes a child take half of its parent's width.

- Useful for flexible, responsive layouts.

- Height percentage can be tricky if the parent does not have a defined height.

```
.parent { width: 600px; }
.child { width: 50%; } /* becomes 300px */
```

## em Unit; CSS em; Font-relative Unit; em Compounding

- em is a relative unit based on the current element's own font size.

- If an element has font-size: 20px , then 1em = 20px for that element.

- Useful when padding or spacing should scale with the element's text size.

- In nested elements, em values multiply — called the compounding effect.

```
.button {
  font-size: 16px;
  padding: 0.5em 1em; /* 8px top/bottom, 16px left/right */
}
```

## rem Unit; Root em; CSS rem; Predictable Font Size CSS

- rem is a relative unit based on the root html element's font size.

- Default browser root font size is 16px , so 1rem = 16px .

- More predictable than em — does not depend on parent elements at all.

- Best for global font sizes and consistent spacing across the whole page.

```
html { font-size: 16px; }
.title { font-size: 2rem; } /* 32px */
```

## rem vs em; em vs rem; CSS Units Comparison; Font Relative Units

- Unit | Depends on

- em | Current element's font size
- rem | Root html font size

- em changes based on where it is used — nested elements multiply the value.

- rem stays consistent because it always refers to the root font size.

- Use em for component-level spacing; use rem for global font sizes.

## vw and vh Units; Viewport Units; Full Screen CSS; Responsive Viewport

- vw is 1% of the viewport width; vh is 1% of the viewport height.

- 100vw and 100vh cover the full visible browser area.

- Useful for full-screen hero sections and viewport-based font sizing.

- On mobile, 100vh can behave unexpectedly because of the browser address bar.

```
.hero {
  width: 100vw;
  min-height: 100vh;
}
```

## Absolute vs Relative CSS Units; px vs rem vs %; CSS Unit Types

- Unit | Type | Depends on

- px | Absolute | Fixed pixel size
- % | Relative | Parent element
- em | Relative | Current element font size
- rem | Relative | Root html font size
- vw / vh | Relative | Viewport width / height

- Absolute units are predictable but inflexible on different screen sizes.

- Relative units adapt to the screen, parent, or root — better for responsive design.

## box-sizing; border-box; content-box; CSS Box Model; Element Sizing

- box-sizing controls whether padding and border are included in the element's width.

- Default is content-box — padding and border are added outside the set width.

- border-box includes padding and border inside the width — easier to work with.

- Most projects set border-box globally to avoid unexpected layout sizing.

```
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## content-box vs border-box; Box Model Values; CSS Sizing Behavior

- Property | content-box | border-box

- Width includes | Content only | Content + padding + border
- Layout | Harder to predict | Easier to manage
- Usage | Browser default | Most modern projects

- With border-box , a 300px element stays 300px even after adding padding and border.

- Most CSS resets apply border-box globally for consistent layouts.

## CSS Reset; Reset CSS; Remove Browser Defaults; Browser Styles

- Browsers apply default styles to headings, lists, buttons, and forms.

- These defaults can differ between browsers and cause layout inconsistencies.

- A CSS reset removes these defaults to give a clean starting point.

- Usually added at the top of the main stylesheet before any custom styles.

```
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

## Normalize CSS; CSS Normalize; Cross-browser Styles; Browser Default Fix

- Normalize keeps useful browser defaults instead of removing them all.

- It makes those defaults consistent across different browsers.

- Less aggressive than a full reset — better when you want a functional baseline.

- Common in older projects; modern frameworks usually include their own base styles.

## CSS Reset vs Normalize; Reset vs Normalize; Cross-browser CSS Baseline

- Topic | CSS Reset | Normalize CSS

- Approach | Removes all defaults | Makes defaults consistent
- Starting point | Blank slate | Improved browser defaults
- Use case | Full custom design | Consistent cross-browser behavior

- Use a reset when you want full control over every style from scratch.

- Use normalize when you want consistent browser behavior without removing everything.

## Vendor Prefixes; -webkit- -moz- -ms-; CSS Browser Compatibility; CSS Prefixes

- Vendor prefixes are browser-specific CSS prefixes for experimental features.

- Common: -webkit- (Chrome/Safari), -moz- (Firefox), -ms- (old IE/Edge).

- Today, most CSS features are stable and no longer need manual prefixes.

- Tools like Autoprefixer add required prefixes automatically during the build.

```
.box {
  -webkit-user-select: none;
  user-select: none;
}
```

## Autoprefixer; CSS Autoprefixer; PostCSS Autoprefixer; Vendor Prefix Tool

- Autoprefixer adds vendor prefixes to CSS automatically during the build process.

- It checks browser support targets and adds only the necessary prefixes.

- Keeps source CSS clean — no need to write prefixes manually.

- Commonly used with PostCSS and included in most modern build setups.

## CSS Color Formats; HEX RGB RGBA HSL HSLA; CSS Colors; Color Values

- CSS supports color names, HEX, RGB, RGBA, HSL, and HSLA formats.

- HEX is commonly used in design systems (e.g., #2563eb ).

- RGBA adds opacity to RGB — useful for overlays and shadows.

- HSL is easier to adjust manually when creating lighter or darker shades.

```
.title { color: #2563eb; }
.overlay { background-color: rgba(0, 0, 0, 0.5); }
```

## RGB and RGBA; rgba CSS; Transparent Background CSS; Color with Opacity

- RGB uses red, green, and blue values from 0 to 255 .

- RGBA adds alpha transparency: 0 is invisible, 1 is fully visible.

- RGBA is useful for semi-transparent overlays, shadows, and backgrounds.

```
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
```

## HSL and HSLA; hsl CSS; Hue Saturation Lightness; CSS Color Shades

- HSL uses hue (color angle 0–360), saturation (intensity), and lightness (brightness).

- Easier to create color shades — just change the lightness value.

- HSLA adds an alpha channel for transparency.

- Better than RGB for generating color variations in design systems.

```
.primary { color: hsl(220, 90%, 56%); }
.primaryLight { color: hsl(220, 90%, 80%); }
```

Previous

Css Preprocessors Sass Scss Variables Mixins

Up next

Css Responsive and Performance

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Css Responsive and Performance

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/css-responsive-and-performance

## Responsive Design; Responsive Web Design; Mobile Friendly Layout; Adaptive UI

- Responsive design means the page adjusts nicely on mobile, tablet, and desktop.

- It helps one website work well on different screen sizes.

- It avoids creating separate websites for mobile and desktop.

- It is important because many users open websites on phones.

- Real example: a product card can become full-width on mobile and smaller on desktop.

```
.container {
  width: 100%;        /* Takes full available width */
  max-width: 1200px; /* Stops layout from becoming too wide */
  margin: auto;      /* Centers the container */
}
```

## CSS Media Queries; Responsive Breakpoints; @media; Min Width; Max Width

- Media queries apply CSS only for specific screen sizes or device conditions.

- min-width is commonly used in mobile-first design.

- max-width is commonly used when adjusting desktop styles for smaller screens.

- Breakpoints help change layout for mobile, tablet, and desktop.

- Real example: show one column on mobile and two columns on tablet.

```
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Shows 2 columns on tablet and above */
  }
}
```

## Mobile First vs Desktop First; Responsive Approach; Min Width vs Max Width; CSS Breakpoints

- Mobile First | Desktop First

- Starts with mobile styles | Starts with desktop styles
- Uses min-width | Uses max-width
- Preferred in modern websites | Useful for old desktop-heavy apps

- Mobile-first means we write small-screen styles first.

- Desktop-first means we write large-screen styles first.

- Mobile-first keeps CSS simpler because we add styles as the screen grows.

- Avoid mixing both approaches too much because it can make CSS hard to manage.

- Real example: start with one column, then add two or three columns for bigger screens.

```
.grid {
  grid-template-columns: 1fr; /* Mobile: one column */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: two columns */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: three columns */
  }
}
```

## CSS Custom Properties; CSS Variables; var() Function; Theme Variables; Design Tokens

- CSS variables store reusable values like colors, spacing, and font sizes.

- They help keep styles consistent across the project.

- var() is used to read a CSS variable.

- They are useful for themes, dark mode, and design systems.

- Real example: change one primary color and it updates everywhere.

```
:root {
  --primary-color: #007bff; /* Main brand color */
  --spacing-md: 16px;      /* Common spacing value */
}

.button {
  color: var(--primary-color);   /* Uses the saved color */
  padding: var(--spacing-md);    /* Uses the saved spacing */
}
```

## Flexbox vs Grid; CSS Layout Choice; One Dimensional vs Two Dimensional Layout; Responsive Layout

- Flexbox | Grid

- Best for one direction | Best for rows and columns
- Good for navbars and buttons | Good for full page layouts
- Handles alignment well | Handles complex layouts well

- Flexbox is best for arranging items in one row or one column.

- Grid is best when we need rows and columns together.

- In real projects, we often use both together.

- Grid is useful for page sections, and Flexbox is useful inside components.

- Real example: use Grid for product list layout and Flexbox inside each product card.

```
.page {
  display: grid; /* Creates page-level layout */
}

.card {
  display: flex;       /* Aligns content inside the card */
  align-items: center; /* Vertically aligns items */
  gap: 8px;            /* Adds space between items */
}
```

## CSS Animation Keyframes; @keyframes; Animation Property; Fade Animation; UI Animation

- CSS animations help elements move or change smoothly.

- @keyframes defines the animation steps.

- The animation property applies the animation to an element.

- Prefer animating opacity and transform for better performance.

- Real example: fade in a modal when it opens.

```
@keyframes fadeIn {
  from {
    opacity: 0; /* Start invisible */
  }

  to {
    opacity: 1; /* End fully visible */
  }
}

.modal {
  animation: fadeIn 0.3s ease; /* Applies fade animation */
}
```

## CSS Performance Optimization; Optimize CSS; Render Blocking CSS; Faster CSS

- Remove unused CSS so the browser loads less code.

- Keep selectors simple so the browser can match styles faster.

- Use transform and opacity for smooth animations.

- Minify CSS before production to reduce file size.

- Real example: moving with transform is usually smoother than moving with left .

```
.box {
  transform: translateX(100px); /* Better for smooth movement */
}

.box-slow {
  left: 100px; /* Can trigger layout recalculation */
}
```

## Browser Compatibility; Cross Browser CSS; CSS Support; @supports; Progressive Enhancement

- Browser compatibility means CSS should work correctly in supported browsers.

- New CSS features may not work the same in every browser.

- @supports helps apply CSS only when the browser supports it.

- Progressive enhancement means we give a basic working style first, then add modern features.

- Real example: use Grid only when the browser supports it.

```
@supports (display: grid) {
  .layout {
    display: grid; /* Applies only if CSS Grid is supported */
  }
}
```

## W3C Web Standards; CSS Standards; Web Standards Body; CSS Specification

- W3C helps define official web standards like HTML and CSS.

- Standards help browsers follow the same rules.

- This makes websites work more consistently across browsers.

- Browser vendors implement these standards in Chrome, Firefox, Safari, and Edge.

- Real example: CSS Grid works across browsers because it follows a common specification.

```
.layout {
  display: grid;                  /* Uses standard CSS Grid layout */
  grid-template-columns: 1fr 1fr; /* Creates two equal columns */
}
```

Previous

Css Units Px Rem Em Vw Vh Box Model

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
