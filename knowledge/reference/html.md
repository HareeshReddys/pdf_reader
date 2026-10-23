# HTML interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Html Fundamentals

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/html-fundamentals

## HTML; HyperText Markup Language; Webpage Structure; HTML Basics

- HTML means HyperText Markup Language.

- We use HTML to create the basic structure of a webpage.

- It tells the browser what content to show, like headings, paragraphs, images, and links.

- Real example: a login page uses HTML for inputs, labels, buttons, and headings.

- HTML is the skeleton of a webpage.

```
<h1>Hello</h1>
```

## DOCTYPE; HTML5 Declaration; Doctype HTML; First Line in HTML

-  tells the browser to use modern HTML5 rules.

- It should be the first line in an HTML file.

- It is not an HTML tag; it is a declaration.

- Without it, the browser may render the page in an old mode.

- Always add  before the  tag.

```
<!DOCTYPE html>
<html>
  <body>Hello</body>
</html>
```

## HTML Document Structure; HTML Boilerplate; Head and Body; Basic HTML Page

- A basic HTML page starts with  and the  tag.

- The  section contains page setup information.

- The  section contains visible content shown to users.

- The lang attribute helps browsers and screen readers understand the page language.

- head is for setup, and body is for visible UI.

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

## Head Tag; HTML Head; Title Meta Link; Page Metadata

- The  tag contains information about the webpage.

- Users do not directly see most content inside  .

- Common tags inside it are  ,  , and  .

- Real example:  shows the page name in the browser tab.

- CSS files are usually linked inside the  tag.

```
<head>
  <title>Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
```

## Meta Tag; HTML Metadata; Charset Viewport Description; SEO Meta Tag

-  tags give extra information about the webpage.

- charset helps the browser display text correctly.

- viewport helps the page fit properly on mobile screens.

- description can help search engines understand the page.

- viewport is important for responsive design.

```
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="My portfolio website">
```

## HTML Tags; Opening Tag; Closing Tag; Void Element

- HTML tags are used to mark content on a webpage.

- Most tags have an opening tag and a closing tag.

- Some tags like  ,  , and
 do not need a closing tag.

- The browser reads tags and creates the page structure.

- Tags are the building blocks of HTML.

```
<h1>Title</h1>
<img src="photo.jpg" alt="Profile photo">
```

## Tag vs Element; HTML Tag; HTML Element; Opening and Closing Tag

- Tag | Element

- A tag is only the markup part | An element is the full HTML item
- Example:
 | Example:
Hello

- Can be opening or closing | Includes tag, content, and closing tag

- A tag is only part of an HTML element.

- An element usually contains an opening tag, content, and a closing tag.

- People often say tag and element casually, but they are slightly different.

## Block vs Inline Elements; Block Level Element; Inline Element; HTML Display

- Block Element | Inline Element

- Starts on a new line | Stays in the same line
- Takes full available width | Takes only needed width
- Examples:
 ,
 ,  | Examples:  ,  ,

- Block elements are useful for page sections and layout.

- Inline elements are useful inside text content.

- CSS can change the behavior using display .

-
 is block, and  is inline.

## HTML Attributes; href src alt class id; Attribute Name and Value; HTML Properties

- Attributes add extra information to an HTML element.

- They are written inside the opening tag.

- Most attributes follow the format name="value" .

- Real example: href gives the link path, and src gives the image path.

- class , id , style , and data-* are common attributes.

```
<a href="/about">About</a>
<img src="avatar.jpg" alt="User avatar">
```

## Anchor Tag; HTML Link; href Attribute; target blank

- The  tag is used to create links.

- The href attribute defines where the link should go.

- Links can go to another page, another website, or a section on the same page.

- target="_blank" opens the link in a new tab.

- Use rel="noopener noreferrer" with target="_blank" for safety.

```
<a href="/about">About</a>
<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
```

## Image Tag; img Element; src alt Attribute; HTML Image

- The  tag is used to show an image on a webpage.

- The src attribute gives the image file path.

- The alt attribute describes the image for accessibility.

- width and height help avoid layout jumping while the image loads.

- Use  for meaningful images and CSS background for decorative images.

```
<img src="profile.jpg" alt="Profile photo" width="200" height="200">
```

## Div vs Span; HTML Containers; Block Container; Inline Container

- div | span

- Block-level container | Inline container
- Starts on a new line | Stays inside the same line
- Used for layout grouping | Used for styling small text parts

-
 is used to group larger sections.

-  is used to style or target small inline content.

- Both do not give meaning by themselves.

- Use semantic tags like  or  when they fit better.

## id vs class; HTML id; HTML class; Unique vs Reusable Selector

- id | class

- Should be unique on a page | Can be reused many times
- Used for one specific element | Used for common styling
- CSS selector uses # | CSS selector uses .

- Use id when you need to target one exact element.

- Use class when many elements need the same style.

- One element can have multiple classes.

- Classes are preferred for reusable styling.

```
<section id="about"></section>
<button class="btn primary">Save</button>
```

## strong vs em vs b vs i; Semantic Text Tags; Bold Italic; Text Importance

- Semantic Tags | Visual Tags

-  means important text |  only makes text bold
-  means emphasized text |  only makes text italic
- Gives meaning to screen readers | Mainly used for visual style

- Use  when the text is important.

- Use  when you want to stress a word.

- Use  or  only for visual formatting.

- Semantic tags are better for accessibility.

## HTML Lists; ul ol li; Ordered List; Unordered List; Description List

-
 creates an unordered list with bullets.

-
 creates an ordered list with numbers.

-  is used for each list item.

-  ,  , and  are used for term and description lists.

- Real example: use
 for setup steps and
 for feature lists.

```
<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>
```

## HTML Entities; Special Characters; lt gt amp; Reserved Characters

- HTML entities are used to display special characters safely.

- Use < to show  .

- Use & to show & .

- They are useful when showing code in HTML content.

- Entities prevent special characters from being treated as HTML markup.

```
<p>Use &lt;div&gt; to create a container.</p>
```

## Global Attributes; HTML Global Attributes; data Attributes; tabindex hidden contenteditable

- Global attributes can be used on almost any HTML element.

- class , id , style , and title are common global attributes.

- data-* stores custom data for JavaScript.

- hidden hides an element from the page.

- data-* is useful for passing simple values from HTML to JavaScript.

```
<button data-id="42" class="btn">Delete</button>
```

Up next

Html Semantic and Accessibility

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Html Semantic and Accessibility

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/html-semantic-and-accessibility

## Semantic HTML; Semantic Tags; HTML Meaning; SEO Accessibility

- Semantic HTML means using tags that clearly explain their purpose.

- We use it so browsers, developers, and screen readers can understand the page better.

- It improves accessibility, SEO, and code readability.

- Example: use  for navigation links instead of a normal
 .

- Semantic tags give meaning;
 only groups content.

```
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

## Semantic Tags; Header Nav Main Article Section Footer; HTML5 Tags; Page Structure

- Semantic tags are HTML tags that describe the role of the content.

- Common tags are  ,  ,  ,  ,  , and  .

- We use them to make page structure clear and easy to understand.

- Example:  is used for the main content of a page.

-  should normally be used only once on a page.

## Section vs Article vs Div; HTML Semantic Difference; Section Article Div; Semantic Layout

-  |  |

- Groups related content | Self-contained content | Generic container
- Needs a clear topic | Can stand alone | Has no meaning
- Example: features section | Example: blog post | Example: styling wrapper

- Use  for a group of related content.

- Use  for content that can make sense on its own.

- Use
 only when no semantic tag fits.

- Example: a blog post can be an  , and comments can be a  .

- Semantic tags are better than
 when they match the content.

```
<article>
  <h2>Blog Post Title</h2>
  <p>Post content...</p>
</article>
```

## HTML Layout Structure; Semantic Page Layout; Header Main Aside Footer; Page Structure

- A good HTML layout uses semantic tags for different page parts.

- Common layout tags are  ,  ,  ,  , and  .

- CSS controls the design, but HTML gives meaning to the structure.

- Example:  is useful for sidebars, related links, or ads.

- Semantic layout helps screen readers jump to important page areas.

```
<header>Logo and navigation</header>
<main>Main page content</main>
<footer>Copyright info</footer>
```

## Web Accessibility; Accessibility; A11y; Inclusive Web Design

- Accessibility means building websites that everyone can use.

- It helps users who depend on screen readers, keyboards, or other assistive tools.

- It improves user experience for all users, not only disabled users.

- Example: an icon-only button should have a text label for screen readers.

- Semantic HTML is the first step for good accessibility.

```
<button aria-label="Close">✕</button>
```

## Accessibility Basics; Alt Text; Form Labels; Keyboard Navigation; Contrast Ratio

- Use alt text for meaningful images.

- Use  for every form input.

- Make sure the website can be used with only a keyboard.

- Use good color contrast between text and background.

- Accessibility should be planned from the beginning, not added at the end.

```
<label for="email">Email</label>
<input id="email" type="email" />
```

## ARIA; Accessible Rich Internet Applications; aria-label; Role Attribute

- ARIA adds extra accessibility information to custom UI elements.

- Common ARIA attributes are aria-label , aria-labelledby , aria-describedby , and aria-expanded .

- We use ARIA when native HTML cannot explain the UI properly.

- Example: aria-label can give a name to an icon-only button.

- Use native HTML first, and use ARIA only when needed.

```
<button aria-label="Delete item">🗑</button>
```

## aria-label vs aria-labelledby; Accessible Name; ARIA Label; Screen Reader Label

- aria-label | aria-labelledby

- Adds label directly | Uses text from another element
- Good for icon-only buttons | Good when visible heading already exists
- Label is not visible | Label usually comes from visible text

- aria-label gives an element a screen-reader name directly.

- aria-labelledby connects an element to another element by id .

- Use aria-label when there is no visible label.

- Use aria-labelledby when visible text already describes the element.

- Every interactive element should have an accessible name.

```
<button aria-label="Close dialog">✕</button>
```

## Alt Attribute; Image Alt Text; Img Alt; Accessibility SEO

- alt gives a text description for an image.

- Screen readers read alt text for users who cannot see the image.

- It also helps when the image fails to load.

- Use alt="" for purely decorative images.

- Describe the meaning of the image, not only how it looks.

```
<img src="chart.png" alt="Sales increased by 40 percent in Q3" />
```

## Label Tag; Form Label; Input Label; Label vs Placeholder

-  gives a clear name to a form input.

- The for value in  should match the input id .

- Clicking the label focuses the input, which improves usability.

- Placeholder text should not replace a label.

- Labels are important for forms and accessibility.

```
<label for="email">Email address</label>
<input id="email" type="email" />
```

## Fieldset and Legend; Form Grouping; Radio Buttons; Checkbox Group

-  groups related form inputs.

-  gives a title to that group.

- It is very useful for radio buttons and checkboxes.

- Example: group contact options under one question.

-  and  make forms easier for screen reader users.

```
<fieldset>
  <legend>Preferred contact method</legend>
  <input type="radio" id="email" name="contact" />
  <label for="email">Email</label>
</fieldset>
```

## Figure and Figcaption; Image Caption; Semantic Caption; HTML Figure

-  wraps content like images, charts, diagrams, or code examples.

-  gives a caption for that figure.

- It connects the caption with the related content in a meaningful way.

- Example: use it for a product image with a caption.

-  is better than a normal
 when the content needs a caption.

```
<figure>
  <img src="product.png" alt="Blue running shoes" />
  <figcaption>New running shoes collection</figcaption>
</figure>
```

## Tabindex; Keyboard Focus; Focus Order; tabindex 0 and -1

- tabindex="0" | tabindex="-1"

- Adds element to normal tab order | Removes element from tab order
- User can reach it using Tab | JavaScript can focus it
- Useful for custom focusable elements | Useful for modals or headings

- Native elements like  ,  , and  are focusable by default.

- tabindex="0" makes an element reachable by keyboard.

- tabindex="-1" allows JavaScript focus without adding it to Tab order.

- Avoid positive tabindex values because they make focus order confusing.

- Keyboard focus order should follow the visible page order.

```
<div id="modal" tabindex="-1" role="dialog">
  Modal content
</div>
```

## Target Blank Security; rel noopener noreferrer; Open Link New Tab; window.opener

- target="_blank" opens a link in a new tab.

- rel="noopener" stops the new tab from controlling the original page.

- rel="noreferrer" also stops sending referrer information.

- Always use rel="noopener noreferrer" with external new-tab links.

- This is a small but important security best practice.

```
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Visit site
</a>
```

Previous

Html Fundamentals

Up next

Html Forms and Inputs

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Html Forms and Inputs

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/html-forms-and-inputs

## Form Tag; HTML Form; action Attribute; method Attribute; Form Submission

-  groups input fields and sends user data to the server.

- action tells where the form data should be sent.

- method tells how data should be sent, usually GET or POST .

- Use forms for login, signup, search, contact pages, and checkout pages.

- In React apps, we usually stop normal submission and handle it with JavaScript.

```
<!-- action says where to send the form data -->
<!-- method="post" sends data in the request body -->
<form action="/api/signup" method="post">
  <!-- name is the key sent to the server -->
  <input type="text" name="username" required>

  <!-- submit button sends the form -->
  <button type="submit">Sign up</button>
</form>
```

## GET vs POST; Form Method; GET Method; POST Method; Form Submission Difference

- GET | POST

- Sends data in the URL | Sends data in the request body
- Good for search forms | Good for login and signup forms
- URL can be bookmarked | Better for sensitive form data

- GET is useful when the result should be shareable, like a search page.

- POST is used when we send private data or create/update something.

- Avoid GET for passwords because data appears in the URL.

- Most login, register, payment, and contact forms use POST .

```
<!-- GET is good for search because query appears in the URL -->
<form action="/products" method="get">
  <input type="search" name="q" placeholder="Search products">
  <button type="submit">Search</button>
</form>

<!-- POST is better for private data like login -->
<form action="/login" method="post">
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <button type="submit">Login</button>
</form>
```

## Input Types; HTML Input Types; Text Email Password Number; Input Type Attribute

- Input types tell the browser what kind of data the user should enter.

- Common types are text , email , password , number , date , file , and checkbox .

- Correct input types improve validation and mobile keyboard behavior.

- Use email for email fields and password for hidden password text.

- Real example: a signup form usually uses text, email, password, and checkbox inputs.

```
<!-- text is used for normal text -->
<input type="text" name="fullName" placeholder="Full name">

<!-- email gives email validation and email keyboard on mobile -->
<input type="email" name="email" placeholder="Email">

<!-- password hides typed characters -->
<input type="password" name="password" placeholder="Password">

<!-- number accepts numeric values -->
<input type="number" name="age" min="1">
```

## Form Validation Attributes; required; minlength; maxlength; pattern; HTML5 Validation

- Validation attributes help check user input before submitting the form.

- required makes a field mandatory.

- minlength and maxlength control the allowed text length.

- pattern checks input against a specific format.

- Real example: password fields often need minimum length validation.

```
<!-- required means user cannot leave this field empty -->
<input type="email" name="email" required>

<!-- minlength asks for at least 8 characters -->
<input type="password" name="password" minlength="8" required>

<!-- pattern allows only 10 digits -->
<input type="text" name="phone" pattern="[0-9]{10}" required>
```

## Input Attributes; required; disabled; placeholder; readonly; Form Field States

- Attribute | Simple Meaning

- required | User must fill the field
- disabled | User cannot use the field
- readonly | User can see but cannot edit
- placeholder | Shows sample text inside the field

- required is used for important fields like email and password.

- disabled fields are not submitted with the form.

- readonly fields are submitted but cannot be changed by the user.

- placeholder gives a small hint about what to enter.

```
<!-- user must enter email -->
<input type="email" name="email" required>

<!-- user can see this value but cannot edit it -->
<input type="text" name="country" value="India" readonly>

<!-- disabled field cannot be changed or submitted -->
<input type="text" value="Auto generated" disabled>
```

## Checkbox; HTML Checkbox; input type checkbox; checked Attribute; Boolean Input

- Checkbox is used when the user can select yes/no or multiple options.

- It is good for terms acceptance, preferences, and filters.

- checked makes the checkbox selected by default.

- Use a label so users can click the text also.

- Real example: accept terms and conditions during signup.

```
<label>
  <!-- checked means selected by default -->
  <input type="checkbox" name="terms" checked>
  I agree to the terms
</label>
```

## Radio Button; HTML Radio; input type radio; Radio Group; name Attribute

- Radio buttons are used when the user must choose only one option.

- All radio buttons in the same group should have the same name .

- Each radio button should have a different value .

- Use radio buttons for gender, plan type, payment option, or delivery choice.

- Real example: choose one subscription plan from Basic, Pro, or Premium.

```
<!-- same name keeps these options in one group -->
<label>
  <input type="radio" name="plan" value="basic">
  Basic
</label>

<label>
  <input type="radio" name="plan" value="pro">
  Pro
</label>
```

## Dropdown List; select Tag; option Tag; HTML Select; selected Option

-  creates a dropdown list.

-  defines each choice inside the dropdown.

- Dropdowns are useful when there are many options.

- Use selected to choose the default option.

- Real example: country, state, category, and language fields.

```
<label for="country">Country</label>

<!-- select lets user choose one option -->
<select id="country" name="country">
  <option value="">Choose country</option>
  <option value="in" selected>India</option>
  <option value="ae">UAE</option>
</select>
```

## Textarea; Multi-line Input; rows cols; Comment Box; Message Field

-  is used for long text input.

- It is better than normal input for comments, feedback, and messages.

- rows controls the visible height.

- cols controls the visible width, but CSS is usually better for layout.

- Real example: contact forms usually use textarea for the message field.

```
<label for="message">Message</label>

<!-- textarea is useful for long text -->
<textarea id="message" name="message" rows="4" placeholder="Write your message"></textarea>
```

## enctype multipart form data; File Upload Form; multipart/form-data; Upload Encoding

- enctype="multipart/form-data" is required when uploading files.

- It allows the form to send files along with normal text fields.

- File upload forms must usually use method="post" .

- Use  to allow users to choose a file.

- Real example: profile photo upload or resume upload form.

```
<!-- multipart/form-data is needed for file uploads -->
<form action="/upload" method="post" enctype="multipart/form-data">
  <!-- user can select a file from device -->
  <input type="file" name="resume">

  <button type="submit">Upload</button>
</form>
```

## Hidden Input; input type hidden; Hidden Field; CSRF Token; Pass Data Silently

- Hidden input stores data that users should not edit directly.

- It is not visible on the page but gets submitted with the form.

- It is useful for IDs, tokens, and tracking values.

- Do not store sensitive secrets in hidden inputs because users can inspect HTML.

- Real example: sending a user ID or CSRF token with a form.

```
<form action="/profile" method="post">
  <!-- hidden value is submitted but not shown on the page -->
  <input type="hidden" name="userId" value="123">

  <input type="text" name="name" placeholder="Name">
  <button type="submit">Save</button>
</form>
```

Previous

Html Semantic and Accessibility

Up next

Html5 and Media

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Html5 and Media

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/html5-and-media

## HTML5 Elements; New HTML5 Elements; HTML5 Features; HTML5 vs HTML4; Semantic HTML

- HTML5 added better tags for layout, media, graphics, and browser storage.

- Semantic tags like  ,  ,  ,  , and  make page structure clearer.

- Native  and  allow media without extra plugins.

-  and  help create graphics, charts, icons, and animations.

- Real example: a blog page can use  for each post and  for embedded lessons.

```
<!-- Header section of the page -->
<header>
  <h1>My Blog</h1>
</header>

<!-- Main content of the page -->
<main>
  <article>HTML5 makes page structure cleaner.</article>
</main>
```

## Video Tag; HTML5 Video; Embed Video; Video Controls; Multimedia In HTML

- The  tag adds a native video player to the webpage.

- The controls attribute shows play, pause, volume, and seek options.

- Multiple  tags help the browser choose a supported video format.

- poster shows an image before the video starts.

- Real example: course websites use  to show lesson videos.

```
<video controls poster="thumbnail.jpg">
  <!-- MP4 is widely supported by most browsers -->
  <source src="lesson.mp4" type="video/mp4" />

  <!-- Fallback text shows if video is not supported -->
  Your browser does not support the video tag.
</video>
```

## Audio Tag; HTML5 Audio; Embed Audio; Audio Controls; Audio Player

- The  tag adds a native audio player to the webpage.

- The controls attribute shows play, pause, and volume options.

- Multiple  tags help support different audio formats.

- It is useful for podcasts, voice notes, music previews, and learning apps.

- Real example: a language learning app can play pronunciation audio.

```
<audio controls>
  <!-- Browser will play this audio file if supported -->
  <source src="podcast.mp3" type="audio/mpeg" />

  <!-- Fallback text for old browsers -->
  Your browser does not support the audio tag.
</audio>
```

## Canvas; HTML Canvas; Canvas API; JavaScript Drawing; Canvas vs SVG

-  is used to draw graphics using JavaScript.

- It is pixel-based, so it is good for games, charts, and animations.

- Canvas content is not normal HTML elements, so individual shapes are harder to style with CSS.

- We use getContext("2d") to draw shapes, text, and images.

- Real example: dashboards can use canvas-based chart libraries.

```
<canvas id="chart" width="200" height="100"></canvas>

<script>
  // Get the canvas element from the page
  const canvas = document.getElementById("chart")

  // Get drawing tools for 2D shapes
  const ctx = canvas.getContext("2d")

  // Draw a rectangle on the canvas
  ctx.fillRect(10, 10, 100, 50)
</script>
```

## SVG; Scalable Vector Graphics; Inline SVG; SVG vs Canvas; Vector Graphics

- SVG is used to create scalable graphics like icons, logos, and illustrations.

- SVG stays sharp on all screen sizes because it is vector-based.

- SVG shapes are real DOM elements, so CSS and JavaScript can style or control them.

- SVG is better for icons and simple interactive graphics.

- Real example: a website logo can be created using inline SVG.

```
<svg width="48" height="48" aria-label="Site logo">
  <!-- Circle creates a round logo shape -->
  <circle cx="24" cy="24" r="20" fill="blue" />
</svg>
```

## Canvas vs SVG; SVG vs Canvas; Graphics Difference; When To Use Canvas; When To Use SVG

- Canvas | SVG

- Pixel-based drawing | Vector-based drawing
- Good for games and animations | Good for icons and logos
- Controlled mostly by JavaScript | Can be styled with CSS
- Individual shapes are not DOM elements | Each shape is a DOM element

- Use canvas when you need fast drawing or many visual updates.

- Use SVG when you need sharp, scalable, and styleable graphics.

- Real example: use canvas for a game, but SVG for a logo.

## Web Storage; localStorage; sessionStorage; Browser Storage; Client Side Storage

- Web Storage stores small data in the browser as key-value pairs.

- localStorage keeps data even after closing the browser.

- sessionStorage keeps data only until the tab is closed.

- Both store data as strings, so objects should be converted using JSON.stringify() .

- Do not store passwords or sensitive data in web storage.

```
// Save user theme in browser storage
localStorage.setItem("theme", "dark")

// Read the saved theme later
const theme = localStorage.getItem("theme")
```

## localStorage vs sessionStorage; Browser Storage Difference; Persistent Storage; Temporary Storage

- localStorage | sessionStorage

- Data stays after browser close | Data clears when tab closes
- Good for preferences | Good for temporary tab data
- Shared across same-origin tabs | Separate for each tab

- Use localStorage for things like theme or language preference.

- Use sessionStorage for temporary form steps or tab-specific data.

- Both are simple browser storage options, not secure storage.

## Data Attributes; data-* Attributes; Dataset API; Custom HTML Attributes; Store Values On Elements

- data-* attributes store custom values on HTML elements.

- They are valid HTML and do not change how the page looks.

- JavaScript can read them using element.dataset .

- They are useful for storing IDs, tracking values, or small UI data.

- Real example: an add-to-cart button can store a product ID.

```
<!-- Store product id directly on the button -->
<button data-product-id="42">Add to cart</button>

<script>
  // Find the button element
  const button = document.querySelector("button")

  // Read product id from data-product-id
  console.log(button.dataset.productId)
</script>
```

## Picture Element; Responsive Images; srcset; WebP Fallback; Image Format Fallback

- The  element helps serve different images based on format or screen size.

- The browser checks  tags first and picks the best supported image.

- The  tag is required as the fallback image.

- It is useful for WebP images with JPEG fallback.

- Real example: a website can load smaller images on mobile and sharper images on desktop.

```
<picture>
  <!-- Browser uses WebP if it supports it -->
  <source srcset="hero.webp" type="image/webp" />

  <!-- Fallback image for browsers that do not support WebP -->
  <img src="hero.jpg" alt="Hero banner" />
</picture>
```

## Lazy Loading Images; loading="lazy"; Image Performance; Defer Offscreen Images; Page Speed

- loading="lazy" delays image loading until the image is close to the screen.

- It improves initial page loading speed.

- Use it for images below the first visible screen.

- Do not lazy load the main hero image because it should load quickly.

- Real example: product listing pages can lazy load product images.

```
<!-- This image loads only when it is near the visible area -->
<img src="product.jpg" loading="lazy" alt="Product photo" />
```

## defer vs async; Script Loading; JavaScript Performance; HTML Script Attribute; Non Blocking Script

- defer | async

- Runs after HTML parsing | Runs as soon as download finishes
- Keeps script order | Order is not guaranteed
- Good for app scripts | Good for analytics scripts

- A normal  can block HTML parsing.

- defer is usually safer for application scripts.

- async is useful for independent third-party scripts.

```
<!-- App script loads without blocking HTML parsing -->
<script src="app.js" defer></script>

<!-- Analytics script can run independently -->
<script src="analytics.js" async></script>
```

## Dialog Element; HTML Dialog; Native Modal; showModal; Modal Popup

- The  element creates a native modal or popup.

- showModal() opens it like a modal with a backdrop.

- close() closes the dialog.

- It handles basic focus and keyboard behavior better than custom div modals.

- Real example: a delete confirmation popup can use  .

```
<dialog id="confirmBox">
  <p>Are you sure you want to delete?</p>
  <button onclick="confirmBox.close()">Cancel</button>
</dialog>

<script>
  // Open the dialog as a modal popup
  confirmBox.showModal()
</script>
```

## iframe; Inline Frame; Embed External Page; iframe sandbox; iframe title

- The  tag embeds another page inside the current page.

- Always add a title for accessibility.

- The sandbox attribute can limit what the iframe is allowed to do.

- Cross-origin iframes cannot freely access the parent page because of browser security.

- Real example: maps, payment widgets, and embedded videos often use iframes.

```
<iframe
  src="https://maps.example.com"
  title="Store location map"
  sandbox="allow-scripts"
></iframe>
```

## noscript; JavaScript Disabled Fallback; No Script Tag; Graceful Degradation; Browser Fallback

-  shows content when JavaScript is disabled or blocked.

- It helps users understand why the page may not work properly.

- It is useful for apps that need JavaScript to run.

- It can also be used as a fallback for tracking or analytics.

- Real example: show a message asking users to enable JavaScript.

```
<noscript>
  <!-- This message shows only when JavaScript is disabled -->
  <p>Please enable JavaScript to use this app.</p>
</noscript>
```

Previous

Html Forms and Inputs

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
