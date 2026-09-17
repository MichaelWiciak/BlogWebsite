---
title: "Will Compilers Flatten XOR?"
excerpt: "Three XORs, no temp. Would the compiler see the trick?"
tags: [bitwise, compilers]
published: true
---

As mentioned in a previous Bit Trick Blog, you can swap two values without a temp variable. Have a look at that blog for a recap.

Using `XOR`s you can swap like this:

```
x = x ^ y
y = x ^ y
x = x ^ y
```

There are obvious problems with this approach on whether this is actually a performance improvement but something else bothered me. When the compiler looks at those three lines, does it keep them? Or does it see that the result is just a swap and flatten everything down to the same moves as the `temp` version?

```c
void swap_temp(int *x, int *y) {
    int tmp = *x;
    *x = *y;
    *y = tmp;
}

void swap_xor(int *x, int *y) {
    *x = *x ^ *y;
    *y = *x ^ *y;
    *x = *x ^ *y;
}
```

Both produce the same output. Below I converted them into assembly (Intel Syntax):

```
swap_temp:
    mov    eax, DWORD PTR [rdi]    # tmp = *x
    mov    edx, DWORD PTR [rsi]    # hold *y
    mov    DWORD PTR [rdi], edx    # *x = *y
    mov    DWORD PTR [rsi], eax    # *y = tmp
    ret
```

It has two loads and two stores. The `XOR` version:

```
swap_xor:
    mov    eax, DWORD PTR [rsi]    # load *y
    xor    eax, DWORD PTR [rdi]    # the mixture: *x ^ *y
    mov    DWORD PTR [rdi], eax    # *x = the mixture
    xor    eax, DWORD PTR [rsi]    # mixture ^ *y = the old *x
    mov    DWORD PTR [rsi], eax    # *y = the old *x
    xor    DWORD PTR [rdi], eax    # mixture ^ old *x = the old *y
    ret
```

They aren't identical! It must be a fluke, right? Well... I tested it on GCC 15 and Clang, on x86-64 and on ARM, all left it alone (using `-02` flag). We got 4 loads, three stores and 3 `XOR`s.

Why does it keep the chain? Because the swap touches memory, and what lands in memory is observable. The mixture $x \oplus y$ has to exist long enough to be written into `x`, so it has to be computed, and each `XOR` needs the previous one's result before it can run. The CPU has to wait.

So does the flattening ever happen?. Same swap, but the values stay in variables, with nothing stored to memory:

```c
int f_temp(int x, int y) {
    int tmp = x;
    x = y;
    y = tmp;
    return x * 2 + y;
}

int f_xor(int x, int y) {
    x = x ^ y;
    y = x ^ y;
    x = x ^ y;
    return x * 2 + y;
}
```

Ran it with `-O2` again on both compilers, and look at what now came out:

```
f_temp:
    lea    eax, [rdi + 2*rsi]
    ret

f_xor:
    lea    eax, [rdi + 2*rsi]
    ret
```

Both GCC and Clang turned the two functions into the same single `lea`. This is the register renaming trick. After those three XOR lines, `x` simply is the old `y` and `y` simply is the old `x`. There is no work left to do, so the compiler does none.

As such, when the swap stays in registers, it costs nothing, and both versions become the same. When the swap touches real memory (which is the only reason you would ever swap in the first place), the mixture has to exist, so the `XOR`s have to run. The compiler does not flatten it because it cannot.

Write the plain version. Modern compiler's make obvious code disappear. Give it clever code and it takes it at face value and if your code isn't optimal, you pay the price.

$(a \oplus b) \oplus b = a$ is a beautiful idea. However, it is not a swap strategy for real machines.
The machine already has a free swap mechanism, and it is called a register.

Thanks for reading (:

