---
title: "Bit Tricks"
excerpt: "Bubble sort's overlooked step and why cleverness is sometimes pointless"
tags: [bitwise, algorithms]
published: true
---

In the journey of learning computer science, we come across quite a number of topics and one of them are sorting algorithms. We all remember the time we learned how to do, say, bubble sort. My teacher took out a deck of cards and put them flatly in a line and walked us through each step in the process, letting us see how the algorithm works on something physical. Quite an easy algorithm looking at it now. But there is a part that, when converting from the visual/mathematical algorithm into code, is forgotten. The swap.

Let's first do a quick recap of bubble sort.

You walk along the line and look at each pair of neighbours. If the left one is bigger than the right one, you swap them, so the big ones bubble their way to the end, hence the name. Then you start again from the left, and you keep going until a full pass goes by without a single swap. At that point the deck is sorted.

```
for each pass down the line:
    for each pair of neighbours:
        if left > right:
            swap them
```

Now, that step, `if left>right`, "swap the two values". How do we represent that in code?
Well, it is very simple:

```
temp = x
x = y
y = temp
```

where temp is a temporary variable created to hold `x` for the time being.

What is the big deal about it?

Well, I am glad you asked. This is the way we usually always swap two values together but it's not the only way of doing so. If `x` is particularly large, copying it into a `temp` means moving the whole thing around (well, unless `x` is just a pointer, then "large" is four bytes of an address no matter what sits behind it). Not great for space efficiency but it has to be done that way, right? RIGHT?

Let me introduce you to `XOR`.

We all heard about it and we all used it but XOR has a great property. Let's look at a truth table:

| x   | y   | x ^ y |
| --- | --- | ----- |
| 0   | 0   | 0     |
| 0   | 1   | 1     |
| 1   | 0   | 1     |
| 1   | 1   | 0     |

You might notice that the bit toggles. `XOR` with a `0` leaves it alone, `XOR` with a `1` flips it. $x \oplus 0 = x$ and $x \oplus 1 = \lnot x$. We can use that to swap values. How?

```
x = x ^ y
y = x ^ y
x = x ^ y
```

We still have 3 instructions/operations but need only two variables to store values and these were supplied by the user with memory already allocated to them. How does this work? Let's work it through:

Take `x = 5` and `y = 3`, and write them out in four bits:

```
x         0 1 0 1
y         0 0 1 1

x = x ^ y   0 1 0 1  ⊕  0 0 1 1  =  0 1 1 0   # the mixture
y = x ^ y   0 1 1 0  ⊕  0 0 1 1  =  0 1 0 1   # the old x
x = x ^ y   0 1 1 0  ⊕  0 1 0 1  =  0 0 1 1   # the old y
```

See the trick? The first line mixes x and y together into a single value. XORing that mixture with `y` cancels the `y` part out, leaving the old `x` behind. Do it once more and the old y falls out too. The whole thing works because `XOR` is its own inverse, $(a \oplus b) \oplus b = a$. Doing a thing twice undoes it.

Now, you might have a lightning moment like I did of "wow, that's amazing, why don't we use it everywhere and all the time? Why is the `temp` method taught? Let me change all my swaps into XORs". Hold your horses buddy. There is a problem.

You might recall the concept of a instruction register. Every instruction your CPU runs reads its operands from registers, does the required computation and writes the result back. The catch with the `XOR` swap is that those three lines are a dependency chain. The second `XOR` needs the first one's result, and the third needs the second's. The processor can't run them side by side, each one has to wait for the previous one to finish.

And what about the `temp` version? `temp = x` and `x = y` are two independent copies. Also, modern compilers have an even cooler trick. When the values stay in registers there's no need to move anything at all. The CPU simply renames which register holds which value on the go (please welcome the out-of-order execution engine), and the compiler can just re-assign which variable lives in which register. Quite often it ends up being basically free.

While we are here, let's dive deeper. `XOR` swap only works when `x` and `y` are two different places. Do it on a variable with itself (say `arr[i]` and `arr[j]` where `i == j`) and the first XOR already zeroes it, because $a \oplus a = 0$. You sorted the array and lost an element. To combat this, you have to ensure `x` and `y` are two distinct memory locations, which adds an extra level of computation.

So, sadly, most of the time, `XOR` swap is worse than the `temp` version in terms of pure performance… However, hats off to the modern compilers for doing the hard work for us.

Thanks for reading (:
