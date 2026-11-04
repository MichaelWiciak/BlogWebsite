---
title: "I only needed a gaussian blur"
excerpt: "One dependency, a library nobody maintains, and a blur I should have written myself"
tags: [open-source, dependencies, go]
published: true
---

I have been working on [randwallpaper](https://github.com/MichaelWiciak/randwallpaper) for about half a year now. As I was refining it's `README.md`, I was going through my external imports and I was very happy to say there was only one. I went into the Github source code of the dependency to see what I was actually using, so I could boast about my project properly. I did not find what I wanted to see...

The dependency is [disintegration/imaging](https://github.com/disintegration/imaging). I found it (on a old `Medium` blog), thought it was great, and used it for the [Gaussian blob masks](https://github.com/MichaelWiciak/randwallpaper/blob/main/mask.go) in randwallpaper. It is a nice little Go image package, 5.8k stars, and it has been around for ages. Honestly, it did a great job.

The masks I use for the tool are simple enough. I place a bunch of random centres in a grayscale image, set them to white, and blur them into soft blobs. Then the path finder traces through the result. The only part I needed from imaging was [`Blur`](https://github.com/disintegration/imaging/blob/master/effects.go).

So one evening I went to the repo to see to see what I was relying on. The first thing I noticed was the [commit history](https://github.com/disintegration/imaging/commits/master). The last commit on `master` is from December 2020. The last [release](https://github.com/disintegration/imaging/releases/tag/v1.6.2) is v1.6.2, from November 2019. That is six or seven years of nothing. The [owner's profile](https://github.com/disintegration?tab=repositories) tells the same story, with most of the other repo development stopping around 2018.

Then I looked at the issues. There are [31 of them](https://github.com/disintegration/imaging/issues) open. One is [CVE-2023-36308](https://github.com/disintegration/imaging/issues/179), an improper input validation bug in the TIFF scanner, and it has been sitting there since February 2026. There is also a [Snyk vulnerability report](https://github.com/disintegration/imaging/issues/167) from 2023. The [pull requests](https://github.com/disintegration/imaging/pulls) are no better. Five open, some from 2023, including dependency bumps that would move the transitive `golang.org/x/image` module forward. Nobody has merged them. And I am using this library!!!

Now, the CVE is in the TIFF scanner. randwallpaper never opens a TIFF. It generates its own grayscale buffers and hands them straight to `Blur`, so I was never exposed to that particular bug. But I did not know that before I used the library. I had been telling people I had one dependency, and I had no idea what was inside it. That is the part that bothers me.

Also, I had one direct dependency, which is the same as saying I had two, because `imaging` dragged `golang.org/x/image` along with it. The whole point of having one direct dependency was that I could look at my [`go.mod`](https://github.com/MichaelWiciak/randwallpaper/blob/main/go.mod) and understand it. I could not.

I only needed a Gaussian blur not resize, crop, rotate, brightness, contrast, or any of the other things imaging is good at. So I decided to make my own. 

This is what the old code looked like:

```go
img := image.NewGray(image.Rect(0, 0, width, height))
for range nCenters {
    cx := rng.IntN(width)
    cy := rng.IntN(height)
    img.SetGray(cx, cy, color.Gray{Y: 255})
}

blurred := imaging.Blur(img, float64(sigma))
```

Then a bunch of code to read it back out, because `Blur` returns an `*image.NRGBA` and I only wanted single-channel values.

So what is a Gaussian blur? It is just a weighted average. For every pixel, you look at its neighbours, give the nearby ones more weight and the far ones less, and write the average back. The weights come from the Gaussian function, which is the bell curve. [Wikipedia](https://en.wikipedia.org/wiki/Gaussian_blur) has the full story, but the important part is this:

$$G(x,y)=\frac{1}{2\pi\sigma^2}e^{-\frac{x^2+y^2}{2\sigma^2}}$$

`sigma` controls how wide the bell is. A small sigma gives a tight blur, a large one gives a soft, spread-out blur. In code you truncate the curve at some radius, usually $\lceil 3\sigma \rceil$, because past three standard deviations the weights are small enough that you can ignore them.

The important trick is that the 2D Gaussian is separable:

$$G(x,y)=G(x)G(y)$$

So instead of doing a full 2D convolution for every pixel, which costs $O(n^2)$ per pixel, you do two 1D passes, horizontal then vertical, which costs $O(n)$ per pixel per pass. It produces the exact same result, much less work. This is how basically every serious blur is implemented, including imaging's.

At the edges you clamp the sample coordinates and renormalise by the sum of the weights you actually used, otherwise the borders go dark.

Let's look at how imaging does it. Their [`effects.go`](https://github.com/disintegration/imaging/blob/master/effects.go) has `Blur`, which builds the same kernel and then calls `blurVertical(blurHorizontal(img, kernel), kernel)`. The horizontal pass scans rows, the vertical pass scans columns, and both use a channel-based `parallel` helper to split the work. Because the package is general-purpose, it works on any `image.Image`, converts to `*image.NRGBA`, processes four channels, and weights the colour by alpha so transparent images blur correctly. That is a lot of machinery, and for a general image library it is the right approach.

My version is deliberately narrower. randwallpaper only ever feeds it opaque grayscale, so [`blur.go`](https://github.com/MichaelWiciak/randwallpaper/blob/main/blur.go) takes a `[]uint8`, a width, a height and a sigma. It builds the same kernel, does a horizontal pass into a `tmp` buffer, then a vertical pass into `dst`. The parallel helper is a small worker pool with an atomic counter, splitting the image by rows.

Here is the core of it:

```go
radius := int(math.Ceil(sigma * 3.0))
kernel := make([]float64, radius+1)
for i := range kernel {
    x := float64(i)
    kernel[i] = math.Exp(-(x*x)/(2*sigma*sigma)) / (sigma * math.Sqrt(2*math.Pi))
}

tmp := make([]uint8, len(src))
parallelFor(height, func(y int) {
    for x := range width {
        lo := max(0, x-radius)
        hi := min(width-1, x+radius)
        var r, a float64
        for ix := lo; ix <= hi; ix++ {
            wa := 255 * kernel[absInt(x-ix)]
            r += float64(src[y*width+ix]) * wa
            a += wa
        }
        if a != 0 {
            tmp[y*width+x] = clampByte(r * (1 / a))
        }
    }
})
```

The `255` cancels out when I divide by `a`, so it is really just carrying the byte range through the sum. The vertical pass is the same idea, just walking down the columns and reading from `tmp`. The full file is [here](https://github.com/MichaelWiciak/randwallpaper/blob/main/blur.go).

The tool worked and the images produced seemed correct. However, the scary part of replacing a blur is writing one that produces the same images as before. randwallpaper is a generative tool, so a tiny change in the blur changes the mask, which changes the path, which changes the colours. How can you prove you are generating the same kind of images after such a change?

One idea I had is before I would remove `imaging`, I would take a [hash](https://github.com/MichaelWiciak/randwallpaper/blob/main/randwallpaper_test.go) of the seeded `gaussianBlobMask` output produced by the old `imaging.Blur` implementation. The test generates the same mask with the new code and compares the hash. If the output changes, the test fails.

On top of that I added tests for the blur itself: an impulse should spread to its neighbours, a constant field should stay constant (which catches edge darkening), odd dimensions like `1x1`, `1x5` and `5x1` should not panic, `sigma <= 0` and zero-sized images should return a copy, and the whole thing should be deterministic. Then `go test -race`, because I parallelised it and I do not trust myself.

After that, the `go.mod` went from this:

```
module github.com/MichaelWiciak/randwallpaper

go 1.22

require github.com/disintegration/imaging v1.6.2

require golang.org/x/image v0.41.0 // indirect
```

to this:

```
module github.com/MichaelWiciak/randwallpaper

go 1.22
```

None of this is really about imaging. It is a good library that did its job, and I am grateful to the people who wrote it. The problem is that we take dependencies for granted. We add them, we import them, we forget them. They sit in the tree for years, pulling in other modules, and we never ask who is looking after them. Then one day you read the issue tracker and realise nobody is.

So check your libraries. Run [`govulncheck`](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck). Read the `go.mod`. If you only use one function out of a huge package, ask yourself whether you could own that function instead. Sometimes the answer is no, and that is fine. If you want to squeeze out the last bit of performance out of something, doing your own implementations of depedencies is a good way to go. 

And if you are on the other side of this, if people depend on your project, do not hoard it. Add maintainers. Move it to an organisation. Merge the PRs. Hand over the keys. If you do not want to do it any more, give it to someone who does.

The moral of the story for me is: if you are using a library, go and look at it.

Thanks for reading (:
