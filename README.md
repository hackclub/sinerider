
# SineRider

SineRider is a game about love and graphing, built by a global team of teenagers at [Hack Club](https://hackclub.com). This open-source project is maintained by youth of all kinds: artists, musicians, programmers, and storytellers, so if that's you, come join us! We need your help pushing this beta toward a full 1.0 release.

For teachers, check out our [lesson plan](https://docs.google.com/document/d/1Hwqk98dmBcSFYOcjt27-rLRnKIOCWUOiDHrdgHNT8kA/edit) if you would like to use SineRider in your classroom!

> ### Watch the trailer:
>
> [![Watch the Trailer](https://img.youtube.com/vi/35nDYoIwiA8/maxresdefault.jpg)](https://youtu.be/35nDYoIwiA8)

### Visit https://sinerider.com to play now!

## The Origin Story

SineRider began its life as a Unity web game in 2013. Back then, it looked [a little simpler](https://i.imgur.com/RttKiF7.gif).

The game made a minor splash, at least in the puddle where the math games swim. In 2015 it appeared at [GDC's Experimental Gameplay Workshop](https://youtu.be/rbJTzGNC8Bs), [covered by Rock Paper Shotgun](https://www.rockpapershotgun.com/SineRider-wants-you-to-love-maths-and-scares-me), and [recommended by James Portnow of Extra Credits](https://youtu.be/9FU103w2EWg).

Unfortunately, SineRider disappeared from the internet shortly after release when every major browser deprecated the NPAPI plugin structure, killing the Unity Web Player and SineRider with it. The game was lost to time, and the world was a worse place for it. That is until a team of talented teenagers at Hack Club decided to resurrect it.

## Where do I come in?

First of all, you can play SineRider, and share it with your friends. We need your help spreading the word about this free-forever indie game with a $0 advertising budget.

If you're both a code _and_ math nerd, you can contribute to SineRider directly! There's a reason it's open-source and written in 100% vanilla JavaScript. We need volunteer artists, writers, programmers, and puzzle designers. And, if you're a smart teenager who wants to change education for the better, you should come join [Hack Club](https://hackclub.com)!

Feel free to visit CONTRIBUTING.md to see more ways you can contribute to this project.

## How do I run the game locally for development and debugging purposes?

There are a few ways to run SineRider locally.

First off, you need to download the code. Make sure you have [Git](https://git-scm.com/) installed, and run `git clone https://github.com/hackclub/sinerider.git` in your terminal. Then, start the game!

- If you have [Node.js](https://nodejs.org/en/) installed, you can run the following command from the root of the repository: `npx http-server -p 3000`
- If you have [Python3](https://www.python.org/) installed, you can run the following command from the root of the repository: `python3 -m http.server 3000`
- If you use [Visual Studio Code](https://code.visualstudio.com/), you can install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and use the "Go Live" button in the bottom right corner of the editor to start a local server, which supports features such as live reload and is great for serious development.
- SineRider is 100% static vanilla HTML, JS, and CSS. It can run on any HTTP server. So, if you have another preferred hosting method, anything that can serve static files will work!

After successfully starting a server, navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Why does SineRider exist?

Educational games go back a long way. Monopoly began as a parable about the dangers of unregulated capitalism. For thousands of years, Go has been used to convey deep truths about everything from military conquest to flood control. So as humanity discovered the utility of computers for gaming in the mid-20th century, too emerged bold claims about the educational potential of this new interactive frontier.

The thesis of educational gaming is clear and convincing:

- Education occurs through instruction and practice
- Videogames are natural vessels for instruction and practice
- Therefore, videogames are natural vessels for Education

A virtually infinite landscape of refined, evocative, ever-improving titles has appeared since the creation of Pong, over 50 years ago, intermingling with every other entertainment medium in an industry now bigger than Hollywood. Why have game designers had such a comparatively weak influence on the world of education? Could the thesis of educational gaming be wrong after all? We don't believe so.

**We contend that educational games fail to deliver because the incentives of this market sector contradict the very nature of what a game should be.**

Educational institutions demand uniform instruction along a well-defined linear curriculum they want a randomized controlled longitudinal study to affirm that your product will yield a 3% bump in standardized test scores. But games are fundamentally voluntary pursuits, more so even than books or movies. The simple paradox of institutionally-mandated play undermines the most basic needs of an effective game.

Ironically, the best evidence for the value of educational games has come from the entertainment sector. Cultural phenomena like Minecraft and the Kerbal Space Program conclusively prove that it is quite possible to learn deep technical skills from a game, _even when this is not a primary goal of any party involved._ In fact, it almost works _because_ this is nobody's primary goal. The primary goal is play, and learning flows naturally from playing with a deeply technical system like orbital mechanics or Redstone.

SineRider is built around playing with mathematical systems, piggybacked on a venerable tradition: the near-universal impulse for geeky teenagers to mess around with graphing calculators. Every puzzle yields an infinite well of solutions, yet each one can be crafted to convey a specific concept and gate the player based on their level of understanding. Instead of a linearized sequence of concepts bolted onto the Common Core standard, we present a rich interactive world optimized for mathematical exploration and discovery through play. SineRider is built for joy, and from joy emerges learning.

Solving for joy demands an approach more familiar to entertainers than educators. We started development by asking: Who are our characters? What do they look like? Where do they come from? Why are they here, and what dramatic change is brought by their journey? We seek to build an experience every bit as visually beautiful and emotionally evocative as anything else on Steam. In short, we seek to build a great game.

SineRider is a game about graphing, but also a game about love, loss, and reconnection. It's a game about the swelling emotions that overwhelm you watching a sunset give way to a starfield while floating along with a ghost who means more to you than any other. We hope you enjoy playing as much as we've enjoyed building it.

## Does SineRider have a lesson plan?

Hence this is an educational game, we have a 60-minute lesson plan written by an American High School Teacher. Feel free to use it as you wish like! It explores the process of manipulating graphs by adjusting values within parent functions. The primary focus is on linear, quadratic, and sinusoidal functions. We feel this lesson plan will appeal to Math teachers or indie-learners.
> Below is a Google Docs document containing the lesson plan
> 
[https://docs.google.com/document/d/1Hwqk98dmBcSFYOcjt27-rLRnKIOCWUOiDHrdgHNT8kA/edit](https://docs.google.com/document/d/1Hwqk98dmBcSFYOcjt27-rLRnKIOCWUOiDHrdgHNT8kA/edit)

## What is the project roadmap?

Well, we still need to decide exactly what comes next and in what order. But here are a few things we have plans for:

- Mobile device support
- Custom level editor
- Adjustable graphics settings
- Multiple languages
- Daily puzzle screenshot previews
- Polar coordinates

## By the way, what exactly is Hack Club?

[Hack Club](https://hackclub.com) is a global network of students building student-led learning initiatives. We create financial, educational, and community infrastructure for hack clubs, hackathons, and individual hackers worldwide. It's a nice place where nice people do nice things for each other. You should check it out.

Hack Club and SineRider are founded upon the same principles: self-direction, playfulness, and respect for the time, agency, and intelligence of young people. If you want to contribute to projects like this one, you've found your tribe. [Come join us.](https://slack.hackclub.com)
